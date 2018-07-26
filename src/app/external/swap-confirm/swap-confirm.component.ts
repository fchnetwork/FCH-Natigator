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
  swapState: SwapState;
  receiveCurrency: string;
  receiveAmount: number;

  canCloseSwap = false;

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
    private erc20SwapService: OpenErc20SwapService
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
        this.logger.logError('Deposit swap load error', e);
        this.notificationService.showMessage('Cannot load deposit swap', 'Error');
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

    if(this.walletTokenAddress === this.ethAddress){
      await this.loadEthereumSwap();
    }else{
      await this.loadErc20Swap();
    }

    if (this.swapFinishedOrExpired()) {
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
    if (!this.localSwap) {
      throw new Error('Cannot load data for local swap: ' + this.hash);
    }
    this.walletTokenAddress = this.localSwap.walletTokenAddress;
    this.walletTokenSymbol = this.localSwap.walletTokenSymbol;
    this.secret = this.localSwap.secret;
  }

  private setupTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.swapClosed || this.swapCancelled) {
        this.stopTimer();
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
      this.swapClosed = true;
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
      this.notificationService.showMessage('Completing deposit swap', 'In Progress...');
      await this.closeSwap();
      this.notificationService.showMessage('Deposit swap closed', 'Done');
    } catch (e) {
      this.logger.logError('Deposit swap close error', e);
      this.notificationService.showMessage('Deposit swap close error', 'Unhandled error');
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
      this.notificationService.showMessage('Cancelling deposit swap', 'In Progress...');
      await this.cancelSwap();
      this.notificationService.showMessage('Deposit swap canceled', 'Done');
    } catch (e) {
      this.logger.logError('Deposit swap cancel error', e);
      this.notificationService.showMessage('Deposit swap cancel error', 'Unhandled error');
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
      clearInterval(this.timerInterval);
    }
  }
}
