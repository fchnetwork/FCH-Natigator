import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';

import { Token } from "@core/transactions/token-service/token.model";
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { TransactionService } from '@app/core/transactions/transaction-service/transaction.service';
import { AerumNameService } from '@app/core/aens/aerum-name-service/aerum-name.service';
import { TokenService } from '@app/core/transactions/token-service/token.service';
import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";

@Component({
  selector: 'app-external-transaction',
  templateUrl: './external-transaction.component.html',
  styleUrls: ['./external-transaction.component.scss']
})
export class ExternalTransactionComponent implements OnInit, OnDestroy {
  sub: any;
  isToken: boolean;
  redirectUrl: string;
  returnUrlFailed: string;
  assetAddress: string;
  orderId: string;
  contractAddress: string;

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
  totalAmount: any;
  tokenDecimals: any;
  currency: string;
  balance: any;
  receiverAddressHex: any;
  query: string;

  constructor(
    private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private nameService: AerumNameService,
  ) {
    this.prepareData();
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  prepareData() {
    this.sub = this.route
      .queryParams
      .subscribe(async params => {
        if (params.query) {
          this.query = params.query;
          const parsed = JSON.parse(params.query);
          this.receiverAddress = parsed.to ? parsed.to : this.receiverAddress;
          [this.receiverAddressHex, this.contractAddress] = await Promise.all([
            this.nameService.safeResolveNameOrAddress(this.receiverAddress),
            this.nameService.safeResolveNameOrAddress(parsed.contractAddress ? parsed.contractAddress : this.contractAddress)
          ]);
          this.receiverAddressShort = this.cropAddress(this.receiverAddressHex);
          this.senderAddressShort = this.cropAddress(this.sessionStorageService.retrieve('acc_address'));
          this.senderAddress = this.sessionStorageService.retrieve('acc_address');
          this.senderAvatar = this.authService.generateCryptedAvatar(this.senderAddress);
          this.receiverAvatar = this.authService.generateCryptedAvatar(this.receiverAddressHex);
          this.amount = parsed.amount;
          this.redirectUrl = parsed.returnUrl ? parsed.returnUrl : this.redirectUrl;
          this.assetAddress = parsed.assetAddress ? parsed.assetAddress : this.assetAddress;
          this.isToken = String(this.assetAddress) !== "0";
          this.orderId = parsed.orderId ? parsed.orderId : this.orderId;
          this.returnUrlFailed = parsed.returnUrlFailed ? parsed.returnUrlFailed : this.returnUrlFailed;
          await this.prepareMessages();
          this.getBalance();
          if (this.isToken) {
            this.getTokenInfo();
          } else {
            this.currency = 'Aero';
            await this.getMaxTransactionFee();
          }
        }
      });
  }

  async prepareMessages() {
    const resolvedAddress = await this.nameService.resolveNameOrAddress(this.receiverAddress);
    const checkedAddress: any = await this.transactionService.checkAddressCode(resolvedAddress);
    if (checkedAddress.length > 3) {
      this.title = 'WARNING!';
      this.text = 'You are sending tokens to a contract address that appears to support ERC223 standard. However, this is not a guarantee that your token transfer will be processed properly. Mmake sure you always trust a contract that you are sending your tokens to.';

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
    const privateKey = this.sessionStorageService.retrieve('private_key');
    const urls = {
      failed: this.returnUrlFailed,
      success: this.redirectUrl,
    };
    if (this.isToken) {
      const token: Token = await this.tokenService.getTokensInfo(this.contractAddress);
      const decimals = token.decimals;
      this.transactionService.sendTokens(this.senderAddress, resolvedAddress, Number(this.amount * Math.pow(10, decimals)), this.contractAddress, this.external, urls, this.orderId, token.symbol, decimals).then((res) => {
      });
    } else {
      this.transactionService.transaction(privateKey, this.senderAddress, resolvedAddress, this.amount, null, this.external, urls, this.orderId, {}).then(res => {
      }).catch((error) => {
        console.log(error);
        window.location.href = this.returnUrlFailed;
      });
    }
  }

  dismiss() {
    window.location.href = this.returnUrlFailed;
  }

  deposit() {
    this.router.navigate(['/external/eth-wallet/'], {
      queryParams: {
        asset: this.contractAddress,
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
        : { type: 'token', contractAddress: this.contractAddress, amount: Number(this.amount * Math.pow(10, this.tokenDecimals)) };

      try {
        const res = await this.transactionService.maxTransactionFee(resolvedAddress, data);
        this.maxTransactionFee = res[0];
        this.maxTransactionFeeEth = res[1];
        this.totalAmount = !this.isToken
          ? Number(this.amount) + Number(this.maxTransactionFeeEth)
          : Number(this.maxTransactionFeeEth);
      } catch (e) {
        // TODO: Leave previous catch here
        console.log(e);
      }
    } else {
      this.maxTransactionFee = 0.000;
      this.totalAmount = 0;
    }
  }

  getTokenInfo() {
    this.tokenService.getTokensInfo(this.contractAddress)
      .then((res: Token) => {
        this.currency = res.symbol;
        this.tokenDecimals = res.decimals;
        this.getMaxTransactionFee();
      })
      .catch((e) => {
        this.logger.logError(`Error while ${this.contractAddress} token loading`, e);
        this.notificationService.showMessage('Please configure the token first', 'Error');
      });
  }

  getBalance() {
    if(!this.isToken) {
      this.transactionService.checkBalance(this.senderAddress).then((res) => {
        console.log('is not token, balance: ', res);
        this.balance = res;
      });
    } else {
      this.tokenService.getTokenBalance(this.contractAddress).then((res)=>{
        console.log('is token, balance: ', res);
        this.balance = res;
      });
    }

  }

}
