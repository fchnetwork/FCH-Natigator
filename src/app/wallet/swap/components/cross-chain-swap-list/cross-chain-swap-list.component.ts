import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { SwapListItem } from "@core/swap/models/swap-list-item.model";
import { SwapListService } from "@core/swap/cross-chain/swap-list-service/swap-list.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { SwapType } from '@app/core/swap/models/swap-type.enum';
import { isAndroidDevice } from '@app/shared/helpers/platform-utils';

@Component({
  selector: 'app-cross-chain-swap-list',
  templateUrl: './cross-chain-swap-list.component.html',
  styleUrls: ['./cross-chain-swap-list.component.scss']
})
export class CrossChainSwapListComponent implements OnInit {

  private readonly itemsPerPage = 5;
  private page = 0;
  private account: string;

  loading = false;
  canShowMore = true;
  swaps: SwapListItem[] = [];
  allSwaps: SwapListItem[] = [];
  perfectScrollbarDisabled = isAndroidDevice();

  constructor(
    private logger: LoggerService,
    private router: Router,
    private translateService: TranslateService,
    private authService: AuthenticationService,
    private notificationService: InternalNotificationService,
    private swapListService: SwapListService
  ) { }

  async ngOnInit() {
    this.account = this.authService.getAddress();
    await this.loadSwaps();
  }

  private async loadSwaps() {
    try {
      this.loading = true;
      this.allSwaps = (await this.swapListService.getSwapsByAccount(this.account))
        .sort((s1, s2) => s1.createdOn > s2.createdOn ? -1 : s1.createdOn < s2.createdOn ? 1 : 0);
      const skip = this.itemsPerPage * this.page; 
      this.swaps = this.allSwaps.slice(skip, this.itemsPerPage);
      this.canShowMore = this.swaps.length === this.itemsPerPage;
    }
    catch (e) {
      this.logger.logError('Error loading swaps', e);
      this.notificationService.showMessage(this.translate("SWAP.LIST.ERROR_LOAD_SWAPS"), this.translate("ERROR"));
    } finally {
      this.loading = false;
    }
  }

  async showMore() {
    try {

      this.page++;
      const skip = this.itemsPerPage * this.page;
      const pageSwaps = this.allSwaps.slice(skip, skip + this.itemsPerPage);
      this.swaps = this.swaps.concat(pageSwaps);
      this.canShowMore = pageSwaps.length === this.itemsPerPage;
    }
    catch (e) {
      this.logger.logError('Error loading swaps', e);
      this.notificationService.showMessage(this.translate("SWAP.LIST.ERROR_LOAD_SWAPS"), this.translate("ERROR"));
    }
  }

  deposit() {
    return this.router.navigate(['external/eth-wallet']);
  }

  withdraw() {
    return this.router.navigate(['external/eth-wallet'], { queryParams: { direction: 'opposite' }});
  }

  openSwap(swap: SwapListItem) {
    const url = swap.type === SwapType.Deposit ? 'external/confirm-swap' : 'external/confirm-opposite-swap';
    return this.router.navigate([url], {queryParams: {hash: swap.id}}); 
  }

  private translate(key: string): string {
    return this.translateService.instant(key);
  }

}
