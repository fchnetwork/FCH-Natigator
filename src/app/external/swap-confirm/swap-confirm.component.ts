import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from "@angular/common";

import { environment } from "@env/environment";

import Timer = NodeJS.Timer;
import * as moment from "moment";
import { Duration } from "moment";

import { Subscription } from "rxjs/Subscription";
import { ActivatedRoute, Router } from "@angular/router";

import { SwapState } from "@core/swap/cross-chain/aerum-erc20-swap-service/swap-state.enum";
import { Erc20Swap } from "@core/swap/cross-chain/aerum-erc20-swap-service/erc20-swap.model";
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

  canCloseSwap = false;

  swapClosed = false;
  swapExpired = false;
  swapCancelled = false;

  processing = false;

  expireSwapTransactionExplorerUrl: string;

  timerInterval: Timer;
  timer: Duration;

  errors: string[] =[];

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
    this.sendAmount = localSwap.ethAmount;
    this.acceptedBy = localSwap.counterparty;

    this.setupTimer();

    this.aerumErc20SwapService.onOpen(this.hash, (err, event) => this.onOpenSwapHandler(this.hash, err, event));
    this.aerumErc20SwapService.onExpire(this.hash, (err, event) => this.onExpiredSwapHandler(this.hash, err, event));

    await this.loadAerumSwap();
  }

  private setupTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.swapClosed || this.swapCancelled) {
        this.stopTimer();
        return;
      }

      const now = this.now();
      const timeoutInMilliseconds = (this.localSwap.timelock - now) * 1000;
      if (timeoutInMilliseconds < 0) {
        this.onSwapExpired();
        return;
      }
      this.timer = moment.duration(timeoutInMilliseconds);
    }, 1000);
  }

  private onSwapExpired(): void {
    this.swapExpired = true;
    this.canCloseSwap = false;
    this.timer = moment.duration(0);
    this.stopTimer();
    this.cleanErrors();
    this.showError('Your swap timed out. Please expire it');
  }

  private stopTimer(): void {
    clearInterval(this.timerInterval);
  }

  private async loadAerumSwap() {
    if (this.swapExpired) {
      this.logger.logMessage('Swap already expired. No sense to load counter swap');
      return;
    }

    this.cleanErrors();

    const swap: Erc20Swap = await this.aerumErc20SwapService.checkSwap(this.hash);
    this.logger.logMessage('Swap loaded: ', swap);

    if(!swap || (swap.state === SwapState.Invalid)) {
      this.logger.logMessage('Cannot load erc20 swap: ' + this.hash);
      this.canCloseSwap = false;
      this.showError('Counter swap not created yet');
      return;
    }

    if (swap.state === SwapState.Closed) {
      this.logger.logMessage('Counter swap already closed');
      this.canCloseSwap = false;
      this.showError('Counter swap already closed');
      return;
    }

    const now = this.now();
    if ((now >= swap.timelock) || (swap.state === SwapState.Expired)) {
      this.logger.logMessage('Counter swap expired');
      this.canCloseSwap = false;
      this.showError('Counter swap expired');
      return;
    }

    const token = await this.tokenService.getTokensInfo(swap.erc20ContractAddress);
    if(!token) {
      throw new Error('Cannot load erc20 token: ' + swap.erc20ContractAddress);
    }

    this.receiveCurrency = token.symbol;
    if (token.address.toLowerCase() !== this.localSwap.token) {
      this.showError('Counter swap currency is not the same as requested');
    }

    this.receiveAmount = Number(swap.erc20Value) / Math.pow(10, Number(token.decimals));
    if (this.receiveAmount !== this.localSwap.tokenAmount) {
      this.showError('Counter swap amount / rate is not the same as requested');
    }

    this.canCloseSwap = true;
  }

  async complete() {
    try {
      this.processing = true;
      this.notificationService.showMessage('Completing swap', 'In Progress...');
      await this.closeSwap();
      this.notificationService.showMessage('Swap closed', 'Done');
    } catch (e) {
      this.logger.logError('Swap close error', e);
      this.notificationService.showMessage('Swap close error', 'Unhandled error');
    } finally {
      this.processing = false;
    }
  }

  private async closeSwap(): Promise<void> {
    this.expireSwapTransactionExplorerUrl = null;
    await this.aerumErc20SwapService.closeSwap(this.hash, this.secret);
    this.canCloseSwap = false;
    this.swapClosed = true;
    this.cleanErrors();
  }

  async expire() {
    try {
      this.processing = true;
      this.notificationService.showMessage('Expiring swap', 'In Progress...');
      await this.expireSwap();
      this.notificationService.showMessage('Swap expired', 'Done');
    } catch (e) {
      this.logger.logError('Swap expire error', e);
      this.notificationService.showMessage('Swap expire error', 'Unhandled error');
    } finally {
      this.processing = false;
    }
  }

  private async expireSwap(): Promise<void> {
    await this.configureSwapService();
    this.expireSwapTransactionExplorerUrl = null;
    await this.etherSwapService.expireSwap(this.hash, (hash) => this.onExpireSwapHashReceived(hash));
    this.swapCancelled = true;
    this.cleanErrors();
  }

  private async onOpenSwapHandler(hash: string, err, event) {
    if (err) {
      this.logger.logError(`Create counter swap error: ${hash}`, err);
      this.notificationService.showMessage('Error while listening for swap', 'Unhandled error');
    } else {
      this.logger.logMessage(`Create counter swap success: ${hash}`, event);
    }
    await this.loadAerumSwap();
  }

  private async onExpiredSwapHandler(hash: string, err, event) {
    if (err) {
      this.logger.logError(`Create counter swap error: ${hash}`, err);
      this.notificationService.showMessage('Error while listening for swap', 'Unhandled error');
    } else {
      this.logger.logMessage(`Create counter swap success: ${hash}`, event);
    }
    await this.loadAerumSwap();
  }

  private now(): number {
    return Math.ceil(new Date().getTime() / 1000);
  }

  private onExpireSwapHashReceived(hash: string): void {
    if (hash) {
      this.expireSwapTransactionExplorerUrl = environment.ethereum.explorerUrl + hash;
    }
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

  private showError(message: string): void {
    this.errors.push(message);
  }

  private cleanErrors(): void {
    this.errors = [];
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
