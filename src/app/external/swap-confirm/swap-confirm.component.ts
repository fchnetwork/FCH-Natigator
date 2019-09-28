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
import { OpenEtherSwap } from "@core/swap/models/open-ether-swap.model";
import { OpenErc20Swap } from "@core/swap/models/open-erc20-swap.model";
import { CounterErc20Swap } from "@core/swap/models/counter-erc20-swap.model";
import { SwapReference } from "@core/swap/cross-chain/swap-local-storage/swap-reference.model";
import { TokenError } from "@core/transactions/token-service/token.error";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { CounterAerumErc20SwapService } from "@core/swap/cross-chain/counter-aerum-erc20-swap-service/counter-aerum-erc20-swap.service";
import { SwapLocalStorageService } from "@core/swap/cross-chain/swap-local-storage/swap-local-storage.service";
import { TokenService } from "@core/transactions/token-service/token.service";
import { EthereumTokenService } from "@core/ethereum/ethereum-token-service/ethereum-token.service";
import { OpenEtherSwapService } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.service";
import { OpenErc20SwapService } from "@core/swap/cross-chain/open-erc20-swap-service/open-erc20-swap.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-swap-confirm',
  templateUrl: './swap-confirm.component.html',
  styleUrls: ['./swap-confirm.component.scss']
})
export class SwapConfirmComponent implements OnInit, OnDestroy {

  private routeSubscription: Subscription;
  private hash;
  private walletTokenAddress;
  private query: string;

  private localSwap: SwapReference;
  private etherSwap: OpenEtherSwap;
  private erc20Swap: OpenErc20Swap;

  private ethAddress = '0x0';

  walletTokenSymbol;
  canLoadSwap = true;
  secret: string;
  acceptedBy: string;
  sendAmount: number;
  timelock: number;
  openedDate: Date;
  swapState: SwapState;
  receiveCurrency: string;
  receiveAmount: number;

  canCloseSwap = false;

  swapLoaded = false;
  swapClosed = false;
  swapExpired = false;
  swapCancelled = false;

  processing = false;
  loadingEthereumSwap = false;
  loadingErc20Swap = false;
  loadingCounterSwap = false;

  swapTransactionExplorerUrl: string;

  timerInterval: Timer;
  timer: Duration;
  counterSwapLoadTimerInterval: Timer;

