import { Injectable } from '@angular/core';

import { OnChainSwap } from "@core/swap/on-chain/swap-local-storage-service/on-chain-swap.model";
import { SessionStorageService } from "ngx-webstorage";

@Injectable()
export class OnChainSwapLocalStorageService {

  private readonly storageKey = 'on-chain-swaps';

  constructor(private sessionStorage: SessionStorageService) { }

  getSwaps(): OnChainSwap[] {
    const swaps = this.sessionStorage.retrieve(this.storageKey) || [];
    return swaps;
  }

  saveSwap(swap: OnChainSwap): void {
    if (!swap) {
      throw new Error('Swap cannot be empty');
    }

    const swaps = this.getSwaps();
    swaps.push(swap);
    this.sessionStorage.store(this.storageKey, swaps);
  }
}
