import { Injectable } from '@angular/core';

import { unique } from "@shared/helpers/array-utils";
import { SwapReference } from "./swap-reference.model";
import { SwapType } from "@core/swap/models/swap-type.enum";
import { TokenType } from "@core/swap/models/token-type.enum";
import { StorageService } from "@core/general/storage-service/storage.service";

@Injectable()
export class SwapLocalStorageService {

  constructor(private storageService: StorageService) { }

  storeSwapReference(swap: SwapReference): void {
    if(!swap) {
      return;
    }

    const swaps = this.loadAllSwaps();
    swaps.push(swap);
    this.storageService.setSessionData('cross_chain_swaps', swaps);
    const stringSwaps = JSON.stringify(swaps);
    this.storageService.setStorage('cross_chain_swaps', stringSwaps, true, 7);
  }

  loadSwapReference(hash: string): SwapReference {
    if(!hash) {
      return null;
    }

    const swaps = this.loadAllSwaps();
    return swaps.find(swap => swap.hash === hash);
  }

  loadAllSwaps(): SwapReference[] {
    return this.storageService.getSessionData('cross_chain_swaps') as SwapReference[] || [];
  }

  loadSwapAccounts(swapType: SwapType, tokenType?: TokenType): string[] {
    let swaps = this.loadAllSwaps().filter(swap => swap.swapType === swapType);
    if(tokenType === TokenType.Ether) {
      swaps = swaps.filter(swap => swap.walletTokenSymbol === 'ETH');
    }
    if(tokenType === TokenType.Erc20) {
      swaps = swaps.filter(swap => swap.walletTokenSymbol !== 'ETH');
    }
    const accounts = swaps.map(swap => swap.account);
    const uniqueAccounts = unique(accounts);
    return uniqueAccounts;
  }

  loadAllSwapAccounts(): string[] {
    const swaps = this.loadAllSwaps();
    const accounts = swaps.map(swap => swap.account);
    const uniqueAccounts = unique(accounts);
    return uniqueAccounts;
  }

  filterOutUnknown(swapIds: string[]): string[] {
    if (!swapIds){
      return [];
    }

    const swaps = this.loadAllSwaps();
    return swapIds.filter(id => swaps.some(swap => swap.hash === id));
  }
}
