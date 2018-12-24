const artifacts = require('@core/abi/Governance.json');

import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { environment } from "@env/environment";

import { toAscii, fromAscii } from "web3-utils";

import { TransactionOptions } from "@core/ethereum/base-contract-service/transaction-options.model";
import { DelegateInfo } from "@core/staking/models/delegate-info.model";
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
  async getValidDelegates(walletType: EthWalletType = EthWalletType.Imported): Promise<DelegateInfo[]> {
    const contract = await this.createContract(walletType);
    const getValidDelegates = contract.methods.getValidDelegates(Math.floor(Date.now() / 1000));
    const delegates = await this.call(getValidDelegates);
    const delegatesInfo = [];
    for(let i = 0; i < delegates[0].length; i++) {
      delegatesInfo.push({
        name: toAscii(delegates[1][i]),
        address: delegates[0][i]
      });
    }
    return delegatesInfo;
  }

  /**
   * Returns list of valid delegates which might be composers
   * @param {EthWalletType} walletType - wallet type, imported or injected
   * @return {string[]} List of delegates addresses
   */
  async isKnown(address: string, walletType: EthWalletType = EthWalletType.Imported): Promise<DelegateInfo[]> {
    const contract = await this.createContract(walletType);
    const isKnown = contract.methods.isKnown(address);
    return await this.call(isKnown);
  }

  /**
   * Creates new delegate(only owner)
   * @param {string} address - delegate address
   * @param {string} name - delegate name
   * @param {TransactionOptions} options - transaction options
   * @return {string} delegates proxy address
   */
  async createDelegate(address: string, name: string, options: TransactionOptions) {
    const contract = await this.createContract(options.wallet);
    const createDelegate = contract.methods.createDelegate(fromAscii(name), address);
    const receipt = await this.send(createDelegate, options);
    return receipt;
  }

  /**
   * Approves delegate
   * @param {string} address - delegate address
   * @param {TransactionOptions} options - transaction options
   * @return {string} delegates proxy address
   */
  async approveDelegate(address: string, options: TransactionOptions) {
    const contract = await this.createContract(options.wallet);
    const approveDelegate = contract.methods.approveDelegate(address);
    const receipt = await this.send(approveDelegate, options);
    return receipt;
  }
}
