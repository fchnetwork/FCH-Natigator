import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from "@angular/common";

import Timer = NodeJS.Timer;
import * as moment from "moment";
import { Duration } from "moment";

import { Subscription } from "rxjs/Subscription";
import { ActivatedRoute, Router } from "@angular/router";
import { genTransactionExplorerUrl } from "@shared/helpers/url-utils";

import { SwapState } from "@core/swap/models/swap-state.enum";
import { Chain } from "@core/swap/cross-chain/swap-template-service/chain.enum";
import { OpenErc20Swap } from "@core/swap/models/open-erc20-swap.model";
import { CounterEtherSwap } from "@core/swap/models/counter-ether-swap.model";
import { EtherSwapReference } from "@core/swap/cross-chain/swap-local-storage/swap-reference.model";
import { TokenError } from "@core/transactions/token-service/token.error";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { CounterEtherSwapService } from "@core/swap/cross-chain/counter-ether-swap-service/counter-ether-swap.service";
import { SwapLocalStorageService } from "@core/swap/cross-chain/swap-local-storage/swap-local-storage.service";
import { TokenService } from "@core/transactions/token-service/token.service";
import { OpenAerumErc20SwapService } from "@core/swap/cross-chain/open-aerum-erc20-swap-service/open-aerum-erc20-swap.service";

@Component({
  selector: 'app-opposite-swap-confirm',
  templateUrl: './opposite-swap-confirm.component.html',
  styleUrls: ['./opposite-swap-confirm.component.scss']
})
export class OppositeSwapConfirmComponent implements OnInit, OnDestroy {
  private routeSubscription: Subscription;
  private hash: string;
  private query: string;

  private localSwap: EtherSwapReference;
  private erc20Swap: OpenErc20Swap;

  secret: string;
  acceptedBy: string;
  sendAmount: number;
  sendCurrency: string;
  receiveAmount: number;

  canCloseSwap = false;

  swapLoaded = false;
  swapClosed = false;
  swapExpired = false;
  swapCancelled = false;

  processing = false;
  loadingEthereumSwap = false;
  loadingCounterSwap = false;

  swapTransactionExplorerUrl: string;

  swapLoadTimerInterval: Timer;
  swapExpireTimerInterval: Timer;
  timer: Duration;

