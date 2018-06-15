import { Callback } from "web3/types";

const artifacts = require('@core/abi/AtomicSwapERC20.json');

import { Injectable } from '@angular/core';
import { environment } from "@env/environment";

import { Erc20Swap } from "@core/swap/cross-chain/aerum-erc20-swap-service/erc20-swap.model";
import { BaseContractService } from "@core/contract/base-contract-service/base-contract.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";

@Injectable()
export class AerumErc20SwapService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService) {
    super(artifacts.abi, environment.contracts.swap.crossChain.address.aerum.Erc20Swap, authenticationService, contractExecutorService);
  }

  async openSwap(hash: string, erc20Value: string, erc20ContractAddress: string, timelock: number) {
    const openSwap = this.contract.methods.open(
      hash,
      erc20Value,
      erc20ContractAddress,
      timelock.toString(10)
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

  async checkSwap(hash: string): Promise<Erc20Swap> {
    const checkSwap = this.contract.methods.check(hash);
    const response = await this.contractExecutorService.call(checkSwap);
    const swap: Erc20Swap = {
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

  onOpen(hash: string, callback: Callback<any>) {
    this.contract.events.Open({ filter: { _hash: hash }, fromBlock: 0 }, callback);
  }

  onClose(hash: string, callback: Callback<any>) {
    this.contract.events.Close({ filter: { _hash: hash }, fromBlock: 0 }, callback);
  }

  onExpire(hash: string, callback: Callback<any>) {
    this.contract.events.Expire({ filter: { _hash: hash }, fromBlock: 0 }, callback);
  }
}
