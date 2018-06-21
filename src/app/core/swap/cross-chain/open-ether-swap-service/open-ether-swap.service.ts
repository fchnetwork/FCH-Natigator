const artifacts = require('@core/abi/OpenAtomicSwapEther.json');

import { Injectable } from '@angular/core';

import { environment } from "@env/environment";
import Web3 from "web3";
import { Contract } from "web3/types";

import { fromWei } from "web3-utils";
import { secondsToDate } from "@shared/helpers/date-util";

import { OpenEtherSwap } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.model";
import { ContractExecutorService } from "@core/ethereum/contract-executor-service/contract-executor.service";

@Injectable()
export class OpenEtherSwapService {

  private contractExecutorService: ContractExecutorService;
  private web3: Web3;
  private contract: Contract;

  constructor() { }

  useContractExecutor(contractExecutorService: ContractExecutorService) {
    this.contractExecutorService = contractExecutorService;
    this.web3 = contractExecutorService.getWeb3();
    this.contract = new this.web3.eth.Contract(artifacts.abi, environment.contracts.swap.crossChain.address.ethereum.OpenEtherSwap);
  }

  async openSwap(hash: string, ethValue: string, withdrawTrader: string, timelock: number, hashCallback?: (hash: string) => void) {
    const openSwap = this.contract.methods.open(hash, withdrawTrader, timelock.toString(10));
    const receipt = await this.contractExecutorService.send(openSwap, { value: ethValue, hashReceivedCallback: hashCallback });
    return receipt;
  }

  async estimateOpenSwap(hash: string, ethValue: string, withdrawTrader: string, timelock: number) {
    const openSwap = this.contract.methods.open(hash, withdrawTrader, timelock.toString(10));
    const cost = await this.contractExecutorService.estimateCost(openSwap, { value: ethValue });
    return cost;
  }

  async closeSwap(hash: string, secretKey: string) {
    const closeSwap = this.contract.methods.close(hash, this.web3.utils.fromAscii(secretKey));
    const receipt = await this.contractExecutorService.send(closeSwap);
    return receipt;
  }

  async expireSwap(hash: string, hashCallback?: (hash: string) => void) {
    const expireSwap = this.contract.methods.expire(hash);
    const receipt = await this.contractExecutorService.send(expireSwap, { value: '0', hashReceivedCallback: hashCallback });
    return receipt;
  }

  async checkSwap(hash: string): Promise<OpenEtherSwap> {
    const checkSwap = this.contract.methods.check(hash);
    const response = await this.contractExecutorService.call(checkSwap);
    const swap: OpenEtherSwap = {
      hash,
      openTrader: response.openTrader,
      withdrawTrader: response.withdrawTrader,
      value: fromWei(response.ethValue, 'ether'),
      timelock: Number(response.timelock),
      openedOn: secondsToDate(Number(response.openedOn)),
      state: Number(response.state)
    };
    return swap;
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
