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
import { SwapReference } from "@core/swap/cross-chain/swap-local-storage/swap-reference.model";
import { TokenError } from "@core/transactions/token-service/token.error";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { SwapLocalStorageService } from "@core/swap/cross-chain/swap-local-storage/swap-local-storage.service";
import { TokenService } from "@core/transactions/token-service/token.service";
import { EthereumTokenService } from "@core/ethereum/ethereum-token-service/ethereum-token.service";

import { OpenErc20Swap } from "@core/swap/models/open-erc20-swap.model";

import { OpenAerumErc20SwapService } from "@core/swap/cross-chain/open-aerum-erc20-swap-service/open-aerum-erc20-swap.service";
import { CounterEtherSwapService } from "@core/swap/cross-chain/counter-ether-swap-service/counter-ether-swap.service";
import { CounterErc20SwapService } from "@core/swap/cross-chain/counter-erc20-swap-service/counter-erc20-swap.service";

@Component({
  selector: 'app-opposite-swap-confirm',
  templateUrl: './opposite-swap-confirm.component.html',
  styleUrls: ['./opposite-swap-confirm.component.scss']
})
export class OppositeSwapConfirmComponent implements OnInit, OnDestroy {
  private routeSubscription: Subscription;
  private hash: string;
  private ethAddress = '0x0';
  private walletTokenAddress;
  private walletTokenSymbol;
  private query: string;

  private localSwap: SwapReference;

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

  loadingErc20Swap = false;
  loadingCounterEtherSwap = false;
  loadingCounterErc20Swap = false;

  swapTransactionExplorerUrl: string;

  openedDate: Date;

  counterEtherSwapLoadTimerInterval: Timer;
  counterErc20SwapLoadTimerInterval: Timer;
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
    private counterErc20SwapService: CounterErc20SwapService,
    private swapLocalStorageService: SwapLocalStorageService,
    private openAerumErc20SwapService: OpenAerumErc20SwapService,
    private tokenService: TokenService,
    private ethereumTokenService: EthereumTokenService
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
        this.logger.logError('Withdrawal swap load error', e);
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
    if (!this.swapFinishedOrExpired()) {
      this.setupSwapExpireTimer();
    }

