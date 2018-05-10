const artifacts = require('./abi/AtomicSwapEtherToERC20.json');

import { Injectable } from '@angular/core';

import { environment } from 'environments/environment'; 
import { ContractExecutorService } from './contract-executor.service';

import Web3 from 'web3';
import { Contract } from 'web3/types';
import { AuthenticationService } from '@app/core/authentication-service/authentication.service';

@Injectable()
export class AeroToErc20SwapService {

  private web3: Web3;
  private contract: Contract;

  constructor(
    private authenticationService: AuthenticationService,
    private contractExecutorService: ContractExecutorService
  ) { 
    this.web3 = this.authenticationService.initWeb3();
    this.contract = new this.web3.eth.Contract(artifacts.abi, environment.contracts.swap.address.AeroToErc20);
  }

  async openSwap(swapId: string, aeroValue: string, erc20Value: string, erc20Trader: string, erc20ContractAddress: string) {
    const openSwap = this.contract.methods.open(
      this.web3.utils.fromAscii(swapId),
      erc20Value,
      erc20Trader,
      erc20ContractAddress
    );
    const receipt = await this.contractExecutorService.send(openSwap, { value: aeroValue });
    return receipt;
  }

  async closeSwap(swapId: string) {
    const closeSwap = this.contract.methods.close(this.web3.utils.fromAscii(swapId));
    const receipt = await this.contractExecutorService.send(closeSwap);
    return receipt;
  }

  async expireSwap(swapId: string) {
    const expireSwap = this.contract.methods.expire(this.web3.utils.fromAscii(swapId));
    const response = await this.contractExecutorService.send(expireSwap);
    return response;
  }

  async checkSwap(swapId: string) {
    const checkSwap = this.contract.methods.check(this.web3.utils.fromAscii(swapId));
    const receipt = await this.contractExecutorService.call(checkSwap);
    return receipt;
  }
}
