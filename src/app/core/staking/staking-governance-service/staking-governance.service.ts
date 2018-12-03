const artifacts = require('@core/abi/Governance.json');

import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { environment } from "@env/environment";

import { BaseContractService } from "@core/ethereum/base-contract-service/base-contract.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { EthereumContractExecutorService } from "@core/ethereum/ethereum-contract-executor-service/ethereum-contract-executor.service";
import { InjectedWeb3ContractExecutorService } from "@core/ethereum/injected-web3-contract-executor-service/injected-web3-contract-executor.service";
import { EthWalletType } from "@app/external/models/eth-wallet-type.enum";

@Injectable()
export class StakingGovernanceService extends BaseContractService {

  constructor(notificationService: InternalNotificationService,
    ethereumAuthService: EthereumAuthenticationService,
    ethereumContractExecutorService: EthereumContractExecutorService,
    injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService,
    translateService: TranslateService
  ){
    super(
      artifacts.abi,
      environment.contracts.staking.address.Governance,
      notificationService,
      ethereumAuthService,
      ethereumContractExecutorService,
      injectedWeb3ContractExecutorService,
      translateService
    );
  }

  /**
   * Returns list of valid delegates which might be composers
   * @param {EthWalletType} walletType - wallet type, imported or injected
   * @return {string[]} List of delegates addresses
   */
  async getValidDelegates(walletType: EthWalletType = EthWalletType.Imported): Promise<string[]> {
    const [web3, contract] = await Promise.all([this.createWeb3(walletType), this.createContract()]);
    const blockNumber =  await web3.eth.getBlockNumber();
    const getValidDelegates = contract.methods.getValidDelegates(blockNumber);
    const delegatesIds = await this.call(getValidDelegates);
    return delegatesIds;
  }
}
