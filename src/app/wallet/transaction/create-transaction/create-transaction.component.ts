import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { ModalService } from '@app/core/general/modal-service/modal.service';
import { ClipboardService } from '@app/core/general/clipboard-service/clipboard.service';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';
import { TransactionService } from '@app/core/transactions/transaction-service/transaction.service';
import { TokenService } from '@app/core/transactions/token-service/token.service';
import { AerumNameService } from "@core/aens/aerum-name-service/aerum-name.service";
import { AddressValidator } from "@shared/validators/address.validator";
import { LoggerService } from "@core/general/logger-service/logger.service";
import Web3 from "web3";

declare var window: any;

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss']
})
export class CreateTransactionComponent implements OnInit, OnDestroy {

  myBalance: any;
  txnForm: FormGroup = this.formBuilder.group({});

  senderAddress: string;
  receiverAddress: string;
  amount = 0;
  transactions: any[];
  includedDataLength: number;
  walletBalance: number;
  aeroBalance: number;
  sendEverything: boolean;
  transactionMessage: any;
  addressQR: string;
  maxTransactionFee = 0;
  maxTransactionFeeEth = 0;
  totalAmount = 0;
  tokens: any;
  selectedToken = {
    symbol: 'AERO',
    address: null,
    balance: 0,
    decimals: null,
  };
  web3: Web3;
  sub: any;
  isToken = false;
  redirectUrl: string;
  external = false;
  hash: any;
  querySenderAddress: any;
  assetAddress: any;
  timeStamp: any;
  returnUrlFailed: any;
  moreOptionsData = {
    data: '',
    limit: '',
    price: '',
    selectedToken: 'AERO',
  };
  showedMore = false;
  updateInterval: any;
  orderId: string;

  constructor(
    private logger: LoggerService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private modalSrv: ModalService,
    private clipboardService: ClipboardService,
    private notificationService: InternalNotificationService,
    private transactionService: TransactionService,
    private sessionStorageService: SessionStorageService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private nameService: AerumNameService) {

    this.loadUserData().catch((e) => this.logger.logError(e));
    this.updateInterval = setInterval(async () => {
      // TODO: Do we really need to update user data every n seconds? Possibly only aero amount
      await this.loadUserData();
      await this.updateTokensBalance();
    }, 3000);

    this.web3 = this.authService.initWeb3();
  }

  async ngOnInit() {
    this.walletBalance = this.myBalance;
    this.includedDataLength = 0;
    this.handleInputsChange();
    this.tokens = this.tokenService.getTokens();

    // work on these more with https://regex101.com
    const regexAmount = "^[0-9\.\-\/]+$"; // issues with decimals and validation - needs more work
    this.txnForm = this.formBuilder.group({
      senderAddress: [this.senderAddress, [AddressValidator.isAddress]],
      receiverAddress: [this.receiverAddress, [], [new AddressValidator(this.nameService).isAddressOrAensName]],
      amount: [null, [Validators.required, Validators.pattern(regexAmount)]],
      selectedToken: [this.selectedToken, [Validators.required]]
    });

    this.sub = this.route
      .queryParams
      .subscribe(async params => {
        if (params) {
          this.external = !this.isEmptyObject(params);
          this.senderAddress = params.from ? params.from : this.senderAddress;
          this.querySenderAddress = params.from;
          this.receiverAddress = params.to ? params.to : this.receiverAddress;
          this.amount = params.amount ? params.amount : this.amount;
          this.isToken = params.assetAddress !== "0";
          this.redirectUrl = params.returnUrl ? params.returnUrl : this.redirectUrl;
          // this.hash = parsed.hash ? parsed.hash : this.hash;
          this.assetAddress = params.assetAddress ? params.assetAddress : this.assetAddress;
          this.orderId = params.orderId ? params.orderId : this.orderId;
          // this.timeStamp = parsed.timeStamp ? parsed.timeStamp : this.timeStamp;
          this.returnUrlFailed = params.returnUrlFailed ? params.returnUrlFailed : this.returnUrlFailed;
          await this.getMaxTransactionFee();
          if (this.external) {
            await this.send();
          }
        }
      });
  }


  async updateTokensBalance(): Promise<void> {
    this.tokens = await this.tokenService.updateTokensBalance();
    for (let i = 0; i < this.tokens.length; i++) {
      if (this.selectedToken.symbol === this.tokens[i].symbol) {
        this.walletBalance = this.tokens[i].balance;
        return;
      } else {
        this.walletBalance = this.aeroBalance;
      }
    }
  }

  setSendEverything(event) {
    if (event) {
      this.amount = Number(this.walletBalance) - Number(this.maxTransactionFeeEth);
    }
    this.sendEverything = event;
  }

  async copyToClipboard() {
    await this.clipboardService.copy(this.senderAddress);
    this.notificationService.showMessage('Copied to clipboard!');
  }

  async loadUserData(): Promise<void> {
    const keystore = await this.authService.showKeystore();
    const getBalance = this.transactionService.checkBalance(keystore.address);
    const getQR = this.authService.createQRcode("0x" + keystore.address);
    const [accBalance, qrCode] = await Promise.all([getBalance, getQR]);
    this.senderAddress = "0x" + keystore.address;
    if (this.selectedToken.symbol === 'AERO') {
      this.walletBalance = accBalance;
    }
    this.aeroBalance = accBalance;
    this.addressQR = qrCode;
  }

