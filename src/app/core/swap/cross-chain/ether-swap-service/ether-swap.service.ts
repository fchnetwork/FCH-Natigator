import { SessionStorageService } from "ngx-webstorage";

const artifacts = require('@core/abi/AtomicSwapEther.json');

import { Injectable } from '@angular/core';

import { environment } from "@env/environment";
import Web3 from "web3";
import { Contract } from "web3/types";

import { ContractExecutorService } from "@core/ethereum/contract-executor-service/contract-executor.service";
import { SwapReference } from "@core/swap/cross-chain/ether-swap-service/swap-reference.model";

@Injectable()
export class EtherSwapService {

  private contractExecutorService: ContractExecutorService;
  private web3: Web3;
  private contract: Contract;

  constructor(private sessionStorage: SessionStorageService) { }

  useContractExecutor(contractExecutorService: ContractExecutorService) {
    this.contractExecutorService = contractExecutorService;
    this.web3 = contractExecutorService.getWeb3();
    this.contract = new this.web3.eth.Contract(artifacts.abi, environment.contracts.swap.crossChain.address.ethereum.EtherSwap);
  }

  async openSwap(hash: string, ethValue: string, withdrawTrader: string, timelock: number) {
    const openSwap = this.contract.methods.open(hash, withdrawTrader, timelock.toString(10));
    const receipt = await this.contractExecutorService.send(openSwap, { value: ethValue });
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

  storeSwapReference(swap: SwapReference) {
    if(swap) {
      const swaps = this.loadAllSwaps();
      swaps.push(swap);
      this.sessionStorage.store("cross_chain_swap", swaps);
    }
  }

  loadSwapReference(hash: string): SwapReference {
    if(!hash) {
      return null;
    }

    const swaps = this.loadAllSwaps();
    return swaps.find(swap => swap.hash === hash);
  }

  private loadAllSwaps(): SwapReference[] {
    return this.sessionStorage.retrieve("cross_chain_swap") as SwapReference[] || [];
  }
}
