const artifacts = require('@core/abi/AerumToken.json');

import { Injectable } from '@angular/core';
import { environment } from "@env/environment";

import { TransactionOptions } from "@core/ethereum/base-contract-service/transaction-options.model";
import { BaseContractService } from "@core/ethereum/base-contract-service/base-contract.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { EthereumContractExecutorService } from "@core/ethereum/ethereum-contract-executor-service/ethereum-contract-executor.service";
import { InjectedWeb3ContractExecutorService } from "@core/ethereum/injected-web3-contract-executor-service/injected-web3-contract-executor.service";

@Injectable()
export class StakingAerumService extends BaseContractService {

  constructor(notificationService: InternalNotificationService,
    ethereumAuthService: EthereumAuthenticationService,
    ethereumContractExecutorService: EthereumContractExecutorService,
    injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService
  ){
    super(
      artifacts.abi,
      environment.contracts.staking.address.Aerum,
      notificationService,
      ethereumAuthService,
      ethereumContractExecutorService,
      injectedWeb3ContractExecutorService
    );
  }
}
