import { Injectable } from '@angular/core';

import { multiSlice } from "@shared/helpers/array-utils";

import { SwapListItem } from "@core/swap/models/swap-list-item.model";
import { SwapType } from "@core/swap/models/swap-type.enum";
import { TokenType } from "@core/swap/models/token-type.enum";
import { OpenEtherSwap } from "@core/swap/models/open-ether-swap.model";
import { SwapLocalStorageService } from "@core/swap/cross-chain/swap-local-storage/swap-local-storage.service";
import { OpenEtherSwapService } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.service";
import { OpenErc20SwapService } from "@core/swap/cross-chain/open-erc20-swap-service/open-erc20-swap.service";
import { OpenAerumErc20SwapService } from "@core/swap/cross-chain/open-aerum-erc20-swap-service/open-aerum-erc20-swap.service";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { OpenErc20Swap } from "@core/swap/models/open-erc20-swap.model";
import { TokenService } from "@core/transactions/token-service/token.service";
import { EthereumTokenService } from "@core/ethereum/ethereum-token-service/ethereum-token.service";
import { Token } from '@app/core/transactions/token-service/token.model';


@Injectable()
export class SwapListService {

  constructor(
    private logger: LoggerService,
    private localSwapStorage: SwapLocalStorageService,
    private etherDepositSwapService: OpenEtherSwapService,
    private erc20DepositSwapService: OpenErc20SwapService,
    private withdrawalSwapService: OpenAerumErc20SwapService,
    private tokenService: TokenService,
    private ethereumTokenService: EthereumTokenService
  ) { }

  /**
   * Returns list of swap items for specified account
   * @param {string} account - account address
   * @param {number} take - number of items to fetch
   * @param {number} page - page number
   * @return {SwapListItem[]} List of swap items
   */
  async getSwapsByAccountPaged(account: string, take: number, page: number): Promise<SwapListItem[]> {
    account = account.toLowerCase();
    const skip = take * page;

    const [etherDepositSwapIds, erc20DepositSwapIds, erc20WithdrawalSwapIds] = await this.getSwapIdsByAccount(take, skip);

    const [etherDepositSwaps, erc20DepositSwaps, erc20WithdrawalSwap] = await Promise.all([
      this.getEtherDepositSwapsByIds(etherDepositSwapIds, account),
      this.getErc20DepositSwapsByIds(erc20DepositSwapIds, account),
      this.getWithdrawalSwapsByIds(erc20WithdrawalSwapIds, account)
    ]);

    return [...etherDepositSwaps, ...erc20DepositSwaps, ...erc20WithdrawalSwap];
  }

  private async getSwapIdsByAccount(take: number, skip: number): Promise<[string[], string[], string[]]> {
    let [etherDepositSwapIds, erc20DepositSwapIds, erc20WithdrawalSwapIds] = await Promise.all([
      this.loadEtherDepositSwapIds(),
      this.loadErc20DepositSwapIds(),
      this.loadWithdrawalSwapIds()
    ]);

    // NOTE: We filter out unknown swaps from list because we cannot cancel them
    //       because we don't have locally stored account which opened these swaps
    //       However, we may allow in future showing them so that other account of the same user may cancel swap & return funds back
    etherDepositSwapIds = this.localSwapStorage.filterOutUnknown(etherDepositSwapIds);
    erc20DepositSwapIds = this.localSwapStorage.filterOutUnknown(erc20DepositSwapIds);
    erc20WithdrawalSwapIds = this.localSwapStorage.filterOutUnknown(erc20WithdrawalSwapIds);

    [etherDepositSwapIds, erc20DepositSwapIds, erc20WithdrawalSwapIds] 
      = multiSlice([etherDepositSwapIds, erc20DepositSwapIds, erc20WithdrawalSwapIds], take, skip);
    return [etherDepositSwapIds, erc20DepositSwapIds, erc20WithdrawalSwapIds];
  }

  private async loadEtherDepositSwapIds(): Promise<string[]> {
    const ethAccounts = this.localSwapStorage.loadSwapAccounts(SwapType.Deposit, TokenType.Ether);
    if (!ethAccounts.length) {
      this.logger.logMessage('No locally stored ethereum addresses found');
      return [];
    }

    // NOTE: To have paging working we always should return swap ids in the same order
    // that's why we order them by account first
    const swapIdGroups = await Promise.all(ethAccounts.map(ethAccount => this.getEtherDepositSwapsIdsByAccount(ethAccount)));
    return this.orderSwapIds(swapIdGroups);
  }

  private async getEtherDepositSwapsByIds(swapIds: string[], account: string): Promise<SwapListItem[]> {
    const swaps = await Promise.all(swapIds.map(id => this.etherDepositSwapService.checkSwap(id)));
    return swaps.map(swap => this.mapEtherDepositSwap(account, swap));
  }

