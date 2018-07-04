const artifacts = require('@core/abi/CounterAtomicSwapERC20.json');

import { Injectable } from '@angular/core';
import { environment } from "@env/environment";
import { Callback } from "web3/types";

import { toBigNumberString } from "@shared/helpers/number-utils";
import { CounterErc20Swap } from "@core/swap/models/counter-erc20-swap.model";
import { BaseContractService } from "@core/contract/base-contract-service/base-contract.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";

@Injectable()
export class CounterAerumErc20SwapService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService) {
    super(artifacts.abi, environment.contracts.swap.crossChain.address.aerum.CounterErc20Swap, authenticationService, contractExecutorService);
  }

  /**
   * Opens a swap
   * @param {string} hash - hash of the swap
   * @param {string} erc20Value - amount of ERC20 tokens
   * @param {string} erc20ContractAddress - address of ERC20 token contract
   * @param {number} timelock - time within, funds will be locked
   */
  async openSwap(hash: string, erc20Value: string, erc20ContractAddress: string, timelock: number) {
    const openSwap = this.contract.methods.open(
      hash,
      erc20Value,
      erc20ContractAddress,
      toBigNumberString(timelock)
    );
    const receipt = await this.contractExecutorService.send(openSwap);
    return receipt;
  }

  /**
   * Closes a swap
   * @param {string} hash - hash of the swap
   * @param {string} secretKey - key to validate if you are an owner of the swap
   * @param {function} hashCallback - callback function with transaction hash
   */
  async closeSwap(hash: string, secretKey: string, hashCallback?: (hash: string) => void) {
    const closeSwap = this.contract.methods.close(hash, this.web3.utils.fromAscii(secretKey));
    const receipt = await this.contractExecutorService.send(closeSwap, { value: '0', hashReceivedCallback: hashCallback });
    return receipt;
  }

  /**
   * Expires a swap
   * @param {string} hash - hash of the swap
   */
  async expireSwap(hash: string) {
    const expireSwap = this.contract.methods.expire(hash);
    const receipt = await this.contractExecutorService.send(expireSwap);
    return receipt;
  }

  /**
   * Checks and returns information about swap
   * @param {string} hash - hash of the swap
   * @return {CounterErc20Swap} Swap object
   */
  async checkSwap(hash: string): Promise<CounterErc20Swap> {
    const checkSwap = this.contract.methods.check(hash);
    const response = await this.contractExecutorService.call(checkSwap);
    const swap: CounterErc20Swap = {
      hash: response.hash,
      erc20ContractAddress: response.erc20ContractAddress,
      erc20Value: response.erc20Value,
      state: Number(response.state),
      timelock: Number(response.timelock)
    };

    return swap;
  }

  /**
   * Checks and returns secret key only for closed swaps
   * @param {string} hash - hash of the swap
   */
  async checkSecretKey(hash: string) {
    const checkSecretKey = this.contract.methods.checkSecretKey(hash);
    const response = await this.contractExecutorService.call(checkSecretKey);
    return response;
  }

  /**
   * Event listner for open event
   * @param {string} hash - hash of the swap
   * @param {function} callback - callback method for open event
   */
  onOpen(hash: string, callback: Callback<any>): void {
    this.handleEvent("Open", hash, callback);
  }

  /**
   * Event listner for close event
   * @param {string} hash - hash of the swap
   * @param {function} callback - callback method for close event
   */
  onClose(hash: string, callback: Callback<any>): void {
    this.handleEvent("Close", hash, callback);
  }

  /**
   * Event listner for expire event
   * @param {string} hash - hash of the swap
   * @param {function} callback - callback method for expire event
   */
  onExpire(hash: string, callback: Callback<any>): void {
    this.handleEvent("Expire", hash, callback);
  }

  private handleEvent(eventName: string, hash: string, callback: Callback<any>): void {
    const contract = this.createEventsSupportingContract();
    contract.events[eventName]({ filter: { _hash: hash }, fromBlock: 0 }, callback);
  }
}
