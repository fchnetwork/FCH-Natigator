import { Component, OnInit } from '@angular/core';
import { SwapListService } from "@core/swap/on-chain/swap-list-service/swap-list.service";
import { SwapListItem } from "@core/swap/models/swap-list-item.model";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";


@Component({
  selector: 'app-on-chain-swap-list',
  templateUrl: './on-chain-swap-list.component.html',
  styleUrls: ['./on-chain-swap-list.component.scss']
})
export class OnChainSwapListComponent implements OnInit {

  swaps: SwapListItem[] = [];

  constructor(
    private authService: AuthenticationService,
    private swapListService: SwapListService
  ) { }

  async ngOnInit() {
    const account = this.authService.getAddress();
    this.swaps = await this.swapListService.getSwapsByAccount(account);
  }

}
