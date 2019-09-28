import Web3 from 'web3';
import { Contract, TransactionObject } from 'web3/types';

import { TranslateService } from '@ngx-translate/core';
import { EthWalletType } from "@external/models/eth-wallet-type.enum";
import { InjectedWeb3Error } from "@external/models/injected-web3.error";
import { TransactionOptions } from "@core/ethereum/base-contract-service/transaction-options.model";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";
import { EthereumContractExecutorService } from "@core/ethereum/ethereum-contract-executor-service/ethereum-contract-executor.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { InjectedWeb3ContractExecutorService } from "@core/ethereum/injected-web3-contract-executor-service/injected-web3-contract-executor.service";

export abstract class BaseContractService {

  protected constructor(
    protected abi: any[],
    protected address: string,
    protected notificationService: InternalNotificationService,
    protected ethereumAuthService: EthereumAuthenticationService,
    protected ethereumContractExecutorService: EthereumContractExecutorService,
    protected injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService,
    protected translateService: TranslateService
  ) { }

  protected async send(transaction: TransactionObject<any>, options: TransactionOptions, value = '0') {
    await this.ensureTransactionOptions(options);

    if (options.wallet === EthWalletType.Imported) {
      const account = this.ethereumAuthService.getEthereumAccount(options.account);
      return this.ethereumContractExecutorService.send(transaction, {
        hashReceivedCallback: options.hashCallback,
        account: account.address,
        privateKey: account.privateKey,
        value
      });
    }

    return this.injectedWeb3ContractExecutorService.send(transaction, {
      hashReceivedCallback: options.hashCallback,
      account: options.account,
      value
    });
  }

  private async ensureTransactionOptions(options: TransactionOptions) {
    if (!options) {
      throw new Error(this.translateService.instant('TRANSACTION_OPTIONS_CANNOT_BE_EMPTY'));
    }

    if (!options.account) {
      throw new Error(this.translateService.instant('TRANSACTION_OPTIONS_CANNOT_BE_EMPTY'));
    }

    if (options.wallet === EthWalletType.Injected) {
      await this.ensureInjectedAccount(options.account);
    } else {
      this.ensureImportedAccount(options.account);
    }
  }

  private async ensureInjectedAccount(account: string) {
    try {
      await this.ethereumAuthService.ensureEthereumEnabled();
    } catch (error) {
      this.notificationService.showMessage(this.translateService.instant('BASE_CONTRACT.CANNOT_LOAD_ACCOUNT'), this.translateService.instant('ERROR'));
      throw new InjectedWeb3Error(this.translateService.instant('BASE_CONTRACT.CANNOT_LOAD_ACCOUNT'));
    }
    const injectedWeb3 = await this.ethereumAuthService.getInjectedWeb3();
    if (!injectedWeb3) {
      this.notificationService.showMessage(this.translateService.instant('INJECTED_WEB3_NOT_PROVIDED'), this.translateService.instant('ERROR'));
      throw new InjectedWeb3Error(this.translateService.instant('INJECTED_WEB3_NOT_PROVIDED'));
    }

    const accounts = await injectedWeb3.eth.getAccounts() || [];
    if (!accounts.length) {
      this.notificationService.showMessage(this.translateService.instant('PLEASE_LOGIN_IN_MIST__METAMASK'), this.translateService.instant('ERROR'));
      throw new InjectedWeb3Error(this.translateService.instant('CANNOT_GET_ACCOUNTS_FROM_SELECTED_PROVIDER'));
    }

    if (accounts.every(acc => acc !== account)) {
      this.notificationService.showMessage(`${this.translateService.instant('PLEASE_SELECT')} ${account} ${this.translateService.instant('AND_RETRY')}`, this.translateService.instant('ERROR'));
      throw new InjectedWeb3Error(`${this.translateService.instant('INCORRECT_MIST__METAMASK_ACCOUNT_SELECTED__EXPECTED')} ${account}`);
    }
  }

  private ensureImportedAccount(account: string) {
    const importedAccount = this.ethereumAuthService.getEthereumAccount(account);
    if (!importedAccount) {
      this.notificationService.showMessage(`${this.translateService.instant('CANNOT_LOAD_IMPORTED_ACCOUNT')} ${account}`, this.translateService.instant('ERROR'));
      throw Error(`${this.translateService.instant('CANNOT_LOAD_IMPORTED_ACCOUNT')} ${account}`);
    }
  }

  protected call(transaction: TransactionObject<any>, account?: string) {
    // NOTE: On call we may use any web3 as request is not signed
    return this.ethereumContractExecutorService.call(transaction, account || null);
  }

  protected async createContract(wallet = EthWalletType.Imported): Promise<Contract> {
    const web3 = await this.createWeb3(wallet);
    return new web3.eth.Contract(this.abi, this.address);
  }

  protected async createContractByAddress(wallet = EthWalletType.Imported, address: string): Promise<Contract> {
    const web3 = await this.createWeb3(wallet);
    return new web3.eth.Contract(this.abi, address);
  }

  protected async createWeb3(wallet: EthWalletType): Promise<Web3> {
    if (wallet === EthWalletType.Imported) {
      return this.ethereumAuthService.getWeb3();
    }
    return this.ethereumAuthService.getInjectedWeb3();
  }
}
