import { Injectable } from '@angular/core';
import { Cookie } from "ng2-cookies/ng2-cookies";

import * as CryptoJS from 'crypto-js';

import { unique } from "@shared/helpers/array-utils";
import { environment } from "@env/environment";
import { SessionStorageService } from "ngx-webstorage";
import { SwapReference } from "./swap-reference.model";
import { SwapType } from "@core/swap/models/swap-type.enum";
import { TokenType } from "@core/swap/models/token-type.enum";

@Injectable()
export class SwapLocalStorageService {

  constructor(private sessionStorage: SessionStorageService) { }

  storeSwapReference(swap: SwapReference): void {
    if(!swap) {
      return;
    }

    const swaps = this.loadAllSwaps();
    swaps.push(swap);
    this.sessionStorage.store("cross_chain_swaps", swaps);
    this.storeSwapsInCookies(swaps);
  }

  private storeSwapsInCookies(swaps: SwapReference[]): void {
    const password = this.sessionStorage.retrieve('password');
    const stringSwaps = JSON.stringify(swaps);
    const encryptedSwaps = CryptoJS.AES.encrypt(stringSwaps, password);
    Cookie.set('cross_chain_swaps', encryptedSwaps, 7, "/", environment.cookiesDomain);
  }

  loadSwapReference(hash: string): SwapReference {
    if(!hash) {
      return null;
    }

    const swaps = this.loadAllSwaps();
    return swaps.find(swap => swap.hash === hash);
  }

  loadAllSwaps(): SwapReference[] {
    return this.sessionStorage.retrieve("cross_chain_swaps") as SwapReference[] || [];
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
