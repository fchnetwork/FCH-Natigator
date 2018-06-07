const artifacts = require('@core/abi/AtomicSwapEther.json');

import { Injectable } from '@angular/core';

import { environment } from "@env/environment";
import Web3 from "web3";
import { Callback, Contract } from "web3/types";

import { ContractExecutorService } from "@core/ethereum/contract-executor-service/contract.executor.service";

@Injectable()
export class EtherSwapService {

  private contractExecutorService: ContractExecutorService;
  private web3: Web3;
  private contract: Contract;

  constructor() { }

  useContractExecutor(contractExecutorService: ContractExecutorService) {
    this.contractExecutorService = contractExecutorService;
    this.web3 = contractExecutorService.getWeb3();
    this.contract = new this.web3.eth.Contract(artifacts.abi, environment.contracts.swap.crossChain.address.ethereum.EtherSwap);
  }

  async openSwap(hash: string, aeroValue: string, withdrawTrader: string, timelock: number) {
    const openSwap = this.contract.methods.open(hash, withdrawTrader, timelock.toString(10));
    const receipt = await this.contractExecutorService.send(openSwap, { value: aeroValue });
    return receipt;
  }

  async estimateOpenSwap(hash: string, aeroValue: string, withdrawTrader: string, timelock: number) {
    const openSwap = this.contract.methods.open(hash, withdrawTrader, timelock.toString(10));
    const cost = await this.contractExecutorService.estimateCost(openSwap, { value: aeroValue });
    return cost;
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
