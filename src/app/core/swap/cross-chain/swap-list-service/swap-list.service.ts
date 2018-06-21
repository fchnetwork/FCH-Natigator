import { Injectable } from '@angular/core';

import { SwapListItem } from "@core/swap/models/swap-list-item.model";
import { SwapLocalStorageService } from "@core/swap/cross-chain/swap-local-storage/swap-local-storage.service";
import { SelfSignedEthereumContractExecutorService } from "@core/ethereum/self-signed-ethereum-contract-executor-service/self-signed-ethereum-contract-executor.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { OpenEtherSwapService } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.service";
import { OpenEtherSwap } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.model";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { multiSlice } from "@shared/helpers/array-utils";

@Injectable()
export class SwapListService {

  constructor(
    private logger: LoggerService,
    private localSwapStorage: SwapLocalStorageService,
    private ethereumAuthenticationService: EthereumAuthenticationService,
    private ethereumContractExecutorService: SelfSignedEthereumContractExecutorService,
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
    this.configureEtherSwapServices(ethAccounts[0]);
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

  private configureEtherSwapServices(account: string) {
    // NOTE: We may get any account here as we just do queries & we don't need private key
    const web3 = this.ethereumAuthenticationService.getWeb3();
    this.ethereumContractExecutorService.init(web3, account, null);
    this.etherSwapService.useContractExecutor(this.ethereumContractExecutorService);
  }

  private getCounterparty(one: string, two: string, account: string): string {
    return (one.toLowerCase() !== account) ? one : two;
  }
}
