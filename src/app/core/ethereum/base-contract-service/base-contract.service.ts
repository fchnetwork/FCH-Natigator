import Web3 from 'web3';
import { Contract, TransactionObject } from 'web3/types';

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
    protected injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService
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
      throw new Error('Transaction options cannot be empty');
    }

    if (!options.account) {
      throw new Error('Transaction account cannot be empty');
    }

    if (options.wallet === EthWalletType.Injected) {
      await this.ensureInjectedAccount(options.account);
    } else {
      this.ensureImportedAccount(options.account);
    }
  }

  private async ensureInjectedAccount(account: string) {
    const injectedWeb3 = await this.ethereumAuthService.getInjectedWeb3();
    if (!injectedWeb3) {
      this.notificationService.showMessage('Injected web3 not provided', 'Error');
      throw new InjectedWeb3Error('Injected web3 not provided');
    }

    const accounts = await injectedWeb3.eth.getAccounts() || [];
    if (!accounts.length) {
      this.notificationService.showMessage('Please login in Mist / Metamask', 'Error');
      throw new InjectedWeb3Error('Cannot get accounts from selected provider');
    }

    if (accounts.every(acc => acc !== account)) {
      this.notificationService.showMessage(`Please select ${account} and retry`, 'Error');
      throw new InjectedWeb3Error(`Incorrect Mist / Metamask account selected. Expected ${account}`);
    }
  }

  private ensureImportedAccount(account: string) {
    const importedAccount = this.ethereumAuthService.getEthereumAccount(account);
    if (!importedAccount) {
      this.notificationService.showMessage(`Cannot load imported account ${account}`, 'Error');
      throw Error(`Cannot load imported account ${account}`);
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

  protected async createWeb3(wallet: EthWalletType): Promise<Web3> {
    if (wallet === EthWalletType.Imported) {
      return this.ethereumAuthService.getWeb3();
    }
    return this.ethereumAuthService.getInjectedWeb3();
  }
}
