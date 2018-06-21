import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { SwapListItem } from "@core/swap/models/swap-list-item.model";
import { SwapListService } from "@core/swap/on-chain/swap-list-service/swap-list.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";

@Component({
  selector: 'app-on-chain-swap-list',
  templateUrl: './on-chain-swap-list.component.html',
  styleUrls: ['./on-chain-swap-list.component.scss']
})
export class OnChainSwapListComponent implements OnInit {

  private readonly itemsPerPage = 5;
  private page = 0;
  private account: string;

  loading = false;
  canShowMore = true;
  swaps: SwapListItem[] = [];

  constructor(
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
      this.swaps = await this.swapListService.getSwapsByAccountPaged(this.account, this.itemsPerPage, this.page);
      this.canShowMore = this.swaps.length === this.itemsPerPage;
    }
    catch (e) {
      this.notificationService.showMessage(this.translate("SWAP.LIST.ERROR_LOAD_SWAPS"), this.translate("ERROR"));
    } finally {
      this.loading = false;
    }
  }

  async showMore() {
    try {
      this.page++;
      const pageSwaps = await this.swapListService.getSwapsByAccountPaged(this.account, this.itemsPerPage, this.page);
      this.canShowMore = pageSwaps.length === this.itemsPerPage;
      this.swaps = this.swaps.concat(pageSwaps);
    }
    catch (e) {
      this.notificationService.showMessage(this.translate("SWAP.LIST.ERROR_LOAD_SWAPS"), this.translate("ERROR"));
    }
  }

  createSwap() {
    return this.router.navigate(['wallet/swap/create']);
  }

  openSwap(swapId: string) {
    return this.router.navigate(['wallet/swap/load', { id: swapId }]);
  }

  private translate(key: string): string {
    return this.translateService.instant(key);
  }
}