    if(this.walletTokenAddress === this.ethAddress) {
      this.setupCounterEtherSwapLoadTimer();
    } else {
      this.setupCounterErc20SwapLoadTimer();
    }
  }

  private async loadErc20Swap() {
    this.loadingErc20Swap = true;
    try {
      await this.tryLoadErc20Swap();
    } catch(e) {
      this.logger.logError(`ERC20 swap ${this.hash} loading failed`, e);
      throw e;
    }
    finally {
      this.loadingErc20Swap = false;
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
    this.sendAmount = this.erc20Swap.erc20Value;
    this.sendCurrency = token.symbol;
    if (token.address.toLowerCase() !== this.localSwap.token.toLowerCase()) {
      this.showError('Counter swap currency is not the same as requested');
    }

    this.acceptedBy = this.erc20Swap.withdrawTrader;

    if (this.erc20Swap.state === SwapState.Closed) {
      this.swapClosed = true;
      this.logger.logMessage('Opening withdrawal swap already closed:' + this.hash);
      return;
    }

    if (this.erc20Swap.state === SwapState.Expired) {
      this.swapCancelled = true;
      this.logger.logMessage('Opening withdrawal swap already cancelled:' + this.hash);
      return;
    }

    const now = this.now();
    if (now >= this.erc20Swap.timelock) {
      this.onSwapExpired();
      this.logger.logMessage('Opening withdrawal swap expired but not cancelled:' + this.hash);
      return;
    }
  }

  private swapFinishedOrExpired(): boolean {
    return this.swapClosed || this.swapCancelled || this.swapExpired;
  }

  private loadLocalSwap() {
    this.localSwap = this.swapLocalStorageService.loadSwapReference(this.hash);
    if (!this.localSwap) {
      throw new Error('Cannot load data for local swap: ' + this.hash);
    }
    this.walletTokenAddress = this.localSwap.walletTokenAddress;
    this.walletTokenSymbol = this.localSwap.walletTokenSymbol;
    this.secret = this.localSwap.secret;
    if(this.localSwap.opened) {
      this.openedDate = new Date(Number(this.localSwap.opened));
    }
  }

  private setupCounterEtherSwapLoadTimer(): void {
    this.counterEtherSwapLoadTimerInterval = setInterval(async () => {
      // NOTE: Prevent double loading from events
      if (this.loadingCounterEtherSwap) {
        this.logger.logMessage(`Withdrawal swap ${this.hash} is already being loaded...`);
        return;
      }
      if (this.swapCancelled || this.swapExpired) {
        this.stopTimers();
        return;
      }
      this.loadingCounterEtherSwap = true;
      try {
        const counterSwap = await this.counterEtherSwapService.checkSwap(this.hash, { wallet: this.localSwap.walletType, account: this.localSwap.account });
        if(!this.swapLoaded && counterSwap.state > 0) {
          this.logger.logMessage(`Create counter swap success: ${this.hash}`);
          this.swapLoaded = true;
          this.tryLoadCounterSwap(counterSwap.state, counterSwap.timelock, counterSwap.value);
          await this.tryLoadCounterSwap(counterSwap.state, counterSwap.timelock, counterSwap.value);
        }
      } catch(e) {
        this.logger.logError(`Withdrawal swap ${this.hash} loading failed`, e);
      }
      finally {
        this.loadingCounterEtherSwap = false;
      }
    }, 5000);
  }

  private setupCounterErc20SwapLoadTimer(): void {
    this.counterErc20SwapLoadTimerInterval = setInterval(async () => {
      // NOTE: Prevent double loading from events
      if (this.loadingCounterErc20Swap) {
        this.logger.logMessage(`Withdrawal swap ${this.hash} is already being loaded...`);
        return;
      }
      if (this.swapCancelled || this.swapExpired) {
        this.stopTimers();
        return;
      }
      this.loadingCounterErc20Swap = true;
      try {
        const counterSwap = await this.counterErc20SwapService.checkSwap(this.hash, { wallet: this.localSwap.walletType, account: this.localSwap.account });
        if(!this.swapLoaded && counterSwap.state > 0) {
          this.logger.logMessage(`Create counter swap success: ${this.hash}`);
          this.swapLoaded = true;

          const token = await this.ethereumTokenService.getNetworkTokenInfo(this.localSwap.walletType, counterSwap.erc20ContractAddress, this.localSwap.account);
          const value = Number(counterSwap.erc20Value) / Math.pow(10, token.decimals);
          this.tryLoadCounterSwap(counterSwap.state, counterSwap.timelock, value);
        }
      } catch(e) {
        this.logger.logError(`Withdrawal swap ${this.hash} loading failed`, e);
      }
      finally {
        this.loadingCounterErc20Swap = false;
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
    clearInterval(this.counterEtherSwapLoadTimerInterval);
    clearInterval(this.counterErc20SwapLoadTimerInterval);
  }

  private tryLoadCounterSwap(state: SwapState, timelock: number, amount: number) {
    this.cleanErrors();

    if(state === SwapState.Invalid) {
      this.logger.logMessage('Cannot load erc20 swap: ' + this.hash);
      this.canCloseSwap = false;
      return;
    }

    this.receiveAmount = amount;
    if (this.receiveAmount !== this.localSwap.tokenAmount) {
      this.showError('Counter swap amount / rate is not the same as requested');
    }

    if(this.swapCancelled || this.swapClosed) {
      this.canCloseSwap = false;
      return;
    }

    if (state === SwapState.Closed) {
      this.logger.logMessage('Counter swap already closed');
      this.canCloseSwap = false;
      this.swapClosed = true;
      this.showError('Counter swap already closed');
      return;
    }

    const now = this.now();
    if ((now >= timelock) || (state === SwapState.Expired)) {
      this.logger.logMessage('Counter swap expired');
      this.canCloseSwap = false;
      this.showError('Counter swap expired');
      return;
    }

    this.canCloseSwap = true;
  }

  async complete() {
    try {
      this.processing = true;
      this.notificationService.showMessage('Completing withdrawal swap', 'In Progress...');
      await this.closeSwap();
      this.notificationService.showMessage('Withdrawal swap closed', 'Done');
    } catch (e) {
      this.logger.logError('Withdrawal swap close error', e);
      this.notificationService.showMessage('Withdrawal swap close error', 'Unhandled error');
    } finally {
      this.processing = false;
    }
  }

  private async closeSwap(): Promise<void> {
    this.swapTransactionExplorerUrl = null;
    if(this.walletTokenAddress === this.ethAddress) {
      await this.counterEtherSwapService.closeSwap(this.hash, this.secret, {
        wallet: this.localSwap.walletType,
        account: this.localSwap.account,
        hashCallback: (txHash) => this.onSwapHashReceived(txHash, Chain.Ethereum)
      });
    }else {
      await this.counterErc20SwapService.closeSwap(this.hash, this.secret, {
        wallet: this.localSwap.walletType,
        account: this.localSwap.account,
        hashCallback: (txHash) => this.onSwapHashReceived(txHash, Chain.Ethereum)
      });
    }
    this.canCloseSwap = false;
    this.swapClosed = true;
    this.cleanErrors();
  }

  async cancel() {
    try {
      this.processing = true;
      this.notificationService.showMessage('Cancelling withdrawal swap', 'In Progress...');
      await this.cancelSwap();
      this.notificationService.showMessage('Withdrawal swap canceled', 'Done');
    } catch (e) {
      this.logger.logError('Withdrawal swap cancel error', e);
      this.notificationService.showMessage('Withdrawal swap cancel error', 'Unhandled error');
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
    return this.router.navigate(['wallet/swap']);
  }

  private showError(message: string): void {
    this.errors.push(message);
  }

  private cleanErrors(): void {
    this.errors = [];
  }

  explorerLink(link) {
    window.open(
      link,
      '_blank'
    );
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
