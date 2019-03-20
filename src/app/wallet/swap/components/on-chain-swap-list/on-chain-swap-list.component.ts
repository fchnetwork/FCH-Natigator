import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { SwapListItem } from "@core/swap/models/swap-list-item.model";
import { SwapListService } from "@core/swap/on-chain/swap-list-service/swap-list.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { CreateSwapService } from '@app/core/swap/on-chain/create-swap-service/create-swap.service';
import { LoadSwapService } from '@app/core/swap/on-chain/load-swap-service/load-swap.service';
import { environment } from '@env/environment';

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
  allSwaps: SwapListItem[] = [];
  perfectScrollbarDisabled = environment.isMobileBuild;

  constructor(
    private logger: LoggerService,
    private translateService: TranslateService,
    private authService: AuthenticationService,
    private internalNotificationService: InternalNotificationService,
    private swapListService: SwapListService, 
    private createSwapService: CreateSwapService,
    private loadSwapService: LoadSwapService
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
      this.internalNotificationService.showMessage(this.translate("SWAP.LIST.ERROR_LOAD_SWAPS"), this.translate("ERROR"));
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
      this.internalNotificationService.showMessage(this.translate("SWAP.LIST.ERROR_LOAD_SWAPS"), this.translate("ERROR"));
    }
  }

  async createSwap() {
    await this.createSwapService.createSwap();
    // TODO: Quick fix. reload all swaps (we should load only new one)
    await this.loadSwaps();
  } 

  async openSwap(swapId: string) {
    await this.loadSwapService.loadSwap(swapId);
    // TODO: Quick fix. reload all swaps (we should reload single)
    await this.loadSwaps();
  }

  private translate(key: string): string {
    return this.translateService.instant(key);
  }
}
