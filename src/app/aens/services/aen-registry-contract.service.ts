const artifacts = require('./abi/ENSRegistry.json');

import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { ContractExecutorService } from '@app/shared/services/contract-executor.service';
import { BaseContractService } from '@app/shared/services/base-contract-service';

import Web3 from 'web3';
import { Contract } from 'web3/types';

@Injectable()
export class AenRegistryContractService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService
  ) {
    super(artifacts.abi, environment.contracts.aens.address.ENSRegistry, authenticationService, contractExecutorService);
  }

  async setResolver(node: string, resolverAddress: string) {
    const setResolver = this.contract.methods.setResolver(node, resolverAddress);
    const receipt = await this.contractExecutorService.send(setResolver);
    return receipt;
  }

  async getResolver(node: string): Promise<string> {
    const resolver = this.contract.methods.resolver(node);
    const resolverAddress = await this.contractExecutorService.call(resolver);
    return resolverAddress;
  }

  async getOwner(node: string): Promise<string> {
    const owner = this.contract.methods.owner(node);
    const ownerAddress = await this.contractExecutorService.call(owner) as string;
    return ownerAddress;
  }
}
