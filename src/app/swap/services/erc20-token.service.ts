import { Injectable } from '@angular/core';

import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { ContractExecutorService } from './contract-executor.service';

import Web3 from 'web3';
import { Contract } from 'web3/types';
import { tokensABI } from "@app/abi/tokens";

@Injectable()
export class ERC20TokenService {

  private web3: Web3;

  constructor(
    private authenticationService: AuthenticationService,
    private contractExecutorService: ContractExecutorService
  ) { 
    this.web3 = this.authenticationService.initWeb3();
  }

  async approve(erc20ContractAddress: string, address: string, amount: string) {
    const contract = new this.web3.eth.Contract(tokensABI, erc20ContractAddress);
    const approve = contract.methods.approve(address, amount);
    const receipt = await this.contractExecutorService.send(approve);
    return receipt;
  }
}