  async getMaxTransactionFee(): Promise<void> {
    const resolvedAddress = await this.nameService.safeResolveNameOrAddress(this.receiverAddress);
    if (resolvedAddress) {
      const data = this.selectedToken.symbol === 'AERO'
        ? (this.showedMore && this.moreOptionsData.data ? this.moreOptionsData.data : '')
        : { type: 'token', contractAddress: this.selectedToken.address, amount: Number(this.amount * Math.pow(10, this.selectedToken.decimals)) };

      try {
        const res = await this.transactionService.maxTransactionFee(resolvedAddress, data);
        this.maxTransactionFee = res[0];
        this.maxTransactionFeeEth = res[1];
        this.moreOptionsData.price = res[2];
        this.moreOptionsData.limit = res[3];
        this.totalAmount = this.selectedToken.symbol === 'AERO'
          ? Number(this.amount) + Number(this.maxTransactionFeeEth)
          : Number(this.maxTransactionFeeEth);
      } catch (e) {
        // TODO: Leave previous catch here
        // console.log(e);
      }
    } else {
      this.maxTransactionFee = 0.000;
      this.totalAmount = 0;
    }
  }

  showMore() {
    this.showedMore = !this.showedMore;
    if (!this.showedMore) {
      this.moreOptionsData = {
        data: '',
        limit: '',
        price: '',
        selectedToken: this.selectedToken.symbol,
      };
    }
  }

  showTransactions() { }

  handleInputsChange() {
    this.safeGetMaxTransactionFee();
  }

  safeGetMaxTransactionFee() {
    this.getMaxTransactionFee().catch((error) => this.logger.logError(error));
  }

  async handleSelectChange() {
    if (this.selectedToken.symbol === 'AERO') {
      this.isToken = false;
      this.walletBalance = this.aeroBalance;
    } else {
      this.isToken = true;
      this.walletBalance = this.selectedToken.balance;
      this.moreOptionsData.data = null;
    }
    this.moreOptionsData.selectedToken = this.selectedToken.symbol;
    await this.getMaxTransactionFee();
  }

  async openTransactionConfirm(message) {
    const resolvedAddress = await this.nameService.resolveNameOrAddress(this.receiverAddress);
    const result = await this.modalSrv.openTransactionConfirm(message, this.external);
    const urls = { success: this.redirectUrl, failed: this.returnUrlFailed };
    const validHash = true;
    if (result.result === true && validHash) {
      const privateKey = this.sessionStorageService.retrieve('private_key');
      const address = this.sessionStorageService.retrieve('acc_address');
      if (this.selectedToken.symbol === 'AERO' && !this.isToken) {
        this.transactionService.transaction(privateKey, address, resolvedAddress, this.amount, this.showedMore && this.moreOptionsData.data ? this.moreOptionsData.data : null, this.external, urls, this.orderId, this.moreOptionsData).then(res => {
          this.transactionMessage = res;
        }).catch((error) => {
          console.log(error);
          if (this.external) {
            window.location.href = urls.failed;
          }
        });
      } else if (this.selectedToken.address) {
        this.transactionService.sendTokens(address, resolvedAddress, Number(this.amount * Math.pow(10, this.selectedToken.decimals)), this.selectedToken.address, this.external, urls, this.orderId, this.moreOptionsData).then((res) => {
          this.transactionMessage = res;
        });
      }
    } else if (this.external) {
      window.location.href = this.returnUrlFailed;
    }
  }

  async send() : Promise<void> {
    this.transactionMessage = "";
    const resolvedAddress = await this.nameService.safeResolveNameOrAddress(this.receiverAddress);
    if (!resolvedAddress) {
      alert("You need to add a receiver address");
      return;
    } else {
      const res: any = await this.transactionService.checkAddressCode(resolvedAddress);
      const message = {
        title: null,
        text: null,
        checkbox: false,
        sender: this.senderAddress,
        recipient: resolvedAddress,
        amount: this.amount,
        fee: this.maxTransactionFeeEth,
        maxFee: this.maxTransactionFee,
        token: this.selectedToken.symbol
      };

      if (res.length > 3) {
        message.title = 'WARNING!';
        message.text = 'You are sending tokens to a contract address that appears to support ERC223 standard. However, this is not a guarantee that your token transfer will be processed properly. Mmake sure you always trust a contract that you are sending your tokens to.';

        const res = await this.tokenService.tokenFallbackCheck(resolvedAddress, 'tokenFallback(address,uint256,bytes)');
        if (!res) {
          message.text = 'The contract address you are sending your tokens to does not appear to support ERC223 standard, sending your tokens to this contract address will likely result in a loss of tokens sent. Please acknowledge your understanding of risks before proceeding further.';
          message.checkbox = true;
        }
        await this.openTransactionConfirm(message);
      } else {
        await this.openTransactionConfirm(message);
      }
    }
  }

  async moreOptionsChange(event) {
    this.moreOptionsData = event.data;
    if (event.type === 'data') {
      await this.getMaxTransactionFee();
    }
  }

  private isEmptyObject(obj): boolean {
    return (obj && (Object.keys(obj).length === 0));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    clearInterval(this.updateInterval);
  }

}
