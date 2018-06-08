import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from "@angular/common";

import { sha3 } from "web3-utils";

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

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private notificationService: InternalNotificationService,
    private authService: AuthenticationService,
    private erc20SwapService: AerumErc20SwapService,
    private swapLocalStorageService: SwapLocalStorageService
  ) {
  }

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

    const swap = this.swapLocalStorageService.loadSwapReference(this.hash);
    if(!swap) {
      throw new Error('Cannot load data for local swap: ' + this.hash);
    }

    this.secret = swap.secret;
    this.sendAmount = swap.amount;
    this.acceptedBy = swap.counterparty;
  }

  async next() {
    try {
      this.notificationService.showMessage('Completing swap', 'In Progress...');

      const hash = sha3(this.secret);
      await this.erc20SwapService.closeSwap(hash, this.secret);

      this.notificationService.showMessage('Swap Closed', 'Done');
      this.location.back();
    } catch (e) {
      this.logger.logError('Swap close error', e);
      this.notificationService.showMessage('Swap close error', 'Unhandled error');
    }
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
