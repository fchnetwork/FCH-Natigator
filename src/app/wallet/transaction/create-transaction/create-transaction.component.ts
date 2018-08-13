import { SessionStorageService } from 'ngx-webstorage';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { ValidateService } from '@app/core/validation/validate.service';
import Web3 from "web3";
import { toBigNumberString } from "@shared/helpers/number-utils";
import { bigNumbersPow, bigNumbersMultiply, bigNumberToString } from "@shared/helpers/number-utils";
import { DialogResult } from '@aerum/ui';
import { TransactionSignData } from '@app/wallet/transaction/components/transaction-sign-modal/transaction-sign-modal.component';
import { StorageService } from "@core/general/storage-service/storage.service";

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
  amount: any = 0;
  transactions: any[];
  includedDataLength: number;
  walletBalance: any;
  aeroBalance: number;
  sendEverything: boolean;
  transactionMessage: any;
  addressQR: string;
  maxTransactionFee = 0;
  maxTransactionFeeEth = 0;
  totalAmount = 0;
  tokens: any;
  selectedToken = {
    symbol: 'Aero',
    address: null,
    balance: 0,
    decimals: null,
  };
  web3: Web3;
  sub: any;
  isToken = false;
  moreOptionsData = {
    data: '',
    limit: '',
    price: '',
    selectedToken: 'Aero',
  };
  showedMore = false;
  updateInterval: any;

  constructor(
    private logger: LoggerService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private modalSrv: ModalService,
    private clipboardService: ClipboardService,
    private notificationService: InternalNotificationService,
    private transactionService: TransactionService,
    private storageService: StorageService,
    private tokenService: TokenService,
    private nameService: AerumNameService,
    private validateService: ValidateService,
    private sessionStorageService: SessionStorageService
  ) {
    this.loadUserData().catch((e) => this.logger.logError(e));
    this.updateInterval = setInterval(async () => {
      // TODO: Do we really need to update user data every n seconds? Possibly only aero amount
      await this.loadUserData();
      await this.updateTokensBalance();
    }, 3000);

    this.web3 = this.authService.getWeb3();
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
    if (event && this.selectedToken.symbol === 'Aero') {
      this.amount = Number(this.walletBalance) - Number(this.maxTransactionFeeEth);
    } else {
      this.amount = this.walletBalance;
    }
    this.sendEverything = event;
  }

  async copyToClipboard() {
    await this.clipboardService.copy(this.senderAddress);
    this.notificationService.showMessage('Copied to clipboard!', 'Done');
  }

  async loadUserData(): Promise<void> {
    const keystore = await this.authService.showKeystore();
    const getBalance = this.transactionService.checkBalance(keystore.address);
    const getQR = this.authService.createQRcode("0x" + keystore.address);
    const [accBalance, qrCode] = await Promise.all([getBalance, getQR]);
    this.senderAddress = "0x" + keystore.address;
    if (this.selectedToken.symbol === 'Aero') {
      this.walletBalance = accBalance;
    }
    this.aeroBalance = accBalance;
    this.addressQR = qrCode;
  }

  async getMaxTransactionFee(): Promise<void> {
    const resolvedAddress = await this.nameService.safeResolveNameOrAddress(this.receiverAddress);
    if (resolvedAddress) {
      const data = this.selectedToken.symbol === 'Aero'
        ? (this.showedMore && this.moreOptionsData.data ? this.moreOptionsData.data : '')
        : { type: 'token', contractAddress: this.selectedToken.address, amount: Number(this.amount * Math.pow(10, this.selectedToken.decimals)) };
      try {
        const res = await this.transactionService.maxTransactionFee(resolvedAddress, data);
        this.maxTransactionFee = res[0];
        this.maxTransactionFeeEth = res[1];
        this.moreOptionsData.price = res[2];
        this.moreOptionsData.limit = res[3];
        if(this.sendEverything && this.selectedToken.symbol === 'Aero') {
          this.setSendEverything(true);
        }
        this.totalAmount = this.selectedToken.symbol === 'Aero'
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
    this.amount = toBigNumberString(this.amount);
    this.safeGetMaxTransactionFee();
  }

  safeGetMaxTransactionFee() {
    this.getMaxTransactionFee().catch((error) => this.logger.logError(error));
  }

  async handleSelectChange() {
    if (this.selectedToken.symbol === 'Aero') {
      this.isToken = false;
      this.walletBalance = this.aeroBalance;
    } else {
      this.isToken = true;
      this.walletBalance = this.selectedToken.balance;
      this.moreOptionsData.data = null;
    }
    this.moreOptionsData.selectedToken = this.selectedToken.symbol;
    this.safeGetMaxTransactionFee();
    this.calculateTransactionData();
  }

  async openTransactionConfirm(transactionData: TransactionSignData) {
    const resolvedAddress = await this.nameService.resolveNameOrAddress(this.receiverAddress);
    const result = await this.modalSrv.openTransactionConfirm(transactionData);
    if (result.dialogResult === DialogResult.OK) {
      const privateKey = this.sessionStorageService.retrieve('private_key');
      const address = this.sessionStorageService.retrieve('acc_address');
      if (this.selectedToken.symbol === 'Aero' && !this.isToken) {
        this.transactionService.transaction(privateKey, address, resolvedAddress, this.amount, this.showedMore && this.moreOptionsData.data ? this.moreOptionsData.data : null, false, {}, null, this.moreOptionsData).then(res => {
          this.transactionMessage = res;
        }).catch((error) => {
          this.notificationService.showMessage(`An error occurred during transaction. Please review all the fields and try again. ${error}`, 'Error');
          console.log(error);
        });
      } else if (this.selectedToken.address) {
        const decimals = bigNumbersPow(10, this.selectedToken.decimals);
        const amount = bigNumbersMultiply(this.amount, decimals);
        const convertedAmount = "0x" + bigNumberToString(amount, 16);

        this.transactionService.sendTokens(address, resolvedAddress, convertedAmount, this.selectedToken.address, false, {}, null, this.selectedToken.symbol, this.selectedToken.decimals).then((res) => {
          this.transactionMessage = res;
        }).catch((error) => {
          this.notificationService.showMessage(`An error occurred during sending the tokens. Please review all the fields and try again. ${error}`, 'Error');
          console.log(error);
        });
      }
    }
  }

  async send() : Promise<void> {
    const valid = this.validateService.validateForm(this.txnForm, 'All fields are valid');
    if(valid) {
      this.transactionMessage = "";
      const resolvedAddress = await this.nameService.safeResolveNameOrAddress(this.receiverAddress);
      if (!resolvedAddress) {
        alert("You need to add a receiver address");
        return;
      } else {
        const res: any = await this.transactionService.checkAddressCode(resolvedAddress);

        const transaactionData = new TransactionSignData();
        transaactionData.text = null;
        transaactionData.checkbox = false;
        transaactionData.senderAddress= this.senderAddress;
        transaactionData.receiverAddress= resolvedAddress;
        transaactionData.amount= this.amount;
        transaactionData.fee= this.maxTransactionFeeEth;
        transaactionData.maxFee= this.maxTransactionFee;
        transaactionData.token= this.selectedToken.symbol;

        if (res.length > 3) {
          transaactionData.text = 'You are sending tokens to a contract address that appears to support ERC223 standard. However, this is not a guarantee that your token transfer will be processed properly. Mmake sure you always trust a contract that you are sending your tokens to.';
          const res = await this.tokenService.tokenFallbackCheck(resolvedAddress, 'tokenFallback(address,uint256,bytes)');
          if (!res) {
            transaactionData.text = 'The contract address you are sending your tokens to does not appear to support ERC223 standard, sending your tokens to this contract address will likely result in a loss of tokens sent. Please acknowledge your understanding of risks before proceeding further.';
            transaactionData.checkbox = true;
          }
          await this.openTransactionConfirm(transaactionData);
        } else {
          await this.openTransactionConfirm(transaactionData);
        }
      }
    }
  }

  isFormValid() {
    const validFrom = this.txnForm.status === 'VALID';
    let validAmount = false;
    if(this.selectedToken.address == null) {
      validAmount = this.amount > 0 && this.aeroBalance >= this.amount;
    } else {
      validAmount = this.amount > 0 && this.selectedToken.balance >= this.amount;
    }
    return validFrom && validAmount;
  }

  async moreOptionsChange(event) {
    this.moreOptionsData = event.data;
    if (event.type === 'data') {
      await this.getMaxTransactionFee();
      this.calculateTransactionData();
    }
  }

  ngOnDestroy() {
    clearInterval(this.updateInterval);
  }

  async calculateTransactionData() {
    let data;
    const resolvedAddress = await this.nameService.safeResolveNameOrAddress(this.receiverAddress);
    if(this.isToken) {
      const tokensContract = this.transactionService.generateContract(this.selectedToken.address);
      data = tokensContract.methods.transfer(resolvedAddress, this.amount).encodeABI();
      data = this.web3.utils.toHex(data);
      this.includedDataLength = Number(data.length - 2) / 2;
    } else if(this.moreOptionsData.data) {
      data = this.moreOptionsData.data;
      data = this.web3.utils.toHex(data);
      this.includedDataLength = Number(data.length - 2) / 2;
    }
  }

}
