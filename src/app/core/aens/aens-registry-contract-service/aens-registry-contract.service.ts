const artifacts = require('@core/abi/ENSRegistry.json');

import { Injectable } from '@angular/core';

import { EnvironmentService } from "@core/general/environment-service/environment.service";
import { BaseContractService } from '@core/contract/base-contract-service/base-contract.service';
import { AuthenticationService } from '@core/authentication/authentication-service/authentication.service';
import { ContractExecutorService } from '@core/contract/contract-executor-service/contract-executor.service';

@Injectable()
export class AensRegistryContractService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService,
    environment: EnvironmentService
  ) {
    super(artifacts.abi, environment.get().contracts.aens.address.ENSRegistry, authenticationService, contractExecutorService);
  }

  async getResolver(node: string): Promise<string> {
    const resolver = this.contract.methods.resolver(node);
    const resolverAddress = await this.contractExecutorService.call(resolver);
    return resolverAddress;
  }

  async setResolver(node: string, resolverAddress: string) {
    const setResolver = this.contract.methods.setResolver(node, resolverAddress);
    const receipt = await this.contractExecutorService.send(setResolver);
    return receipt;
  }

  async estimateSetResolverCost(node: string, resolverAddress: string) {
    const setResolver = this.contract.methods.setResolver(node, resolverAddress);
    const cost = await this.contractExecutorService.estimateCost(setResolver);
    return cost;
  }

  async getOwner(node: string): Promise<string> {
    const owner = this.contract.methods.owner(node);
    const ownerAddress = await this.contractExecutorService.call(owner) as string;
    return ownerAddress;
  }

  async setOwner(node: string, owner: string) {
    const setOwner = this.contract.methods.setOwner(node, owner);
    const receipt = await this.contractExecutorService.send(setOwner);
    return receipt;
  }
}
