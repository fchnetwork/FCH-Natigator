import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from "@angular/common";

import { Subscription } from "rxjs/Subscription";
import { ActivatedRoute } from "@angular/router";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { AerumErc20SwapService } from "@core/swap/cross-chain/aerum-erc20-swap-service/aerum-erc20-swap.service";
import { SwapLocalStorageService } from "@core/swap/cross-chain/swap-local-storage/swap-local-storage.service";

@Component({
  selector: 'app-swap-confirm',
  templateUrl: './swap-confirm.component.html',
  styleUrls: ['./swap-confirm.component.scss']
})
export class SwapConfirmComponent implements OnInit, OnDestroy {

  private routeSubscription: Subscription;
  private hash;
  private aerumAccount: string;

  secret: string;

  acceptedBy: string;
  sendAmount: number;
  receiveValue = 5;
  receiveCurrency = 'Aero';

  processed = false;
  expired = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private authService: AuthenticationService,
    private erc20SwapService: AerumErc20SwapService,
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
      this.logger.logError('Load error', e);
    }
  }

  async tryInit(param) {
    if (!param.hash) {
      throw new Error('Hash not specified');
    }
    this.hash = param.hash;

    const localSwap = this.swapLocalStorageService.loadSwapReference(this.hash);
    if(!localSwap) {
      throw new Error('Cannot load data for local swap: ' + this.hash);
    }

    this.secret = localSwap.secret;
    this.sendAmount = localSwap.amount;
    this.acceptedBy = localSwap.counterparty;

    const swap = await this.erc20SwapService.checkSwap(this.hash);
    if(!swap || !swap.hash) {
      throw new Error('Cannot load erc20 swap: ' + this.hash);
    }

    this.logger.logMessage('Swap loaded: ', swap);

    const now = this.now();
    this.expired = now >= Number(swap.timelock);
    this.logger.logMessage('Swap expired?: ' + this.expired);
  }

  async complete() {
    try {
      this.processed = true;
      this.notificationService.showMessage('Completing swap', 'In Progress...');
      await this.erc20SwapService.closeSwap(this.hash, this.secret);
      this.notificationService.showMessage('Swap Closed', 'Done');
      this.location.back();
    } catch (e) {
      this.logger.logError('Swap close error', e);
      this.notificationService.showMessage('Swap close error', 'Unhandled error');
      this.processed = false;
    }
  }

  async expire() {
    try {
      this.processed = true;
      this.notificationService.showMessage('Completing swap', 'In Progress...');
      await this.erc20SwapService.expireSwap(this.hash);
      this.notificationService.showMessage('Swap Closed', 'Done');
    } catch (e) {
      this.logger.logError('Swap close error', e);
      this.notificationService.showMessage('Swap close error', 'Unhandled error');
      this.processed = false;
    }
  }

  private now(): number {
    return Math.ceil(new Date().getTime() / 1000);
  }

  cancel() {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
