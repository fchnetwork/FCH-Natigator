import { Component, OnInit } from '@angular/core';

import { OnChainSwapLocalStorageService } from "@core/swap/on-chain/swap-local-storage-service/on-chain-swap-local-storage.service";
import { OnChainSwap } from "@core/swap/on-chain/swap-local-storage-service/on-chain-swap.model";

@Component({
  selector: 'app-on-chain-swap-list',
  templateUrl: './on-chain-swap-list.component.html',
  styleUrls: ['./on-chain-swap-list.component.scss']
})
export class OnChainSwapListComponent implements OnInit {

  swaps: OnChainSwap[] = [];

  constructor(private swapService: OnChainSwapLocalStorageService) { }

  ngOnInit() {
    this.swaps = this.swapService.getSwaps();
  }

}
