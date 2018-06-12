import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from "@angular/common";

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

  secret: string;

  acceptedBy: string;
  sendAmount: number;
  receiveCurrency: string;
  receiveAmount: number;

  processing = false;
  expired = false;
  swapCreated = false;
  done = false;

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
    private swapLocalStorageService: SwapLocalStorageService
  ) { }

  async ngOnInit() {
    const keystore = this.authService.getKeystore();
    this.aerumAccount = "0x" + keystore.address;
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

    setInterval(() => {
      const now = this.now();
      const timeoutInMilliseconds = (localSwap.timelock - now) * 1000;
      this.timer = moment.duration(timeoutInMilliseconds);
    }, 1000);

    this.secret = localSwap.secret;
    this.sendAmount = localSwap.amount;
    this.acceptedBy = localSwap.counterparty;

    this.aerumErc20SwapService.onOpen(this.hash, (err, event) => this.onOpenSwapHandler(this.hash, err, event));
    this.aerumErc20SwapService.onExpire(this.hash, (err, event) => this.onExpiredSwapHandler(this.hash, err, event));

    // NOTE: To not read previous events - try load swap
    await this.loadAerumSwap();
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
    this.expired = now >= Number(swap.timelock);
    this.logger.logMessage('Swap expired?: ' + this.expired);
    if (this.expired) {
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
      this.notificationService.showMessage('Swap Closed', 'Done');
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
      this.notificationService.showMessage('Completing swap', 'In Progress...');
      await this.aerumErc20SwapService.expireSwap(this.hash);
      this.notificationService.showMessage('Swap Closed', 'Done');
      this.done = true;
    } catch (e) {
      this.logger.logError('Swap close error', e);
      this.notificationService.showMessage('Swap close error', 'Unhandled error');
      this.processing = false;
    }
  }

  private now(): number {
    return Math.ceil(new Date().getTime() / 1000);
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

  cancel() {
    return this.router.navigate(['external/transaction'], {queryParams: { query: this.query }});
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
