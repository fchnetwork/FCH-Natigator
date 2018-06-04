const artifacts = require('@core/abi/AtomicSwapEther.json');

import { Injectable } from '@angular/core';

import { environment } from "@env/environment";
import Web3 from "web3";
import { Contract } from "web3/types";

import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { EthereumContractExecutorService } from "@core/contract/contract-executor-service/ethereum-contract-executor.service";
import { InjectedWeb3ContractExecutorService } from "@core/contract/contract-executor-service/injected-web3-contract-executor.service";

@Injectable()
export class EtherSwapService {
  private web3: Web3;
  private contract: Contract;

  constructor(
    // private contractExecutorService: EthereumContractExecutorService,
    private contractExecutorService: InjectedWeb3ContractExecutorService,
    private ethAuthenticationService: EthereumAuthenticationService
  ) {
    this.ethAuthenticationService.getInjectedWeb3().then(w3 => {
      this.web3 = this.ethAuthenticationService.getWeb3();
      this.contract = new this.web3.eth.Contract(artifacts.abi, environment.contracts.swap.crossChain.address.ethereum.EtherSwap);
    });

    // this.web3 = this.ethAuthenticationService.getWeb3();
    // this.contract = new this.web3.eth.Contract(artifacts.abi, environment.contracts.swap.crossChain.address.ethereum.EtherSwap);
  }

  async openSwap(hash: string, aeroValue: string, withdrawTrader: string, timelock: number) {
    // TODO: Workarround
    this.web3 = await this.ethAuthenticationService.getInjectedWeb3();
    this.contract = new this.web3.eth.Contract(artifacts.abi, environment.contracts.swap.crossChain.address.ethereum.EtherSwap);

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

}
