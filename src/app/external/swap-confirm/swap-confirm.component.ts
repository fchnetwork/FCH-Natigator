import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from "@angular/common";

import Timer = NodeJS.Timer;
import * as moment from "moment";
import { Duration } from "moment";

import { Subscription } from "rxjs/Subscription";
import { ActivatedRoute, Router } from "@angular/router";

import { genTransactionExplorerUrl } from "@shared/helpers/url-utils";
import { Chain } from "@core/swap/cross-chain/swap-template-service/chain.enum";
import { SwapState } from "@core/swap/models/swap-state.enum";
import { OpenEtherSwap } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.model";
import { CounterErc20Swap } from "@core/swap/cross-chain/counter-aerum-erc20-swap-service/counter-erc20-swap.model";
import { EtherSwapReference } from "@core/swap/cross-chain/swap-local-storage/swap-reference.model";
import { TokenError } from "@core/transactions/token-service/token.error";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { CounterAerumErc20SwapService } from "@core/swap/cross-chain/counter-aerum-erc20-swap-service/counter-aerum-erc20-swap.service";
import { SwapLocalStorageService } from "@core/swap/cross-chain/swap-local-storage/swap-local-storage.service";
import { TokenService } from "@core/transactions/token-service/token.service";
import { OpenEtherSwapService } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.service";
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
  private localSwap: EtherSwapReference;
  private etherSwap: OpenEtherSwap;

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
  loadingEthereumSwap = false;
  loadingCounterSwap = false;

  swapTransactionExplorerUrl: string;

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
    private aerumErc20SwapService: CounterAerumErc20SwapService,
    private tokenService: TokenService,
    private swapLocalStorageService: SwapLocalStorageService,
    private ethereumAuthService: EthereumAuthenticationService,
    private etherSwapService: OpenEtherSwapService
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

    this.loadLocalSwap();

    await this.loadEthereumSwap();
    if (this.etherSwapFinishedOrExpired()) {
      return;
    }

    this.setupTimer();

    this.aerumErc20SwapService.onOpen(this.hash, (err, event) => this.onOpenSwapHandler(this.hash, err, event));
    this.aerumErc20SwapService.onExpire(this.hash, (err, event) => this.onExpiredSwapHandler(this.hash, err, event));

    await this.loadAerumSwap();
  }

  private async loadEthereumSwap() {
    this.loadingEthereumSwap = true;
    try {
      await this.tryLoadEthereumSwap();
    } catch(e) {
      this.logger.logError(`Ethereum swap ${this.hash} loading failed`, e);
      throw e;
    }
    finally {
      this.loadingEthereumSwap = false;
    }
  }

  private async tryLoadEthereumSwap() {
    this.etherSwap = await this.etherSwapService.checkSwap(this.hash);
    if (!this.etherSwap || (this.etherSwap.state === SwapState.Invalid)) {
      throw new Error('Cannot load ether swap: ' + this.hash);
    }

    this.sendAmount = this.etherSwap.value;
    this.acceptedBy = this.etherSwap.withdrawTrader;

    if (this.etherSwap.state === SwapState.Closed) {
      this.swapClosed = true;
      this.logger.logMessage('Opening swap already closed:' + this.hash);
      return;
    }

    if (this.etherSwap.state === SwapState.Expired) {
      this.swapCancelled = true;
      this.logger.logMessage('Opening swap already cancelled:' + this.hash);
      return;
    }

    const now = this.now();
    if (now >= this.etherSwap.timelock) {
      this.onSwapExpired();
      this.logger.logMessage('Opening swap expired but not cancelled:' + this.hash);
      return;
    }
  }

  private etherSwapFinishedOrExpired(): boolean {
    return this.swapClosed || this.swapCancelled || this.swapExpired;
  }

  private loadLocalSwap() {
    this.localSwap = this.swapLocalStorageService.loadSwapReference(this.hash);
    if (!this.localSwap) {
      throw new Error('Cannot load data for local swap: ' + this.hash);
    }
    this.secret = this.localSwap.secret;
  }

  private setupTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.swapClosed || this.swapCancelled) {
        this.stopTimer();
        return;
      }

      const now = this.now();
      const timeoutInMilliseconds = (this.etherSwap.timelock - now) * 1000;
      if (timeoutInMilliseconds < 0) {
        this.onSwapExpired();
        return;
      }
      this.timer = moment.duration(timeoutInMilliseconds);
    }, 500);
  }

  private onSwapExpired(): void {
    this.swapExpired = true;
    this.canCloseSwap = false;
    this.timer = moment.duration(0);
    this.stopTimer();
    this.cleanErrors();
    this.showError('Your swap has been timed out and is expired. Please cancel it');
  }

  private stopTimer(): void {
    clearInterval(this.timerInterval);
  }

  private async loadAerumSwap() {
    // NOTE: Prevent double loading from events
    if (this.loadingCounterSwap) {
      this.logger.logMessage(`Swap ${this.hash} is already being loaded...`);
      return;
    }

    this.loadingCounterSwap = true;
    try {
      await this.tryLoadAerumSwap();
    } catch(e) {
      this.logger.logError(`Swap ${this.hash} loading failed`, e);
    }
    finally {
      this.loadingCounterSwap = false;
    }
  }

  private async tryLoadAerumSwap() {
    if (this.swapExpired) {
      this.logger.logMessage('Swap already expired. No sense to load counter swap');
      return;
    }

    this.cleanErrors();

    const swap: CounterErc20Swap = await this.aerumErc20SwapService.checkSwap(this.hash);
    this.logger.logMessage('Swap loaded: ', swap);

    if(!swap || (swap.state === SwapState.Invalid)) {
      this.logger.logMessage('Cannot load erc20 swap: ' + this.hash);
      this.canCloseSwap = false;
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
    if (token.address.toLowerCase() !== this.localSwap.token.toLowerCase()) {
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
    this.swapTransactionExplorerUrl = null;
    await this.aerumErc20SwapService.closeSwap(this.hash, this.secret, (hash) => this.onSwapHashReceived(hash, Chain.Aerum));
    this.canCloseSwap = false;
    this.swapClosed = true;
    this.cleanErrors();
  }

  async cancel() {
    try {
      this.processing = true;
      this.notificationService.showMessage('Cancelling swap', 'In Progress...');
      await this.cancelSwap();
      this.notificationService.showMessage('Swap canceled', 'Done');
    } catch (e) {
      this.logger.logError('Swap cancel error', e);
      this.notificationService.showMessage('Swap cancel error', 'Unhandled error');
    } finally {
      this.processing = false;
    }
  }

  private async cancelSwap(): Promise<void> {
    this.swapTransactionExplorerUrl = null;
    await this.etherSwapService.expireSwap(this.hash, {
      hashCallback: (hash) => this.onSwapHashReceived(hash, Chain.Ethereum),
      account: this.localSwap.account,
      wallet: this.localSwap.walletType
    });
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

  private onSwapHashReceived(hash: string, chain: Chain): void {
    this.swapTransactionExplorerUrl = genTransactionExplorerUrl(hash, chain);
  }

  close() {
    if(this.query) {
      return this.router.navigate(['external/transaction'], {queryParams: {query: this.query}});
    }
    this.location.back();
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
