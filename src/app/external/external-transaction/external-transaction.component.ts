import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { StorageService } from "@core/general/storage-service/storage.service";

import { Token } from "@core/transactions/token-service/token.model";
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { TransactionService } from '@app/core/transactions/transaction-service/transaction.service';
import { AerumNameService } from '@app/core/aens/aerum-name-service/aerum-name.service';
import { TokenService } from '@app/core/transactions/token-service/token.service';
import { LoggerService } from "@core/general/logger-service/logger.service";
import { NotificationMessagesService } from '@core/general/notification-messages-service/notification-messages.service';
import { AddressKeyValidationService } from '@app/core/validation/address-key-validation.service';

@Component({
  selector: 'app-external-transaction',
  templateUrl: './external-transaction.component.html',
  styleUrls: ['./external-transaction.component.scss']
})
export class ExternalTransactionComponent implements OnDestroy {
  sub: any;
  isToken: boolean;
  redirectUrl: string;
  returnUrlFailed: string;
  assetAddress: string;
  orderId: string;
  tokenAddress: string;
  tokenInfo: any;
  params: Params;

  senderAddress: string;
  receiverAddress: string;
  senderAddressShort: string;
  receiverAddressShort: string;
  senderAvatar: string;
  receiverAvatar: string;
  amount: any;
  maxFee: string;
  fee: string;
  token: string;
  checkbox = false;
  checked = false;
  title: string;
  text: string;
  external = true;
  maxTransactionFee: any;
  maxTransactionFeeEth: any;
  tokenDecimals: number;
  currency: string;
  balance: number;
  receiverAddressHex: any;
  query: string;
  proceedAvailable: boolean = false;
  depositMore: boolean = false;
  privateKeyToImport: string;

  tokens: any;

