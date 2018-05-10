const artifacts = require('./abi/PublicResolver.json');

import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { ContractExecutorService } from '@app/shared/services/contract-executor.service';
import { BaseContractService } from '@app/shared/services/base-contract-service';

@Injectable()
export class AensPublicResolverContractService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService
  ) {
    super(artifacts.abi, environment.contracts.aens.address.PublicResolver, authenticationService, contractExecutorService);
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
}
