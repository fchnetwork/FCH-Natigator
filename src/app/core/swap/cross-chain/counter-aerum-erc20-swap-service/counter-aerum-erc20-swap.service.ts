const artifacts = require('@core/abi/CounterAtomicSwapERC20.json');

import { Injectable } from '@angular/core';
import { environment } from "@env/environment";
import { Callback } from "web3/types";

import { toBigNumberString } from "@shared/helpers/number-utils";
import { CounterErc20Swap } from "@core/swap/cross-chain/counter-aerum-erc20-swap-service/counter-erc20-swap.model";
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

  async closeSwap(hash: string, secretKey: string) {
    const closeSwap = this.contract.methods.close(hash, this.web3.utils.fromAscii(secretKey));
    const receipt = await this.contractExecutorService.send(closeSwap);
    return receipt;
  }

  async expireSwap(hash: string) {
    const expireSwap = this.contract.methods.expire(hash);
    const receipt = await this.contractExecutorService.send(expireSwap);
    return receipt;
  }

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

  async checkSecretKey(hash: string) {
    const checkSecretKey = this.contract.methods.checkSecretKey(hash);
    const response = await this.contractExecutorService.call(checkSecretKey);
    return response;
  }

  onOpen(hash: string, callback: Callback<any>): void {
    this.handleEvent("Open", hash, callback);
  }

  onClose(hash: string, callback: Callback<any>): void {
    this.handleEvent("Close", hash, callback);
  }

  onExpire(hash: string, callback: Callback<any>): void {
    this.handleEvent("Expire", hash, callback);
  }

  private handleEvent(eventName: string, hash: string, callback: Callback<any>): void {
    const contract = this.createEventsSupportingContract();
    contract.events[eventName]({ filter: { _hash: hash }, fromBlock: 0 }, callback);
  }
}
