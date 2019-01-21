const erc20ABI = require('@core/abi/tokens.ts');
const artifacts = require('@core/abi/Delegate.json');

import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';

import { TransactionOptions } from "@core/ethereum/base-contract-service/transaction-options.model";
import { StakeInfo } from "@core/staking/models/stake-info.model";
import { BaseContractService } from "@core/ethereum/base-contract-service/base-contract.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { EthereumContractExecutorService } from "@core/ethereum/ethereum-contract-executor-service/ethereum-contract-executor.service";
import { InjectedWeb3ContractExecutorService } from "@core/ethereum/injected-web3-contract-executor-service/injected-web3-contract-executor.service";
import { EthWalletType } from '@app/external/models/eth-wallet-type.enum';
import { environment } from '@env/environment.dev';

@Injectable()
export class StakingDelegateService extends BaseContractService {

  constructor(notificationService: InternalNotificationService,
    ethereumAuthService: EthereumAuthenticationService,
    ethereumContractExecutorService: EthereumContractExecutorService,
    injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService,
    translateService: TranslateService
  ){
    super(
      artifacts.abi,
      '',
      notificationService,
      ethereumAuthService,
      ethereumContractExecutorService,
      injectedWeb3ContractExecutorService,
      translateService
    );
  }

  /**
   * Approves funds in ERC20 token for staking
   * @param {string} spender - Address of the spender
   * @param {string} value - amount of ERC20 tokens
   * @param {TransactionOptions} options - options for web3 contract method call
   */
  private async tokenApprove(spender: string, value: string|number, options: TransactionOptions) {
    const erc20Address = environment.contracts.staking.address.Aerum;
    const web3 = await this.createWeb3(options.wallet);
    const tokenContract = new web3.eth.Contract(erc20ABI.tokensABI, erc20Address);
    const approve = tokenContract.methods.approve(spender, value);
    await this.send(approve, { wallet: options.wallet, account: options.account, hashCallback: options.approveCallback });
  }

  /**
   * Stakes amount to delegate
   * @param {string} delegate - delegate address
   * @param {number} amount - token amount
   * @param {TransactionOptions} options - options for web3 contract method call
   */
  async stake(delegate: string, amount: string|number, options: TransactionOptions) {
    await this.tokenApprove(delegate, amount, options);
    const contract = await this.createContractByAddress(options.wallet, delegate);
    const stake = contract.methods.stake(amount);
    const receipt = await this.send(stake, options);
    return receipt;
  }

  /**
   * Unstakes amount from delegate
   * @param {number} amount - token amount
   * @param {TransactionOptions} options - options for web3 contract method call
   */
  async unstake(delegate: string, amount: number, options: TransactionOptions) {
    const contract = await this.createContractByAddress(options.wallet, delegate);
    const unstake = contract.methods.unstake(amount);
    const receipt = await this.send(unstake, options);
    return receipt;
  }

  /**
   * Returns stake information for specified account
   * @param {string} address - account address
   * @return {StakeInfo} Stake information
   */
  async getStakeInfo(delegate: string, address: string): Promise<StakeInfo> {
    const contract = await this.createContractByAddress(EthWalletType.Imported, delegate);
    const stakeOf = contract.methods.stakeOf(address);
    const getName = contract.methods.getName();
    const [stake, name] = await Promise.all([this.call(stakeOf), this.call(getName)]);
    return {
      amount: Number(stake),
      delegate: name
    };
  }
}
