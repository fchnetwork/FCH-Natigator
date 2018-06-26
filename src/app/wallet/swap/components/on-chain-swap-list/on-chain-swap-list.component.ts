import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { toBigNumberString } from "@shared/helpers/number-utils";
import { SwapListItem } from "@core/swap/models/swap-list-item.model";
import { SwapListService } from "@core/swap/on-chain/swap-list-service/swap-list.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { ModalService } from '@app/core/general/modal-service/modal.service';
import { NotificationService } from '@aerum/ui';
import { SwapMode } from '@app/wallet/swap/models/models';
import { CreateSwapModalContext } from '@app/wallet/swap/components/create-swap/create-swap.component';
import { ERC20TokenService } from '@app/core/swap/on-chain/erc20-token-service/erc20-token.service';
import { AeroToErc20SwapService } from '@app/core/swap/on-chain/aero-to-erc20-swap-service/aero-to-erc20-swap.service';
import { Erc20ToAeroSwapService } from '@app/core/swap/on-chain/erc20-to-aero-swap-service/erc20-to-aero-swap.service';
import { Erc20ToErc20SwapService } from '@app/core/swap/on-chain/erc20-to-erc20-swap-service/erc20-to-erc20-swap.service';
import { AerumNameService } from '@app/core/aens/aerum-name-service/aerum-name.service';
import { environment } from '@env/environment';
import { TokenError } from '@app/core/transactions/token-service/token.error';
import { CreateSwapService } from '@app/core/swap/on-chain/create-swap-service/create-swap.service';
import { LoadSwapService } from '@app/core/swap/on-chain/load-swap-service/load-swap.service';

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
    private logger: LoggerService,
    private router: Router,
    private translateService: TranslateService,
    private authService: AuthenticationService,
    private internalNotificationService: InternalNotificationService,
    private notificationService: NotificationService,
    private swapListService: SwapListService, 
    private createSwapService: CreateSwapService,
    private erc20ToErc20SwapService: Erc20ToErc20SwapService,
    private modalService: ModalService,
    private aensService: AerumNameService,
    private loadSwapService: LoadSwapService
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
      this.logger.logError('Error loading swaps', e);
      this.internalNotificationService.showMessage(this.translate("SWAP.LIST.ERROR_LOAD_SWAPS"), this.translate("ERROR"));
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
      this.logger.logError('Error loading swaps', e);
      this.internalNotificationService.showMessage(this.translate("SWAP.LIST.ERROR_LOAD_SWAPS"), this.translate("ERROR"));
    }
  }

  async createSwap() {
    await this.createSwapService.createSwap();
  } 

  async openSwap(swapId: string) {
    await this.loadSwapService.loadSwap(swapId);
  }

  private translate(key: string): string {
    return this.translateService.instant(key);
  }
}
