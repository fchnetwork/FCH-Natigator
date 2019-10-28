import { Injectable } from '@angular/core';

import { EnvironmentService } from "@core/general/environment-service/environment.service";
import { retry } from "@shared/helpers/retry";
import Web3 from 'web3';
import { TransactionObject, TransactionReceipt, Tx } from "web3/types";

import { TransactionOptions } from "./transaction-options.model";
import { LoggerService } from '@core/general/logger-service/logger.service';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { StorageService } from "@core/general/storage-service/storage.service";

@Injectable()
export class ContractExecutorService {

  private readonly contractGasThreshold = 100 * 1000;
  private readonly web3: Web3;
  private readonly chainId: number;

  private get address() {
    return this.authService.getAddress();
  }

  private get privateKey() {
    return this.storageService.getSessionData('private_key');
  }

  constructor(
    private logger: LoggerService,
    private authService: AuthenticationService,
    private storageService: StorageService,
    private environment: EnvironmentService
  ) {
    this.web3 = this.authService.getWeb3();
    this.chainId = this.environment.get().chainId;
  }

  async send(transaction: TransactionObject<any>, options?: TransactionOptions) {
    options = this.ensureOptions(options);
    const tx = await this.createSendTx(transaction, options);
    const signedTransaction = await this.web3.eth.accounts.signTransaction(tx, this.privateKey) as any;
    this.logger.logMessage('Transaction being sent');
    const receipt = await this.sendSignedTransaction(signedTransaction.rawTransaction, options);
    return receipt;
  }

  private sendSignedTransaction(data: string, options: TransactionOptions): Promise<TransactionReceipt> {
    let transactionHash: string;
    return new Promise((resolve, reject) => {
      this.web3.eth.sendSignedTransaction(data)
        .on('transactionHash', (hash) => {
          this.logger.logMessage(`Transaction hash: ${hash}`);
          transactionHash = hash;
          if(options.hashReceivedCallback) {
            options.hashReceivedCallback(hash);
          }
        })
        .on('receipt', (receipt) => {
          this.logger.logMessage('Transaction receipt returned:', receipt);
          resolve(receipt);
        })
        .on('error', async (error) => {
          // TODO: We do this workaround due to this issue: https://github.com/ethereum/web3.js/issues/1534
          if(error && error.message && error.message.startsWith('Failed to check for transaction receipt:')) {
            const receipt = await retry(() => this.web3.eth.getTransactionReceipt(transactionHash), 40, 1500);
            this.logger.logWarning('Transaction receipt returned:', receipt);
            resolve(receipt);
          } else {
            this.logger.logError('Transaction error:', error);
            reject(error);
          }
        });
    });
  }

  async call(transaction: TransactionObject<any>) {
    const tx = this.createCallTx(transaction);
    const response = await transaction.call(tx);
    return response.valueOf();
  }

  private createCallTx(transaction: TransactionObject<any>) : Tx {
    return {
      chainId: this.chainId,
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: this.address,
      data: transaction.encodeABI()
    };
  }

  private async createSendTx(transaction: TransactionObject<any>, options: TransactionOptions) : Promise<Tx> {
    const aeroValueInWei = this.web3.utils.toWei(options.value, 'ether');
    const [gasPrice, estimatedGas, transactionsCount] = await this.getSentTxData(transaction, options);

    this.logger.logMessage(`Transaction estimated gas: ${estimatedGas}`);
    return {
      chainId: this.chainId,
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: this.address,
      value: this.web3.utils.toHex(aeroValueInWei),
      gasPrice: this.web3.utils.toHex(gasPrice),
      gas: this.web3.utils.toHex(estimatedGas + this.contractGasThreshold),
      nonce: this.web3.utils.toHex(transactionsCount),
      data: transaction.encodeABI()
    };
  }

  private async getSentTxData(transaction: TransactionObject<any>, options: TransactionOptions) : Promise<[number, number, number]> {
    const aeroValueInWei = this.web3.utils.toWei(options.value, 'ether');

    const getGasPrice = this.web3.eth.getGasPrice();
    const getTransactionsCount = this.web3.eth.getTransactionCount(this.address);
    const getEstimatedGas = transaction.estimateGas({
      chainId: this.chainId,
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: this.address,
      value: this.web3.utils.toHex(aeroValueInWei),
      data: transaction.encodeABI()
    });

    const [gasPrice, estimatedGas, transactionsCount] = await Promise.all([getGasPrice, getEstimatedGas, getTransactionsCount]);
    return [gasPrice, estimatedGas, transactionsCount];
  }

  async estimateCost(transaction: TransactionObject<any>, options?: TransactionOptions) : Promise<[number, number, number]> {
    options = this.ensureOptions(options);
    const aeroValueInWei = this.web3.utils.toWei(options.value, 'ether');

    const getGasPrice = this.web3.eth.getGasPrice();
    const getEstimatedGas = transaction.estimateGas({
      chainId: this.chainId,
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: this.address,
      value: this.web3.utils.toHex(aeroValueInWei),
      data: transaction.encodeABI()
    });

    const [gasPrice, estimatedGas] = await Promise.all([getGasPrice, getEstimatedGas]);
    return [Number(gasPrice), estimatedGas, estimatedGas + this.contractGasThreshold];
  }

  private ensureOptions(options: TransactionOptions): TransactionOptions {
    if (!options) {
      options = {};
    }

    if (!options.value) {
      options.value = '0';
    }

    return options;
  }
}
