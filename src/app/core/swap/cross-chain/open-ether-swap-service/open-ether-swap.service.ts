const artifacts = require('@core/abi/OpenAtomicSwapEther.json');

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { EnvironmentService } from "@core/general/environment-service/environment.service";
import { fromWei, fromAscii } from "web3-utils";

import { secondsToDate } from "@shared/helpers/date-util";
import { toBigNumberString } from "@shared/helpers/number-utils";
import { TransactionOptions } from "@core/ethereum/base-contract-service/transaction-options.model";
import { OpenEtherSwap } from "@core/swap/models/open-ether-swap.model";
import { BaseContractService } from "@core/ethereum/base-contract-service/base-contract.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { EthereumContractExecutorService } from "@core/ethereum/ethereum-contract-executor-service/ethereum-contract-executor.service";
import { InjectedWeb3ContractExecutorService } from "@core/ethereum/injected-web3-contract-executor-service/injected-web3-contract-executor.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";

@Injectable()
export class OpenEtherSwapService extends BaseContractService {

  constructor(
    notificationService: InternalNotificationService,
    ethereumAuthService: EthereumAuthenticationService,
    ethereumContractExecutorService: EthereumContractExecutorService,
    injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService,
    translateService: TranslateService,
    environment: EnvironmentService
  ) {
    super(
      artifacts.abi,
      environment.get().contracts.swap.crossChain.address.ethereum.OpenEtherSwap,
      notificationService,
      ethereumAuthService,
      ethereumContractExecutorService,
      injectedWeb3ContractExecutorService,
      translateService
    );
  }

  /**
   * Opens a swap
   * @param {string} hash - hash of the swap
   * @param {string} ethValue - amount of ETH tokens
   * @param {string} withdrawTrader - address of counter partner trader
   * @param {number} timelock - time within, funds will be locked
   * @param {TransactionOptions} options - options for web3 contract method call
   */
  async openSwap(hash: string, ethValue: string, withdrawTrader: string, timelock: number, options: TransactionOptions) {
    const contract = await this.createContract(options.wallet);
    const openSwap = contract.methods.open(hash, withdrawTrader, toBigNumberString(timelock));
    const receipt = await this.send(openSwap, options, ethValue);
    return receipt;
  }

  /**
   * Closes a swap
   * @param {string} hash - hash of the swap
   * @param {string} secretKey - key to validate if you are an owner of the swap
   * @param {TransactionOptions} options - options for web3 contract method call
   */
  async closeSwap(hash: string, secretKey: string, options: TransactionOptions) {
    const contract = await this.createContract(options.wallet);
    const closeSwap = contract.methods.close(hash, fromAscii(secretKey));
    const receipt = await this.send(closeSwap, options);
    return receipt;
  }

  /**
   * Expires a swap
   * @param {string} hash - hash of the swap
   * @param {TransactionOptions} options - options for web3 contract method call
   */
  async expireSwap(hash: string, options: TransactionOptions) {
    const contract = await this.createContract(options.wallet);
    const expireSwap = contract.methods.expire(hash);
    const receipt = await this.send(expireSwap, options);
    return receipt;
  }

  /**
   * Checks and returns information about swap
   * @param {string} hash - hash of the swap
   * @return {OpenEtherSwap} Swap object
   */
  async checkSwap(hash: string): Promise<OpenEtherSwap> {
    const contract = await this.createContract();
    const checkSwap = contract.methods.check(hash);
    const response = await this.call(checkSwap);
    const swap: OpenEtherSwap = {
      hash,
      openTrader: response.openTrader,
      withdrawTrader: response.withdrawTrader,
      value: Number(fromWei(response.value, 'ether')),
      timelock: Number(response.timelock),
      openedOn: secondsToDate(Number(response.openedOn)),
      state: Number(response.state)
    };
    return swap;
  }

  /**
   * Checks and returns secret key only for closed swaps
   * @param {string} hash - hash of the swap
   */
  async checkSecretKey(hash: string) {
    const contract = await this.createContract();
    const checkSecretKey = contract.methods.checkSecretKey(hash);
    const response = await this.call(checkSecretKey);
    return response;
  }

  /**
   * Returns list of swap ids for specified account
   * @param {string} address - account address
   * @return {string[]} List of swap ids
   */
  async getAccountSwapIds(address: string): Promise<string[]> {
    const contract = await this.createContract();
    const getAccountSwaps = contract.methods.getAccountSwaps(address);
    const swapIds = await this.call(getAccountSwaps, address);
    return swapIds;
  }

}
