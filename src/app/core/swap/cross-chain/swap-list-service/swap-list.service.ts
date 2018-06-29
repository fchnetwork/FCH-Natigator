import { Injectable } from '@angular/core';

import { multiSlice } from "@shared/helpers/array-utils";

import { SwapListItem } from "@core/swap/models/swap-list-item.model";
import { OpenEtherSwap } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.model";
import { SwapLocalStorageService } from "@core/swap/cross-chain/swap-local-storage/swap-local-storage.service";
import { OpenEtherSwapService } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.service";
import { OpenAerumErc20SwapService } from "@core/swap/cross-chain/open-aerum-erc20-swap-service/open-aerum-erc20-swap.service";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { OpenErc20Swap } from '@app/core/swap/cross-chain/open-aerum-erc20-swap-service/open-erc20-swap.model';
import { TokenService } from "@core/transactions/token-service/token.service";


@Injectable()
export class SwapListService {

  constructor(
    private logger: LoggerService,
    private localSwapStorage: SwapLocalStorageService,
    private etherSwapService: OpenEtherSwapService,
    private erc20SwapService: OpenAerumErc20SwapService,
    private tokenService: TokenService,
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
    const swapIdGroups = await this.getErc20SwapsIdsByAccount(account);
    const swapIdPairs = swapIdGroups.reduce((all, accountSwaps) => all.concat(accountSwaps),[]);
    const sortedSwapIds = swapIdPairs.sort((one, two) => one.account.localeCompare(two.account));
    return sortedSwapIds.map(pair => pair.swapId);
  }

  private async getErc20SwapsIdsByAccount(account: string): Promise<Array<{account: string, swapId: string}>> {
    account = account.toLowerCase();

    const swapIds = await this.erc20SwapService.getAccountSwapIds(account);
    // NOTE: We reverse so that latest go first
    return swapIds.reverse().map(id => ({ account, swapId: id }));
  }

  private async getEtherSwapsByIds(swapIds: string[], account: string): Promise<SwapListItem[]> {
    const swaps = await Promise.all(swapIds.map(id => this.etherSwapService.checkSwap(id)));
    return swaps.map(swap => this.mapEtherSwap(account, swap));
  }

  private async getErc20SwapsByIds(swapIds: string[], account: string): Promise<SwapListItem[]> {
    const swaps = await Promise.all(swapIds.map(id => this.erc20SwapService.checkSwap(id)));
    const result = await Promise.all(swaps.map(swap => this.mapErc20Swap(account, swap)));
    return result;
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

  private async mapErc20Swap(account: string, swap: OpenErc20Swap): Promise<SwapListItem> {
    const token = await this.tokenService.getTokensInfo(swap.erc20ContractAddress);
    return {
      id: swap.hash,
      counterparty: this.getCounterparty(swap.openTrader, swap.withdrawTrader, account),
      openAsset: token.symbol,
      openValue: swap.erc20Value / Math.pow(10, token.decimals),
      closeAsset: 'ETH',
      closeValue: 0,
      createdOn: swap.openedOn,
      state: swap.state
    };
  }

  private getCounterparty(one: string, two: string, account: string): string {
    return (one.toLowerCase() !== account) ? one : two;
  }
}
