import { Injectable } from '@angular/core';
import { Cookie } from "ng2-cookies/ng2-cookies";

import * as CryptoJS from 'crypto-js';

import { environment } from "@env/environment";
import { SessionStorageService } from "ngx-webstorage";
import { EtherSwapReference } from "./swap-reference.model";

@Injectable()
export class SwapLocalStorageService {

  constructor(private sessionStorage: SessionStorageService) { }

  storeSwapReference(swap: EtherSwapReference): void {
    if(!swap) {
      return;
    }

    const swaps = this.loadAllSwaps();
    swaps.push(swap);
    this.sessionStorage.store("cross_chain_swaps", swaps);
    this.storeSwapsInCookies(swaps);
  }

  private storeSwapsInCookies(swaps: EtherSwapReference[]): void {
    const password = this.sessionStorage.retrieve('password');
    const stringSwaps = JSON.stringify(swaps);
    const encryptedSwaps = CryptoJS.AES.encrypt(stringSwaps, password);
    Cookie.set('cross_chain_swaps', encryptedSwaps, 7, "/", environment.cookiesDomain);
  }

  loadSwapReference(hash: string): EtherSwapReference {
    if(!hash) {
      return null;
    }

    const swaps = this.loadAllSwaps();
    return swaps.find(swap => swap.hash === hash);
  }

  loadAllSwaps(): EtherSwapReference[] {
    return this.sessionStorage.retrieve("cross_chain_swaps") as EtherSwapReference[] || [];
  }

  loadAllSwapAccounts(): string[] {
    const swaps = this.loadAllSwaps();
    const accounts = swaps.map(swap => swap.account);
    const uniqueAccounts = Array.from(new Set(accounts));
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