  errors: string[] =[];

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private aerumErc20SwapService: CounterAerumErc20SwapService,
    private tokenService: TokenService,
    private ethereumTokenService: EthereumTokenService,
    private swapLocalStorageService: SwapLocalStorageService,
    private etherSwapService: OpenEtherSwapService,
    private erc20SwapService: OpenErc20SwapService,
    private translateService: TranslateService
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
        this.notificationService.showMessage(this.translateService.instant('EXTERNAL-SWAP.CONFIRM.PLEASE_CONFIGURE_THE_TOKEN_FIRST'), this.translateService.instant('ERROR'));
      } else {
        this.logger.logError('Deposit swap load error', e);
        this.notificationService.showMessage(this.translateService.instant('EXTERNAL-SWAP.CONFIRM.CANNOT_LOAD_SWAP'), this.translateService.instant('ERROR'));
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

    if(this.walletTokenAddress === this.ethAddress) {
      await this.loadEthereumSwap();
    }else {
      await this.loadErc20Swap();
    }

    await this.loadAerumSwap();
    if (this.swapFinishedOrExpired()) {
      return;
    }
    this.setupTimer();
    this.setupCounterSwapLoadTimer();
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
    this.timelock = this.etherSwap.timelock;
    this.swapState = this.etherSwap.state;
    this.validateSwapState();
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
    this.erc20Swap = await this.erc20SwapService.checkSwap(this.hash);
    if (!this.erc20Swap || (this.erc20Swap.state === SwapState.Invalid)) {
      throw new Error('Cannot load erc20 swap: ' + this.hash);
    }
    this.acceptedBy = this.erc20Swap.withdrawTrader;
    this.timelock = this.erc20Swap.timelock;
    this.swapState = this.erc20Swap.state;
    this.sendAmount = this.erc20Swap.erc20Value;
    this.validateSwapState();

    let token = this.ethereumTokenService.getTokens().find(t => t.address === this.walletTokenAddress);
    if(!token) {
      token = await this.ethereumTokenService.getNetworkTokenInfo(this.localSwap.walletType, this.walletTokenAddress, this.localSwap.account);
      if(token && token.symbol) {
        this.ethereumTokenService.addToken(token);
      }
      else {
        this.canLoadSwap = false;
        this.showError(`The token used in the swap is not added to the wallet. Please add it first: ${this.walletTokenAddress}`);
        throw new Error(`Cannot load erc20 token: ${this.walletTokenAddress}`);
      }
    }
  }

  private validateSwapState(){
    if (this.swapState === SwapState.Closed) {
      this.swapClosed = true;
      this.logger.logMessage('Opening swap already closed:' + this.hash);
      return;
    }

    if (this.swapState === SwapState.Expired) {
      this.swapCancelled = true;
      this.logger.logMessage('Opening swap already cancelled:' + this.hash);
      return;
    }

    const now = this.now();
    if (now >= this.timelock) {
      this.onSwapExpired();
      this.logger.logMessage('Opening swap expired but not cancelled:' + this.hash);
      return;
    }
  }

  private swapFinishedOrExpired(): boolean {
    return this.swapClosed || this.swapCancelled || this.swapExpired;
  }

  private loadLocalSwap() {
    this.localSwap = this.swapLocalStorageService.loadSwapReference(this.hash);
    console.log(this.localSwap);
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

  private setupTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.swapClosed || this.swapCancelled) {
        this.stopTimers();
        return;
      }

      const now = this.now();
      const timeoutInMilliseconds = (this.timelock - now) * 1000;
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
    clearInterval(this.timerInterval);
    clearInterval(this.counterSwapLoadTimerInterval);
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
    this.logger.logMessage('Swap check loaded: ', swap);
    if(!swap || (swap.state === SwapState.Invalid)) {
      this.logger.logMessage('Cannot load erc20 swap: ' + this.hash);
      this.canCloseSwap = false;
      return;
    }

    this.swapLoaded = true;

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

    if(this.swapCancelled || this.swapClosed) {
      this.canCloseSwap = false;
      return;
    }

    if (swap.state === SwapState.Closed) {
      this.logger.logMessage('Counter swap already closed');
      this.canCloseSwap = false;
      this.swapClosed = true;
      return;
    }

    const now = this.now();
    if ((now >= swap.timelock) || (swap.state === SwapState.Expired)) {
      this.logger.logMessage('Counter swap expired');
      this.canCloseSwap = false;
      this.showError('Counter swap expired');
      return;
    }

    this.canCloseSwap = true;
  }

  private setupCounterSwapLoadTimer(): void {
    this.counterSwapLoadTimerInterval = setInterval(async () => {
      if (this.swapCancelled || this.swapExpired) {
        this.stopTimers();
        return;
      }
      if(!this.swapLoaded) {
        await this.loadAerumSwap();
      }
    }, 5000);
  }

  async complete() {
    try {
      this.processing = true;
      this.notificationService.showMessage(this.translateService.instant('EXTERNAL-SWAP.CONFIRM.COMPLETING_DEPOSIT_SWAP'), 'In Progress...');
      await this.closeSwap();
      this.notificationService.showMessage(this.translateService.instant('EXTERNAL-SWAP.CONFIRM.DEPOSIT_SWAP_CLOSED'), this.translateService.instant('DONE'));
    } catch (e) {
      this.logger.logError('Deposit swap close error', e);
      this.notificationService.showMessage(this.translateService.instant('EXTERNAL-SWAP.CONFIRM.DEPOSIT_SWAP_CLOSE_ERROR'), this.translateService.instant('ERROR'));
    } finally {
      this.processing = false;
    }
  }

  private async closeSwap(): Promise<void> {
    this.swapTransactionExplorerUrl = null;
    await this.aerumErc20SwapService.closeSwap(this.hash, this.secret, (hash) => this.onSwapHashReceived(hash, Chain.Fuchsia));
    this.canCloseSwap = false;
    this.swapClosed = true;
    this.cleanErrors();
  }

  async cancel() {
    try {
      this.processing = true;
      this.notificationService.showMessage(this.translateService.instant('EXTERNAL-SWAP.CONFIRM.CANCELLING_DEPOSIT_SWAP'), this.translateService.instant('IN_PROGRESS'));
      await this.cancelSwap();
      this.notificationService.showMessage(this.translateService.instant('EXTERNAL-SWAP.CONFIRM.DEPOSIT_SWAP_CANCELED'), this.translateService.instant('DONE'));
    } catch (e) {
      this.logger.logError('Deposit swap cancel error', e);
      this.notificationService.showMessage(this.translateService.instant('EXTERNAL-SWAP.CONFIRM.DEPOSIT_SWAP_CANCEL_ERROR'), this.translateService.instant('ERROR'));
    } finally {
      this.processing = false;
    }
  }

  private async cancelSwap(): Promise<void> {
    this.swapTransactionExplorerUrl = null;

    if(this.walletTokenAddress === this.ethAddress){
      await this.etherSwapService.expireSwap(this.hash, {
        hashCallback: (hash) => this.onSwapHashReceived(hash, Chain.Ethereum),
        account: this.localSwap.account,
        wallet: this.localSwap.walletType
      });
    }else{
      await this.erc20SwapService.expireSwap(this.hash, {
        hashCallback: (hash) => this.onSwapHashReceived(hash, Chain.Ethereum),
        account: this.localSwap.account,
        wallet: this.localSwap.walletType
      });
    }

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
    if (this.query) {
      return this.router.navigate(['external/transaction'], {queryParams: {query: this.query}});
    }
    return this.router.navigate(['wallet/swap']);
  }

  explorerLink(link) {
    window.open(
      link,
      '_blank'
    );
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
      this.stopTimers();
    }
  }
}
