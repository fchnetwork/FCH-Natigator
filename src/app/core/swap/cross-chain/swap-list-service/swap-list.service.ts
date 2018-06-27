import { Injectable } from '@angular/core';

import { multiSlice } from "@shared/helpers/array-utils";

import { SwapListItem } from "@core/swap/models/swap-list-item.model";
import { OpenEtherSwap } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.model";
import { SwapLocalStorageService } from "@core/swap/cross-chain/swap-local-storage/swap-local-storage.service";
import { OpenEtherSwapService } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.service";
import { LoggerService } from "@core/general/logger-service/logger.service";

@Injectable()
export class SwapListService {

  constructor(
    private logger: LoggerService,
    private localSwapStorage: SwapLocalStorageService,
    private etherSwapService: OpenEtherSwapService
  ) { }

  async getSwapsByAccountPaged(account: string, take: number, page: number): Promise<SwapListItem[]> {
    account = account.toLowerCase();
    const skip = take * page;

    const [etherSwapIds, erc20SwapIds] = await this.getSwapIdsByAccount(account, take, skip);

    const [etherSwaps, erc20Swaps] = await Promise.all([
      this.getEtherSwapsByIds(etherSwapIds, account),
      this.getErc20SwapsByIds(erc20SwapIds, account)
    ]);

    return [...etherSwaps, ...erc20Swaps];
  }

  private async getSwapIdsByAccount(account: string, take: number, skip: number): Promise<[string[], string[]]> {
    let [etherSwapIds, erc20SwapIds] = await Promise.all([
      this.loadEtherSwapIds(),
      this.loadErc20SwapIds(account)
    ]);

    // NOTE: We filter out unknown swaps from list because we cannot cancel them
    //       because we don't have locally stored account which opened these swaps
    //       However, we may allow in future showing them so that other account of the same user may cancel swap & return funds back
    etherSwapIds = this.localSwapStorage.filterOutUnknown(etherSwapIds);

    [etherSwapIds, erc20SwapIds] = multiSlice([etherSwapIds, erc20SwapIds], take, skip);
    return [etherSwapIds, erc20SwapIds];
  }

  private async loadEtherSwapIds(): Promise<string[]> {
    const ethAccounts = this.localSwapStorage.loadAllSwapAccounts();
    if (!ethAccounts.length) {
      this.logger.logMessage('No locally stored ethereum addresses found');
      return [];
    }

    // NOTE: To have paging working we always should return swap ids in the same order
    // that's why we order them by account first
    const swapIdGroups = await Promise.all(ethAccounts.map(ethAccount => this.getEtherSwapsIdsByAccount(ethAccount)));
    const swapIdPairs = swapIdGroups.reduce((all, accountSwaps) => all.concat(accountSwaps),[]);
    const sortedSwapIds = swapIdPairs.sort((one, two) => one.account.localeCompare(two.account));
    return sortedSwapIds.map(pair => pair.swapId);
  }

  private async getEtherSwapsIdsByAccount(account: string): Promise<Array<{account: string, swapId: string}>> {
    account = account.toLowerCase();

    const swapIds = await this.etherSwapService.getAccountSwapIds(account);
    // NOTE: We reverse so that latest go first
    return swapIds.reverse().map(id => ({ account, swapId: id }));
  }

  private async loadErc20SwapIds(account: string): Promise<string[]> {
    // TODO: Implement later
    return Promise.resolve([]);
  }

  private async getEtherSwapsByIds(swapIds: string[], account: string): Promise<SwapListItem[]> {
    const swaps = await Promise.all(swapIds.map(id => this.etherSwapService.checkSwap(id)));
    return swaps.map(swap => this.mapEtherSwap(account, swap));
  }

  private getErc20SwapsByIds(swapIds: string[], account: string): Promise<SwapListItem[]> {
    // TODO: Should be implemented later
    return Promise.resolve([]);
  }

  private mapEtherSwap(account: string, swap: OpenEtherSwap): SwapListItem {
    return {
      id: swap.hash,
      counterparty: this.getCounterparty(swap.openTrader, swap.withdrawTrader, account),
      openAsset: 'ETH',
      openValue: swap.value,
      closeAsset: null,
      closeValue: 0,
      createdOn: swap.openedOn,
      state: swap.state
    };
  }

  private getCounterparty(one: string, two: string, account: string): string {
    return (one.toLowerCase() !== account) ? one : two;
  }
}