  errors: string[] =[];

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private counterEtherSwapService: CounterEtherSwapService,
    private swapLocalStorageService: SwapLocalStorageService,
    private openAerumErc20SwapService: OpenAerumErc20SwapService,
    private tokenService: TokenService
  ) { }

  async ngOnInit() {
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
        this.logger.logError('Opposite swap load error', e);
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
    await this.loadErc20Swap();
    if (this.etherSwapFinishedOrExpired()) {
      return;
    }

    this.setupSwapExpireTimer();
    this.setupSwapLoadTimer();
  }

  private async loadErc20Swap() {
    this.loadingEthereumSwap = true;
    try {
      await this.tryLoadErc20Swap();
    } catch(e) {
      this.logger.logError(`ERC20 swap ${this.hash} loading failed`, e);
      throw e;
    }
    finally {
      this.loadingEthereumSwap = false;
    }
  }

  private async tryLoadErc20Swap() {
    this.erc20Swap = await this.openAerumErc20SwapService.checkSwap(this.hash);
    if (!this.erc20Swap || (this.erc20Swap.state === SwapState.Invalid)) {
      throw new Error('Cannot load erc20 swap: ' + this.hash);
    }

    const token = await this.tokenService.getTokensInfo(this.erc20Swap.erc20ContractAddress);
    if(!token) {
      throw new Error('Cannot load erc20 token: ' + this.erc20Swap.erc20ContractAddress);
    }
    this.sendAmount = this.erc20Swap.erc20Value / Math.pow(10, Number(token.decimals));
    this.sendCurrency = token.symbol;
    if (token.address.toLowerCase() !== this.localSwap.token.toLowerCase()) {
      this.showError('Counter swap currency is not the same as requested');
    }

    this.acceptedBy = this.erc20Swap.withdrawTrader;

    if (this.erc20Swap.state === SwapState.Closed) {
      this.swapClosed = true;
      this.logger.logMessage('Opening opposite swap already closed:' + this.hash);
      return;
    }

    if (this.erc20Swap.state === SwapState.Expired) {
      this.swapCancelled = true;
      this.logger.logMessage('Opening opposite swap already cancelled:' + this.hash);
      return;
    }

    const now = this.now();
    if (now >= this.erc20Swap.timelock) {
      this.onSwapExpired();
      this.logger.logMessage('Opening opposite swap expired but not cancelled:' + this.hash);
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

  private setupSwapLoadTimer(): void {
    this.swapLoadTimerInterval = setInterval(async () => {
      // NOTE: Prevent double loading from events
      if (this.loadingCounterSwap) {
        this.logger.logMessage(`Opposite swap ${this.hash} is already being loaded...`);
        return;
      }
      if (this.swapClosed || this.swapCancelled || this.swapExpired) {
        this.stopTimers();
        return;
      }
      this.loadingCounterSwap = true;
      try {
        const counterSwap = await this.counterEtherSwapService.checkSwap(this.hash, { wallet: this.localSwap.walletType, account: this.localSwap.account });
        if(!this.swapLoaded && counterSwap.state > 0) {
          this.logger.logMessage(`Create counter swap success: ${this.hash}`);
          this.swapLoaded = true;
          await this.tryLoadCounterSwap(counterSwap);
        }
      } catch(e) {
        this.logger.logError(`Opposite swap ${this.hash} loading failed`, e);
      }
      finally {
        this.loadingCounterSwap = false;
      }
    }, 5000);
  }

  private setupSwapExpireTimer(): void {
    this.swapExpireTimerInterval = setInterval(async () => {
      if (this.swapClosed || this.swapCancelled) {
        this.stopTimers();
        return;
      }
      const now = this.now();
      const timeoutInMilliseconds = (this.erc20Swap.timelock - now) * 1000;
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
    this.stopTimers();
    this.cleanErrors();
    this.showError('Your swap has been timed out and is expired. Please cancel it');
  }

  private stopTimers(): void {
    clearInterval(this.swapExpireTimerInterval);
    clearInterval(this.swapLoadTimerInterval);
  }

  private async tryLoadCounterSwap(swap: CounterEtherSwap) {
    this.cleanErrors();

    if(swap.state === SwapState.Invalid) {
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

    this.receiveAmount = swap.value;
    if (this.receiveAmount !== this.localSwap.ethAmount) {
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
      this.logger.logError('Opposite swap close error', e);
      this.notificationService.showMessage('Swap close error', 'Unhandled error');
    } finally {
      this.processing = false;
    }
  }

  private async closeSwap(): Promise<void> {
    this.swapTransactionExplorerUrl = null;
    await this.counterEtherSwapService.closeSwap(this.hash, this.secret, {
      wallet: this.localSwap.walletType,
      account: this.localSwap.account,
      hashCallback: (txHash) => this.onSwapHashReceived(txHash, Chain.Ethereum)
    });
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
      this.logger.logError('Opposite swap cancel error', e);
      this.notificationService.showMessage('Swap cancel error', 'Unhandled error');
    } finally {
      this.processing = false;
    }
  }

  private async cancelSwap(): Promise<void> {
    this.swapTransactionExplorerUrl = null;
    await this.openAerumErc20SwapService.expireSwap(this.hash, (hash) => this.onSwapHashReceived(hash, Chain.Aerum));
    this.swapCancelled = true;
    this.cleanErrors();
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
    if (this.swapExpireTimerInterval) {
      clearInterval(this.swapExpireTimerInterval);
    }
  }

}
