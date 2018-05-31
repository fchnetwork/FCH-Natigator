const artifacts = require('@core/abi/AtomicSwapEther.json');

import { Injectable } from '@angular/core';
import { environment } from "@env/environment";

import { BaseContractService } from "@core/contract/base-contract-service/base-contract.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";

@Injectable()
export class AeroSwapService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService) {
    super(artifacts.abi, environment.contracts.swap.crossChain.address.aerum.AeroSwap, authenticationService, contractExecutorService);
  }

}
