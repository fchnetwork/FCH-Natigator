const artifacts = require('../abi/PublicResolver.json');

import { Injectable } from '@angular/core';

import { environment } from 'environments/environment'; 
import { BaseContractService } from '@app/core/contract/base-contract-service';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { ContractExecutorService } from '@app/core/contract/contract-executor.service';

@Injectable()
export class AensPublicResolverContractService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService
  ) {
    super(artifacts.abi, environment.contracts.aens.address.PublicResolver, authenticationService, contractExecutorService);
  }

  async setAddress(node: string, name: string) {
    const setAddr = this.contract.methods.setAddr(node, name);
    const receipt = await this.contractExecutorService.send(setAddr);
    return receipt;
  }

  async estimateSetAddressCost(node: string, name: string) {
    const setAddr = this.contract.methods.setAddr(node, name);
    const cost = await this.contractExecutorService.estimateCost(setAddr);
    return cost;
  }

  async getAddress(node: string) : Promise<string> {
    const getAddr = this.contract.methods.addr(node);
    const address = await this.contractExecutorService.call(getAddr);
    return address;
  }

  async setName(node: string, name: string) {
    const setName = this.contract.methods.setName(node, name);
    const receipt = await this.contractExecutorService.send(setName);
    return receipt;
  }

  async getName(node: string) : Promise<string> {
    const getName = this.contract.methods.name(node);
    const name = await this.contractExecutorService.call(getName);
    return name;
  }

  getContractAddress() {
    return environment.contracts.aens.address.PublicResolver;
  }
}
