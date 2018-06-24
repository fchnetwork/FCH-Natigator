import { Injectable } from "@angular/core";

import { Tx, TransactionObject, TransactionReceipt } from 'web3/types';
import { toHex, toWei } from "web3-utils";

import { InjectedTransactionOptions } from "@core/ethereum/injected-web3-contract-executor-service/injected-transaction-options.model";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";

@Injectable()
export class InjectedWeb3ContractExecutorService {

  private readonly contractGasThreshold = 100 * 1000;

  constructor(
    private logger: LoggerService,
    private etherAuthService: EthereumAuthenticationService
  ) { }

  async send(transaction: TransactionObject<any>, options: InjectedTransactionOptions): Promise<TransactionReceipt> {
    this.ensureOptions(options);
    const tx = await this.createSendTx(transaction, options);
    this.logger.logMessage('Transaction being sent');
    const receipt = await transaction.send(tx)
      .on('transactionHash', (hash) => {
        this.logger.logMessage(`Transaction hash: ${hash}`);
        if(options.hashReceivedCallback) {
          options.hashReceivedCallback(hash);
        }
      });

    return receipt;
  }

  async call(transaction: TransactionObject<any>, account?: string) {
    const tx = this.createCallTx(transaction, account);
    const response = await transaction.call(tx);
    return response.valueOf();
  }

  private createCallTx(transaction: TransactionObject<any>, account?: string) : Tx {
    return {
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: account,
      data: transaction.encodeABI()
    };
  }

  private async createSendTx(transaction: TransactionObject<any>, options: InjectedTransactionOptions): Promise<Tx> {
    const aeroValueInWei = toWei(options.value, 'ether');
    const [gasPrice, estimatedGas, transactionsCount] = await this.getSentTxData(transaction, options);

    this.logger.logMessage(`Transaction estimated gas: ${estimatedGas}`);
    return {
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: options.account,
      value: toHex(aeroValueInWei),
      gasPrice: toHex(gasPrice),
      gas: toHex(estimatedGas + this.contractGasThreshold),
      nonce: toHex(transactionsCount),
      data: transaction.encodeABI()
    };
  }

  private async getSentTxData(transaction: TransactionObject<any>, options: InjectedTransactionOptions): Promise<[number, number, number]> {
    const web3 = await this.etherAuthService.getInjectedWeb3();
    const aeroValueInWei = toWei(options.value, 'ether');

    const getGasPrice = web3.eth.getGasPrice();
    const getTransactionsCount = web3.eth.getTransactionCount(options.account);
    const getEstimatedGas = transaction.estimateGas({
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: options.account,
      value: toHex(aeroValueInWei),
      data: transaction.encodeABI()
    });

    const [gasPrice, estimatedGas, transactionsCount] = await Promise.all([getGasPrice, getEstimatedGas, getTransactionsCount]);
    return [gasPrice, estimatedGas, transactionsCount];
  }

  async estimateCost(transaction: TransactionObject<any>, options: InjectedTransactionOptions): Promise<[number, number, number]> {
    this.ensureOptions(options);
    const web3 = await this.etherAuthService.getInjectedWeb3();
    const aeroValueInWei = toWei(options.value, 'ether');

    const getGasPrice = web3.eth.getGasPrice();
    const getEstimatedGas = transaction.estimateGas({
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: options.account,
      value: toHex(aeroValueInWei),
      data: transaction.encodeABI()
    });

    const [gasPrice, estimatedGas] = await Promise.all([getGasPrice, getEstimatedGas]);
    return [gasPrice, estimatedGas, estimatedGas + this.contractGasThreshold];
  }

  private ensureOptions(options: InjectedTransactionOptions): void {
    if (!options) {
      throw new Error('Transaction options are not specified');
    }

    if(!options.account) {
      throw new Error('Transaction account is not specified');
    }

    if (!options.value) {
      options.value = '0';
    }
  }
}
