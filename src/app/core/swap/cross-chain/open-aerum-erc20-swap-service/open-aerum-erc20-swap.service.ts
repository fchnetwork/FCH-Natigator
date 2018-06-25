const artifacts = require('@core/abi/OpenAtomicSwapERC20.json');
const erc20ABI = require('@core/abi/tokens.ts');
import { BigNumber } from 'bignumber.js';
import { Injectable } from '@angular/core';
import { environment } from "@env/environment";
import { BaseContractService } from "@core/contract/base-contract-service/base-contract.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";

@Injectable()
export class OpenAerumErc20SwapService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService) {
    super(artifacts.abi, environment.contracts.swap.crossChain.address.aerum.OpenErc20Swap, authenticationService, contractExecutorService);
  }

  async openSwap(hash: string, erc20Address: string, value: BigNumber, withdrawTrader: string, timelock: number, hashCallback?: (hash: string) => void) {
    await this.tokenApprove(erc20Address, value);
    const openSwap = this.contract.methods.open(hash, value, erc20Address, withdrawTrader, timelock.toString(10));
    const receipt = await this.contractExecutorService.send(openSwap, { value: '0', hashReceivedCallback: hashCallback });
    return receipt;
  }

  private async tokenApprove(erc20Address: string, value: BigNumber) {
    const openErc20Swap = environment.contracts.swap.crossChain.address.aerum.OpenErc20Swap as string;
    const tokenContract = new this.web3.eth.Contract(erc20ABI.tokensABI, erc20Address);
    const approve = tokenContract.methods.approve(openErc20Swap, value);
    await this.contractExecutorService.send(approve);
  }

  async estimateOpenSwap(hash: string, erc20Address: string, value: string, withdrawTrader: string, timelock: number) {
    const approveCost = await this.estimateTokenApprove(erc20Address, value);
    const openSwap = this.contract.methods.open(hash, value, erc20Address, withdrawTrader, timelock.toString(10));
    const openCost = await this.contractExecutorService.estimateCost(openSwap);
    return approveCost.concat(openCost);
  }

  private async estimateTokenApprove(erc20Address: string, value: string) {
    const openErc20Swap = environment.contracts.swap.crossChain.address.aerum.OpenErc20Swap as string;
    const tokenContract = new this.web3.eth.Contract(erc20ABI.tokensABI, erc20Address);
    const approve = tokenContract.methods.approve(openErc20Swap, value);
    const cost = await this.contractExecutorService.estimateCost(approve);
    return cost;
  }

  async checkSecretKey(hash: string) {
    const checkSecretKey = this.contract.methods.checkSecretKey(hash);
    const response = await this.contractExecutorService.call(checkSecretKey);
    return response;
  }

  async getAccountSwapIds(address: string): Promise<string[]> {
    const getAccountSwaps = this.contract.methods.getAccountSwaps(address);
    const swapIds = await this.contractExecutorService.call(getAccountSwaps);
    return swapIds;
  }

}
