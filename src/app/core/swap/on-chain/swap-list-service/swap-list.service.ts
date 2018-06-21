import { Injectable } from '@angular/core';

import { multiSlice } from "@shared/helpers/array-utils";
import { SwapListItem } from "@core/swap/models/swap-list-item.model";
import { AeroToErc20Swap } from "@core/swap/on-chain/aero-to-erc20-swap-service/aero-to-erc20-swap.model";
import { Erc20ToAeroSwap } from "@core/swap/on-chain/erc20-to-aero-swap-service/erc20-to-aero-swap.model";
import { Erc20ToErc20Swap } from "@core/swap/on-chain/erc20-to-erc20-swap-service/erc20-to-erc20-swap.model";
import { AeroToErc20SwapService } from "@core/swap/on-chain/aero-to-erc20-swap-service/aero-to-erc20-swap.service";
import { Erc20ToAeroSwapService } from "@core/swap/on-chain/erc20-to-aero-swap-service/erc20-to-aero-swap.service";
import { Erc20ToErc20SwapService } from "@core/swap/on-chain/erc20-to-erc20-swap-service/erc20-to-erc20-swap.service";

@Injectable()
export class SwapListService {

  constructor(
    private aeroToErc20SwapService: AeroToErc20SwapService,
    private erc20ToAeroSwapService: Erc20ToAeroSwapService,
    private erc20ToErc20SwapService: Erc20ToErc20SwapService
  ) { }

  async getSwapsByAccount(account: string): Promise<SwapListItem[]> {
    account = account.toLowerCase();
    const [aeroToErc20Swaps, erc20ToAeroSwaps, erc20ToErc20Swaps] = await Promise.all([
      this.getAeroToErc20Swaps(account),
      this.getErc20ToAeroSwaps(account),
      this.getErc20ToErc20Swaps(account)
    ]);

    return [...aeroToErc20Swaps, ...erc20ToAeroSwaps, ...erc20ToErc20Swaps];
  }

  async getSwapsByAccountPaged(account: string, take: number, page: number): Promise<SwapListItem[]> {
    account = account.toLowerCase();
    const skip = take * page;
    const [aeroToErc20SwapIds, erc20ToAeroSwapIds, erc20ToErc20SwapIds] = await this.getSwapIdsByAccount(account, take, skip);

    const [aeroToErc20Swaps, erc20ToAeroSwaps, erc20ToErc20Swaps] = await Promise.all([
      this.getAeroToErc20SwapsByIds(aeroToErc20SwapIds, account),
      this.getErc20ToAeroSwapsByIds(erc20ToAeroSwapIds, account),
      this.getErc20ToErc20SwapsByIds(erc20ToErc20SwapIds, account)
    ]);

    return [...aeroToErc20Swaps, ...erc20ToAeroSwaps, ...erc20ToErc20Swaps];
  }

  private async getSwapIdsByAccount(account: string, take: number, skip: number): Promise<[string[], string[], string[]]> {
    let [aeroToErc20SwapIds, erc20ToAeroSwapIds, erc20ToErc20SwapIds] = await Promise.all([
      this.aeroToErc20SwapService.getAccountSwapIds(account),
      this.erc20ToAeroSwapService.getAccountSwapIds(account),
      this.erc20ToErc20SwapService.getAccountSwapIds(account)
    ]);

    [aeroToErc20SwapIds, erc20ToAeroSwapIds, erc20ToErc20SwapIds] = multiSlice([aeroToErc20SwapIds, erc20ToAeroSwapIds, erc20ToErc20SwapIds], take, skip);
    return [aeroToErc20SwapIds, erc20ToAeroSwapIds, erc20ToErc20SwapIds];
  }

  private async getAeroToErc20Swaps(account: string): Promise<SwapListItem[]> {
    const swapIds = await this.aeroToErc20SwapService.getAccountSwapIds(account);
    return await this.getAeroToErc20SwapsByIds(swapIds, account);
  }

  private async getAeroToErc20SwapsByIds(swapIds: string[], account: string) {
    const swaps = await Promise.all(swapIds.map(id => this.aeroToErc20SwapService.checkSwapDetailed(id)));
    return swaps.map(swap => this.mapAeroToErc20Swap(account, swap));
  }

  private mapAeroToErc20Swap(account: string, swap: AeroToErc20Swap): SwapListItem {
    return {
      id: swap.id,
      counterparty: this.getCounterparty(swap.ethTrader, swap.erc20Trader, account),
      openAsset: 'AER',
      openValue: swap.ethValue,
      closeAsset: swap.erc20Token.symbol,
      closeValue: swap.erc20Value,
      createdOn: swap.openedOn,
      state: swap.state
    };
  }

  private async getErc20ToAeroSwaps(account: string): Promise<SwapListItem[]> {
    const swapIds = await this.erc20ToAeroSwapService.getAccountSwapIds(account);
    return await this.getErc20ToAeroSwapsByIds(swapIds, account);
  }

  private async getErc20ToAeroSwapsByIds(swapIds: string[], account: string) {
    const swaps = await Promise.all(swapIds.map(id => this.erc20ToAeroSwapService.checkSwapDetailed(id)));
    return swaps.map(swap => this.mapErc20ToAeroSwap(account, swap));
  }

  private mapErc20ToAeroSwap(account: string, swap: Erc20ToAeroSwap): SwapListItem {
    return {
      id: swap.id,
      counterparty: this.getCounterparty(swap.ethTrader, swap.erc20Trader, account),
      openAsset: swap.erc20Token.symbol,
      openValue: swap.erc20Value,
      closeAsset: 'AER',
      closeValue: swap.ethValue,
      createdOn: swap.openedOn,
      state: swap.state
    };
  }

  private async getErc20ToErc20Swaps(account: string): Promise<SwapListItem[]> {
    const swapIds = await this.erc20ToErc20SwapService.getAccountSwapIds(account);
    return await this.getErc20ToErc20SwapsByIds(swapIds, account);
  }

  private async getErc20ToErc20SwapsByIds(swapIds: string[], account: string) {
    const swaps = await Promise.all(swapIds.map(id => this.erc20ToErc20SwapService.checkSwapDetailed(id)));
    return swaps.map(swap => this.mapErc20ToErc20Swap(account, swap));
  }

  private mapErc20ToErc20Swap(account: string, swap: Erc20ToErc20Swap): SwapListItem {
    return {
      id: swap.id,
      counterparty: this.getCounterparty(swap.openTrader, swap.closeTrader, account),
      openAsset: swap.openToken.symbol,
      openValue: swap.openValue,
      closeAsset: swap.closeToken.symbol,
      closeValue: swap.closeValue,
      createdOn: swap.openedOn,
      state: swap.state
    };
  }

  private getCounterparty(one: string, two: string, account: string): string {
    return (one.toLowerCase() !== account) ? one : two;
  }
}
