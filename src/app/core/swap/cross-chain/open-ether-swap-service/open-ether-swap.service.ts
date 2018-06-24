const artifacts = require('@core/abi/OpenAtomicSwapEther.json');

import { Injectable } from '@angular/core';

import { environment } from "@env/environment";
import Web3 from "web3";
import { Contract, TransactionObject } from "web3/types";
import { fromWei, fromAscii } from "web3-utils";

import { secondsToDate } from "@shared/helpers/date-util";
import { toBigNumberString } from "@shared/helpers/number-utils";
import { EthWalletType } from "@external/models/eth-wallet-type.enum";
import { InjectedWeb3Error } from "@external/models/injected-web3.error";
import { TransactionOptions } from "@core/swap/cross-chain/open-ether-swap-service/execution-options.model";
import { OpenEtherSwap } from "@core/swap/cross-chain/open-ether-swap-service/open-ether-swap.model";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";
import { EthereumContractExecutorService } from "@core/ethereum/ethereum-contract-executor-service/ethereum-contract-executor.service";
import { InjectedWeb3ContractExecutorService } from "@core/ethereum/injected-web3-contract-executor-service/injected-web3-contract-executor.service";
import { InternalNotificationService } from "@core/general/internal-notification-service/internal-notification.service";

@Injectable()
// Todo: Finish this cleanup
export class OpenEtherSwapService {

  constructor(
    private notificationService: InternalNotificationService,
    private ethereumAuthService: EthereumAuthenticationService,
    private ethereumContractExecutorService: EthereumContractExecutorService,
    private injectedWeb3ContractExecutorService: InjectedWeb3ContractExecutorService
  ) { }

  async openSwap(hash: string, ethValue: string, withdrawTrader: string, timelock: number, options: TransactionOptions) {
    const contract = await this.createContract(options.wallet);
    const openSwap = contract.methods.open(hash, withdrawTrader, toBigNumberString(timelock));
    const receipt = await this.send(openSwap, options, ethValue);
    return receipt;
  }

  async closeSwap(hash: string, secretKey: string, options: TransactionOptions) {
    const contract = await this.createContract(options.wallet);
    const closeSwap = contract.methods.close(hash, fromAscii(secretKey));
    const receipt = await this.send(closeSwap, options);
    return receipt;
  }

  async expireSwap(hash: string, options: TransactionOptions) {
    const contract = await this.createContract(options.wallet);
    const expireSwap = contract.methods.expire(hash);
    const receipt = await this.send(expireSwap, options);
    return receipt;
  }

  async checkSwap(hash: string): Promise<OpenEtherSwap> {
    const contract = await this.createContract();
    const checkSwap = contract.methods.check(hash);
    const response = await this.call(checkSwap);
    const swap: OpenEtherSwap = {
      hash,
      openTrader: response.openTrader,
      withdrawTrader: response.withdrawTrader,
      value: Number(fromWei(response.value, 'ether')),
      timelock: Number(response.timelock),
      openedOn: secondsToDate(Number(response.openedOn)),
      state: Number(response.state)
    };
    return swap;
  }

  async checkSecretKey(hash: string) {
    const contract = await this.createContract();
    const checkSecretKey = contract.methods.checkSecretKey(hash);
    const response = await this.call(checkSecretKey);
    return response;
  }

  async getAccountSwapIds(address: string): Promise<string[]> {
    const contract = await this.createContract();
    const getAccountSwaps = contract.methods.getAccountSwaps(address);
    const swapIds = await this.call(getAccountSwaps, address);
    return swapIds;
  }

  private async send(transaction: TransactionObject<any>, options: TransactionOptions, value = '0') {
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

  private call(transaction: TransactionObject<any>, account?: string) {
      return this.ethereumContractExecutorService.call(transaction, account || null);
  }

  private async createContract(wallet = EthWalletType.Imported): Promise<Contract> {
    const web3 = await this.createWeb3(wallet);
    return new web3.eth.Contract(
      artifacts.abi,
      environment.contracts.swap.crossChain.address.ethereum.OpenEtherSwap
    );
  }

  private async createWeb3(wallet: EthWalletType): Promise<Web3> {
    if (wallet === EthWalletType.Imported) {
      return this.ethereumAuthService.getWeb3();
    }
    return this.ethereumAuthService.getInjectedWeb3();
  }

}
