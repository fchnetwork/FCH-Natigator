const artifacts = require('@core/abi/Governance.json');

import { Injectable } from '@angular/core';
import { environment } from "@env/environment";

import { BaseContractService } from "@core/ethereum/base-contract-service/base-contract.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { EthereumContractExecutorService } from "@core/ethereum/ethereum-contract-executor-service/ethereum-contract-executor.service";
import { InjectedWeb3ContractExecutorService } from "@core/ethereum/injected-web3-contract-executor-service/injected-web3-contract-executor.service";

@Injectable()
export class StakingGovernanceService extends BaseContractService {

  constructor(notificationService: InternalNotificationService,
    ethereumAuthService: EthereumAuthenticationService,
    ethereumContractExecutorService: EthereumContractExecutorService,
    injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService
  ){
    super(
      artifacts.abi,
      environment.contracts.staking.address.Governance,
      notificationService,
      ethereumAuthService,
      ethereumContractExecutorService,
      injectedWeb3ContractExecutorService
    );
  }

  /**
   * Returns list of valid delegates which might be composers
   * @return {string[]} List of delegates addresses
   */
  async getValidDelegates(): Promise<string[]> {
    const contract = await this.createContract();
    const getValidDelegates = contract.methods.getValidDelegates();
    const delegatesIds = await this.call(getValidDelegates);
    return delegatesIds;
  }
}
