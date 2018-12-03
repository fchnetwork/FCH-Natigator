const artifacts = require('@core/abi/AerumToken.json');

import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { environment } from "@env/environment";

import { TransactionOptions } from "@core/ethereum/base-contract-service/transaction-options.model";
import { StakeInfo } from "@core/staking/models/stake-info.model";
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
    injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService,
    translateService: TranslateService
  ){
    super(
      artifacts.abi,
      environment.contracts.staking.address.Aerum,
      notificationService,
      ethereumAuthService,
      ethereumContractExecutorService,
      injectedWeb3ContractExecutorService,
      translateService
    );
  }

  /**
   * Stakes amount to delegate
   * @param {string} delegate - delegate address
   * @param {number} amount - token amount
   * @param {TransactionOptions} options - options for web3 contract method call
   */
  async stake(delegate: string, amount: string|number, options: TransactionOptions) {
    const contract = await this.createContract(options.wallet);
    const stake = contract.methods.stake(delegate, amount);
    const receipt = await this.send(stake, options);
    return receipt;
  }

  /**
   * Unstakes amount from delegate
   * @param {number} amount - token amount
   * @param {TransactionOptions} options - options for web3 contract method call
   */
  async unstake(amount: number, options: TransactionOptions) {
    const contract = await this.createContract(options.wallet);
    const unstake = contract.methods.unstake(amount);
    const receipt = await this.send(unstake, options);
    return receipt;
  }

  /**
   * Returns stake information for specified account
   * @param {string} address - account address
   * @return {StakeInfo} Stake information
   */
  async getStakeInfo(address: string): Promise<StakeInfo> {
    const contract = await this.createContract();
    const getStakeInfo = contract.methods.stakeInfo();
    const stakeInfo = await this.call(getStakeInfo, address);
    return stakeInfo;
  }
}
