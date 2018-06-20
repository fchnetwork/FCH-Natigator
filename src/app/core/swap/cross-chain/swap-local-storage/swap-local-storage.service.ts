import { Injectable } from '@angular/core';
import { SwapReference } from "./swap-reference.model";
import { SessionStorageService } from "ngx-webstorage";

@Injectable()
export class SwapLocalStorageService {

  constructor(private sessionStorage: SessionStorageService) { }

  storeSwapReference(swap: SwapReference) {
    if(swap) {
      const swaps = this.loadAllSwaps();
      swaps.push(swap);
      this.sessionStorage.store("cross_chain_swap", swaps);
    }
  }

  loadSwapReference(hash: string): SwapReference {
    if(!hash) {
      return null;
    }

    const swaps = this.loadAllSwaps();
    return swaps.find(swap => swap.hash === hash);
  }

  loadAllSwaps(): SwapReference[] {
    return this.sessionStorage.retrieve("cross_chain_swap") as SwapReference[] || [];
  }

  loadAllSwapAccounts(): string[] {
    const swaps = this.loadAllSwaps();
    const accounts = swaps.map(swap => swap.account);
    const uniqueAccounts = Array.from(new Set(accounts));
    return uniqueAccounts;
  }
}
