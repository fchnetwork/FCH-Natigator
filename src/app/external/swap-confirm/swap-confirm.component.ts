import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from "@angular/common";

import Timer = NodeJS.Timer;
import * as moment from "moment";
import { Duration } from "moment";

import { Subscription } from "rxjs/Subscription";
import { ActivatedRoute, Router } from "@angular/router";

import { TokenError } from "@core/transactions/token-service/token.error";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { AerumErc20SwapService } from "@core/swap/cross-chain/aerum-erc20-swap-service/aerum-erc20-swap.service";
import { SwapLocalStorageService } from "@core/swap/cross-chain/swap-local-storage/swap-local-storage.service";
import { TokenService } from "@core/transactions/token-service/token.service";
import { SwapReference } from "@core/swap/cross-chain/swap-local-storage/swap-reference.model";
import { EtherSwapService } from "@core/swap/cross-chain/ether-swap-service/ether-swap.service";
import { InjectedWeb3ContractExecutorService } from "@core/ethereum/injected-web3-contract-executor-service/injected-web3-contract-executor.service";
import { SelfSignedEthereumContractExecutorService } from "@core/ethereum/self-signed-ethereum-contract-executor-service/self-signed-ethereum-contract-executor.service";
import { EthWalletType } from "@external/models/eth-wallet-type.enum";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";

@Component({
  selector: 'app-swap-confirm',
  templateUrl: './swap-confirm.component.html',
  styleUrls: ['./swap-confirm.component.scss']
})
export class SwapConfirmComponent implements OnInit, OnDestroy {

  private routeSubscription: Subscription;
  private hash;
  private aerumAccount: string;
  private query: string;
  private localSwap: SwapReference;

  secret: string;

  acceptedBy: string;
  sendAmount: number;
  receiveCurrency: string;
  receiveAmount: number;

  processing = false;
  expired = false;
  swapCreated = false;
  done = false;

