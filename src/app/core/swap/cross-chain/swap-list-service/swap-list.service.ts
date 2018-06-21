import { Injectable } from '@angular/core';

import { SwapListItem } from "@core/swap/models/swap-list-item.model";
import { SwapLocalStorageService } from "@core/swap/cross-chain/swap-local-storage/swap-local-storage.service";
import { SelfSignedEthereumContractExecutorService } from "@core/ethereum/self-signed-ethereum-contract-executor-service/self-signed-ethereum-contract-executor.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { OpenEtherSwapService } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.service";
import { OpenEtherSwap } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.model";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { SwapState } from "@core/swap/models/swap-state.enum";

@Injectable()
export class SwapListService {

  constructor(
    private logger: LoggerService,
    private localSwapStorage: SwapLocalStorageService,
    private ethereumAuthenticationService: EthereumAuthenticationService,
    private ethereumContractExecutorService: SelfSignedEthereumContractExecutorService,
    private etherSwapService: OpenEtherSwapService
  ) { }

  async getSwapsByAccount(account: string): Promise<SwapListItem[]> {
    // TODO: Now need now. But will need for withdraw swaps
    account = account.toLowerCase();

    const [etherSwaps] = await Promise.all([
      this.getEtherSwaps()
    ]);

    return [...etherSwaps];
  }

  private async getEtherSwaps(): Promise<SwapListItem[]> {
    const ethAccounts = this.localSwapStorage.loadAllSwapAccounts();
    if (!ethAccounts.length) {
      this.logger.logMessage('No locally stored ethereum addresses found');
      return [];
    }

    // NOTE: We may get any account here as we just do queries & we don't need private key
    const web3 = this.ethereumAuthenticationService.getWeb3();
    this.ethereumContractExecutorService.init(web3, ethAccounts[0], null);
    this.etherSwapService.useContractExecutor(this.ethereumContractExecutorService);

    const swapGroups = await Promise.all(ethAccounts.map(this.getEtherSwapsByAccount));
  }

  private async getEtherSwapsByAccount(account: string): Promise<SwapListItem[]> {
    account = account.toLowerCase();

    const swapIds = await this.etherSwapService.getAccountSwapIds(account);
    const swaps = await Promise.all(swapIds.map(id => this.etherSwapService.checkSwap(id)));
    return swaps.map(swap => this.mapEtherSwap(account, swap));
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
