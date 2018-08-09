const artifacts = require('@core/abi/TokenFactory.json');

import { Injectable } from '@angular/core';
import { environment } from "@env/environment";

import { CreateTokenModel } from "@core/factory/models/create-token.model";
import { BaseContractService } from "@core/contract/base-contract-service/base-contract.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";

@Injectable()
export class TokenFactoryService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService
  ) {
    super(artifacts.abi, environment.contracts.factory.address.TokenFactory, authenticationService, contractExecutorService);
  }

  async create(data: CreateTokenModel) {
    const create = this.contract.methods.create(
      data.name,
      data.symbol,
      data.decimals,
      data.supply
    );
    const receipt = await this.contractExecutorService.send(create);
    return receipt;
  }
}