  timerInterval: Timer;
  timer: Duration;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private authService: AuthenticationService,
    private aerumErc20SwapService: AerumErc20SwapService,
    private tokenService: TokenService,
    private swapLocalStorageService: SwapLocalStorageService,
    private ethereumAuthService: EthereumAuthenticationService,
    private etherSwapService: EtherSwapService,
    private injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService,
    private selfSignedEthereumContractExecutorService: SelfSignedEthereumContractExecutorService
  ) { }

  async ngOnInit() {
    this.aerumAccount = this.authService.getAddress();
    this.routeSubscription = this.route.queryParams.subscribe(param => this.init(param));
  }

  async init(param) {
    try {
      await this.tryInit(param);
    } catch (e) {
      if(e instanceof TokenError) {
        this.logger.logError('Cannot load token information', e);
        this.notificationService.showMessage('Please configure the token first', 'Error');
      } else {
        this.logger.logError('Swap load error', e);
        this.notificationService.showMessage('Cannot load swap', 'Error');
      }
    }
  }

  async tryInit(param) {
    if (!param.hash) {
      throw new Error('Hash not specified');
    }

    this.hash = param.hash;
    this.query = param.query;

    const localSwap = this.swapLocalStorageService.loadSwapReference(this.hash);
    if(!localSwap) {
      throw new Error('Cannot load data for local swap: ' + this.hash);
    }

    this.localSwap = localSwap;
    this.secret = localSwap.secret;
    this.sendAmount = localSwap.amount;
    this.acceptedBy = localSwap.counterparty;

    this.setupTimer();

    this.aerumErc20SwapService.onOpen(this.hash, (err, event) => this.onOpenSwapHandler(this.hash, err, event));
    this.aerumErc20SwapService.onExpire(this.hash, (err, event) => this.onExpiredSwapHandler(this.hash, err, event));
  }

  private setupTimer(): void {
    this.timerInterval = setInterval(() => {
      const now = this.now();
      let timeoutInMilliseconds = (this.localSwap.timelock - now) * 1000;
      if (timeoutInMilliseconds < 0) {
        this.expired = true;
        this.swapCreated = false;
        timeoutInMilliseconds = 0;
      }

      this.timer = moment.duration(timeoutInMilliseconds);
    }, 1000);
  }

  private async loadAerumSwap() {
    const swap = await this.aerumErc20SwapService.checkSwap(this.hash);
    if(!swap || !swap.hash) {
      this.logger.logMessage('Cannot load erc20 swap: ' + this.hash);
      this.swapCreated = false;
      return;
    }

    this.logger.logMessage('Swap loaded: ', swap);

    const now = this.now();
    const counterpartyExpired = now >= Number(swap.timelock);
    this.logger.logMessage('Counter swap expired?: ' + counterpartyExpired);
    if (counterpartyExpired) {
      this.swapCreated = false;
      return;
    }

    const token = await this.tokenService.getTokensInfo(swap.erc20ContractAddress);
    if(!token) {
      throw new Error('Cannot load erc20 token: ' + swap.erc20ContractAddress);
    }

    this.receiveCurrency = token.symbol;
    this.receiveAmount = Number(swap.erc20Value) / Math.pow(10, Number(token.decimals));

    this.swapCreated = true;
  }

  async complete() {
    try {
      this.processing = true;
      this.notificationService.showMessage('Completing swap', 'In Progress...');
      await this.aerumErc20SwapService.closeSwap(this.hash, this.secret);
      this.notificationService.showMessage('Swap closed', 'Done');
      this.done = true;
    } catch (e) {
      this.logger.logError('Swap close error', e);
      this.notificationService.showMessage('Swap close error', 'Unhandled error');
      this.processing = false;
    }
  }

  async expire() {
    try {
      this.processing = true;
      this.notificationService.showMessage('Expiring swap', 'In Progress...');
      await this.configureSwapService();
      await this.etherSwapService.expireSwap(this.hash);
      this.notificationService.showMessage('Swap expired', 'Done');
      this.done = true;
    } catch (e) {
      this.logger.logError('Swap expire error', e);
      this.notificationService.showMessage('Swap expire error', 'Unhandled error');
      this.processing = false;
    }
  }

  private async onOpenSwapHandler(hash: string, err, event) {
    if (err) {
      this.logger.logError(`Create counter swap error: ${hash}`, err);
      this.notificationService.showMessage('Error while listening for swap', 'Unhandled error');
    } else {
      this.logger.logMessage(`Create counter swap success: ${hash}`, event);
      await this.loadAerumSwap();
    }
  }

  private onExpiredSwapHandler(hash: string, err, event) {
    if (err) {
      this.logger.logError(`Create counter swap error: ${hash}`, err);
      this.notificationService.showMessage('Error while listening for swap', 'Unhandled error');
    } else {
      this.logger.logMessage(`Create counter swap success: ${hash}`, event);
    }
    this.swapCreated = false;
  }

  private now(): number {
    return Math.ceil(new Date().getTime() / 1000);
  }

  // TODO: Duplication with create swap service. Possibly there is way to make this better
  private async configureSwapService() {
    if (this.localSwap.walletType === EthWalletType.Injected) {
      await this.configureInjectedSwapService();
    } else {
      this.configureImportedSwapService();
    }
  }

  private async configureInjectedSwapService() {
    const account = this.localSwap.account;
    const injectedWeb3 = await this.ethereumAuthService.getInjectedWeb3();
    if (!injectedWeb3) {
      this.notificationService.showMessage('Injected web3 not provided', 'Error');
      throw Error('Injected web3 not provided');
    }

    const accounts = await injectedWeb3.eth.getAccounts() || [];
    if (!accounts.length) {
      this.notificationService.showMessage('Please login in Mist / Metamask', 'Error');
      throw Error('Cannot get accounts from selected provider');
    }

    if (accounts.every(acc => acc !== account)) {
      this.notificationService.showMessage(`Please select ${account} and retry`, 'Error');
      throw Error(`Incorrect Mist / Metamask account selected. Expected ${account}`);
    }

    this.injectedWeb3ContractExecutorService.init(injectedWeb3, account);
    this.etherSwapService.useContractExecutor(this.injectedWeb3ContractExecutorService);
  }

  private configureImportedSwapService() {
    const account = this.localSwap.account;
    const ethWeb3 = this.ethereumAuthService.getWeb3();
    const importedAccount = this.ethereumAuthService.getEthereumAccount(account);
    if (!importedAccount) {
      this.notificationService.showMessage(`Cannot load imported account ${account}`, 'Error');
      throw Error(`Cannot load imported account ${account}`);
    }

    this.selfSignedEthereumContractExecutorService.init(ethWeb3, importedAccount.address, importedAccount.privateKey);
    this.etherSwapService.useContractExecutor(this.selfSignedEthereumContractExecutorService);
  }

  cancel() {
    return this.router.navigate(['external/transaction'], {queryParams: { query: this.query }});
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