  constructor(
    private logger: LoggerService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private nameService: AerumNameService,
    private notificationMessagesService: NotificationMessagesService,
    private addressKeyvalidation: AddressKeyValidationService
  ) {
    this.sub = this.route
      .queryParams
      .subscribe(async params => {
        if (params.query) {
          this.params = params;
          await this.init();
        }
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  async onPaperWalletImported() {
    await this.init();
  }

  private async init() {
    this.tokens = this.tokenService.getTokens();
    this.query = this.params.query;

    const parsed = JSON.parse(this.params.query);
    this.receiverAddress = parsed.to ? parsed.to : this.receiverAddress;
    [this.receiverAddressHex, this.tokenAddress] = await Promise.all([
      this.nameService.safeResolveNameOrAddress(this.receiverAddress),
      this.nameService.safeResolveNameOrAddress(parsed.tokenAddress ? parsed.tokenAddress : this.tokenAddress)
    ]);
    this.receiverAddressShort = this.cropAddress(this.receiverAddressHex);
    this.senderAddressShort = this.cropAddress(this.storageService.getSessionData('acc_address'));
    this.senderAddress = this.storageService.getSessionData('acc_address');
    this.senderAvatar = this.authService.generateCryptedAvatar(this.senderAddress);
    this.receiverAvatar = this.authService.generateCryptedAvatar(this.receiverAddressHex);
    this.amount = parsed.amount;
    this.redirectUrl = parsed.returnUrl ? parsed.returnUrl : this.redirectUrl;

    this.isToken = (!parsed.tokenAddress || parsed.tokenAddress === "0x0") ? false : true;

    if(parsed.privateKey && this.addressKeyvalidation.isPrivateKey(parsed.privateKey)) {
      this.privateKeyToImport = parsed.privateKey;
    }

    this.orderId = parsed.orderId ? parsed.orderId : this.orderId;
    this.returnUrlFailed = parsed.returnUrlFailed ? parsed.returnUrlFailed : this.returnUrlFailed;
    await this.prepareMessages();

    if (this.isToken) {
      this.getTokenInfo();
    } else {
      this.currency = 'Aero';
      await this.getMaxTransactionFee();
    }
    this.getBalance();
  }

  async prepareMessages() {
    if(!this.isToken) {
      this.text = 'Are you sure you would like to continue ?';
      return;
    }
    const resolvedAddress = await this.nameService.resolveNameOrAddress(this.receiverAddress);
    const checkedAddress: any = await this.transactionService.checkAddressCode(resolvedAddress);
    if (checkedAddress.length > 3) {
      this.title = 'WARNING!';
      this.text = 'You are sending tokens to a contract address that appears to support ERC223 standard. However, this is not a guarantee that your token transfer will be processed properly. Make sure you always trust a contract that you are sending your tokens to.';

      const res = await this.tokenService.tokenFallbackCheck(this.receiverAddress, 'tokenFallback(address,uint256,bytes)');
      if (!res) {
        this.text = 'The contract address you are sending your tokens to does not appear to support ERC223 standard, sending your tokens to this contract address will likely result in a loss of tokens sent. Please acknowledge your understanding of risks before proceeding further.';
        this.checkbox = true;
      }
    }
  }

  cropAddress(address: string) {
    return address.substr(0, 6) + "..." + address.substr(-4);
  }

  async accept() {
    const resolvedAddress = await this.nameService.resolveNameOrAddress(this.receiverAddress);
    const privateKey = this.storageService.getSessionData('private_key');
    const urls = {
      failed: this.returnUrlFailed,
      success: this.redirectUrl,
    };
    if (this.isToken) {
      const token: Token = await this.tokenService.getTokensInfo(this.tokenAddress);
      const decimals = token.decimals;
      this.transactionService.sendTokens(this.senderAddress, resolvedAddress, Number(this.amount * Math.pow(10, decimals)), this.tokenAddress, this.external, urls, this.orderId, token.symbol, decimals);
      this.proceedAvailable = false;
    } else {
      this.transactionService.transaction(privateKey, this.senderAddress, resolvedAddress, this.amount, null, this.external, urls, this.orderId, {});
      this.proceedAvailable = false;
    }
  }

  dismiss() {
    window.location.href = this.returnUrlFailed;
  }

  deposit() {
    return this.router.navigate(['/external/eth-wallet/'], {
      queryParams: {
        asset: this.assetAddress,
        amount: this.amount,
        query: this.query
      }
    });
  }

  async getMaxTransactionFee(): Promise<void> {
    const resolvedAddress = await this.nameService.safeResolveNameOrAddress(this.receiverAddress);
    if (resolvedAddress) {
      const data = !this.isToken
        ? ''
        : { type: 'token', contractAddress: this.tokenAddress, amount: Number(this.amount * Math.pow(10, this.tokenDecimals)) };
      try {
        const res = await this.transactionService.maxTransactionFee(resolvedAddress, data);
        this.maxTransactionFee = res[0];
        this.maxTransactionFeeEth = res[1];
      } catch (e) {
        // TODO: Leave previous catch here
        console.log(e);
      }
    } else {
      this.maxTransactionFee = 0.000;
    }
  }

  checkTokenCookies(targetToken): any {
    console.log(targetToken);
    for (const cookieToken of this.tokens) {
      console.log(cookieToken);
      if (cookieToken.address === targetToken) {
        return cookieToken;
      }
    }
    return false;
  }

  async getTokenInfo() {
    this.tokenInfo = this.checkTokenCookies(this.tokenAddress);
    console.log(this.tokenInfo);
    if (!this.tokenInfo) {
      try {
        this.tokenInfo = await this.tokenService.getTokensInfo(this.tokenAddress);
        this.notificationMessagesService.tokenNotInTheCookies();
      } catch (e) {
        this.proceedAvailable = false;
        this.logger.logError(`Error while ${this.tokenAddress} token loading`, e);
        this.notificationMessagesService.tokenNotConfigured();
      }
    }
    this.currency = this.tokenInfo.symbol;
    this.tokenDecimals = this.tokenInfo.decimals;
    this.getMaxTransactionFee();
  }

  getBalance() {
    if (!this.isToken) {
      this.transactionService.checkBalance(this.senderAddress).then((res) => {
        this.balance = res;
        this.proceedAvailable = (this.balance > this.amount);
        this.depositMore = !this.proceedAvailable;
      });
    } else {
      this.tokenService.getTokenBalance(this.tokenAddress).then((res) => {
        this.balance = Number(res) / Math.pow(10, this.tokenDecimals);
        this.proceedAvailable = !(this.balance < this.amount || !this.currency);
        this.depositMore = !this.proceedAvailable;
      });
    }
  }
}