  private async getEtherDepositSwapsIdsByAccount(account: string): Promise<Array<{account: string, swapId: string}>> {
    account = account.toLowerCase();

    const swapIds = await this.etherDepositSwapService.getAccountSwapIds(account);
    // NOTE: We reverse so that latest go first
    return swapIds.reverse().map(id => ({ account, swapId: id }));
  }

  private async loadErc20DepositSwapIds(): Promise<string[]> {
    const ethAccounts = this.localSwapStorage.loadSwapAccounts(SwapType.Deposit, TokenType.Erc20);
    if (!ethAccounts.length) {
      this.logger.logMessage('No locally stored ethereum addresses found');
      return [];
    }

    // NOTE: To have paging working we always should return swap ids in the same order
    // that's why we order them by account first
    const swapIdGroups = await Promise.all(ethAccounts.map(ethAccount => this.getErc20DepositSwapsIdsByAccount(ethAccount)));
    return this.orderSwapIds(swapIdGroups);
  }

  private async getErc20DepositSwapsByIds(swapIds: string[], account: string): Promise<SwapListItem[]> {
    const swaps = await Promise.all(swapIds.map(id => this.erc20DepositSwapService.checkSwap(id)));
    return swaps.map(swap => this.mapOpenErc20Swap(account, swap, SwapType.Deposit));
  }

  private async getErc20DepositSwapsIdsByAccount(account: string): Promise<Array<{account: string, swapId: string}>> {
    account = account.toLowerCase();

    const swapIds = await this.erc20DepositSwapService.getAccountSwapIds(account);
    // NOTE: We reverse so that latest go first
    return swapIds.reverse().map(id => ({ account, swapId: id }));
  }

  private async loadWithdrawalSwapIds(): Promise<string[]> {
    const accounts = this.localSwapStorage.loadSwapAccounts(SwapType.Withdrawal);
    if (!accounts.length) {
      this.logger.logMessage('No locally stored addresses found for withdrawal swaps');
      return [];
    }

    const swapIdGroups = await Promise.all(accounts.map(account => this.getWithdrawalSwapsIdsByAccount(account)));
    return this.orderSwapIds(swapIdGroups);
  }

  private async getWithdrawalSwapsIdsByAccount(account: string): Promise<Array<{account: string, swapId: string}>> {
    account = account.toLowerCase();

    const swapIds = await this.withdrawalSwapService.getAccountSwapIds(account);
    // NOTE: We reverse so that latest go first
    return swapIds.reverse().map(id => ({ account, swapId: id }));
  }

  private async getWithdrawalSwapsByIds(swapIds: string[], account: string): Promise<SwapListItem[]> {
    const swaps = await Promise.all(swapIds.map(id => this.withdrawalSwapService.checkSwap(id)));
    return swaps.map(swap => this.mapOpenErc20Swap(account, swap, SwapType.Withdrawal));
  }

  private mapEtherDepositSwap(account: string, swap: OpenEtherSwap): SwapListItem {
    return {
      id: swap.hash,
      counterparty: this.getCounterparty(swap.openTrader, swap.withdrawTrader, account),
      openAsset: 'ETH',
      openValue: swap.value,
      closeAsset: null,
      closeValue: 0,
      createdOn: swap.openedOn,
      state: swap.state,
      type: SwapType.Deposit
    };
  }

  private mapOpenErc20Swap(account: string, swap: OpenErc20Swap, swapType: SwapType): SwapListItem {
    const token = this.getTokenInfo(swap.erc20ContractAddress);
    return {
      id: swap.hash,
      counterparty: this.getCounterparty(swap.openTrader, swap.withdrawTrader, account),
      openAsset: token.symbol,
      openValue: swap.erc20Value / Math.pow(10, token.decimals),
      closeAsset: '',
      closeValue: 0,
      createdOn: swap.openedOn,
      state: swap.state,
      type: swapType
    };
  }

  private getTokenInfo(erc20ContractAddress: string): Token {
    let token = this.tokenService.getLocalTokenInfo(erc20ContractAddress);
    if(!token) {
      token = this.ethereumTokenService.getLocalTokenInfo(erc20ContractAddress);
    }
    if(!token) {
      token = {
        symbol: '',
        address: erc20ContractAddress,
        decimals: 0,
        balance: 0,
        totalSupply: 0
      };
    }
    return token;
  }

  private orderSwapIds(swapIdGroups) {
    const swapIdPairs = swapIdGroups.reduce((all, accountSwaps) => all.concat(accountSwaps),[]);
    const sortedSwapIds = swapIdPairs.sort((one, two) => one.account.localeCompare(two.account));
    return sortedSwapIds.map(pair => pair.swapId);
  }

  private getCounterparty(one: string, two: string, account: string): string {
    return (one.toLowerCase() !== account) ? one : two;
  }
}
