const artifacts = require('@core/abi/AtomicSwapERC20.json');

import { Injectable } from '@angular/core';
import { environment } from "@env/environment";

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

  async openSwap(hash: string, erc20Value: string, erc20ContractAddress: string, withdrawTrader: string, timelock: number) {
    const openSwap = this.contract.methods.open(
      hash,
      erc20Value,
      erc20ContractAddress,
      withdrawTrader,
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
    const response = await this.contractExecutorService.send(expireSwap);
    return response;
  }

  async checkSwap(hash: string) {
    const checkSwap = this.contract.methods.check(hash);
    const receipt = await this.contractExecutorService.call(checkSwap);
    return receipt;
  }

  async checkSecretKey(hash: string) {
    const checkSecretKey = this.contract.methods.checkSecretKey(hash);
    const receipt = await this.contractExecutorService.call(checkSecretKey);
    return receipt;
  }
}
