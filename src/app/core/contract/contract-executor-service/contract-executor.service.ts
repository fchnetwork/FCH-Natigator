import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { environment } from '@env/environment';

import Web3 from 'web3';
import { Tx, TransactionObject, TransactionReceipt } from 'web3/types';

import { LoggerService } from '@core/general/logger-service/logger.service';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';

@Injectable()
export class ContractExecutorService {

  currentWalletAddress: string;
  privateKey: string;

  private readonly contractGasThreshold = 100 * 1000;
  private readonly web3: Web3;

  constructor(
    private logger: LoggerService,
    private authService: AuthenticationService,
    private sessionService: SessionStorageService
  ) {
    const keystore = this.authService.getKeystore();
    this.currentWalletAddress = "0x" + keystore.address;
    this.privateKey = this.sessionService.retrieve('private_key');

    this.web3 = this.authService.initWeb3();
  }

  async send(transaction: TransactionObject<any>, options: { value: string } = { value: '0' }) {
    const tx = await this.createSendTx(transaction, options);
    const signedTransaction = await this.web3.eth.accounts.signTransaction(tx, this.privateKey) as any;
    this.logger.logMessage('Transaction being sent');
    const receipt = await this.sendSignedTransaction(signedTransaction.rawTransaction);
    return receipt;
  }

  private sendSignedTransaction(data: string) : Promise<TransactionReceipt> {
    let transactionHash: string;
    return new Promise((resolve, reject) => {
      this.web3.eth.sendSignedTransaction(data)
      .on('transactionHash', (hash) => {
        this.logger.logMessage(`Transaction hash: ${hash}`);
        transactionHash = hash;
      })
      .on('receipt', (receipt) => {
        this.logger.logMessage('Transaction receipt returned:', receipt);
        resolve(receipt);
      })
      .on('error', async (error) => {
        // TODO: We do this workaround due to this issue: https://github.com/ethereum/web3.js/issues/1534
        if(error && error.message && error.message.startsWith('Failed to check for transaction receipt:')) {
          const receipt = await this.retry(() => this.web3.eth.getTransactionReceipt(transactionHash), 40, 1500);
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
      chainId: environment.chainId,
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: this.currentWalletAddress,
      data: transaction.encodeABI()
    };
  }

  private async createSendTx(transaction: TransactionObject<any>, options: { value: string } = { value: '0' }) : Promise<Tx> {
    const aeroValueInWei = this.web3.utils.toWei(options.value, 'ether');
    const [gasPrice, estimatedGas, transactionsCount] = await this.getSentTxData(transaction, options);

    this.logger.logMessage(`Transaction estimated gas: ${estimatedGas}`);
    return {
      chainId: environment.chainId,
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: this.currentWalletAddress,
      value: this.web3.utils.toHex(aeroValueInWei),
      gasPrice: this.web3.utils.toHex(gasPrice),
      gas: this.web3.utils.toHex(estimatedGas + this.contractGasThreshold),
      nonce: this.web3.utils.toHex(transactionsCount),
      data: transaction.encodeABI()
    };
  }

  private async getSentTxData(transaction: TransactionObject<any>, options: { value: string } = { value: '0' }) : Promise<[number, number, number]> {
    const aeroValueInWei = this.web3.utils.toWei(options.value, 'ether');

    const getGasPrice = this.web3.eth.getGasPrice();
    const getTransactionsCount = this.web3.eth.getTransactionCount(this.currentWalletAddress);
    const getEstimatedGas = transaction.estimateGas({
      chainId: environment.chainId,
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: this.currentWalletAddress,
      value: this.web3.utils.toHex(aeroValueInWei),
      data: transaction.encodeABI()
    });

    const [gasPrice, estimatedGas, transactionsCount] = await Promise.all([getGasPrice, getEstimatedGas, getTransactionsCount]);
    return [gasPrice, estimatedGas, transactionsCount];
  }

  async estimateCost(transaction: TransactionObject<any>, options: { value: string } = { value: '0' }) : Promise<[number, number, number]> {
    const aeroValueInWei = this.web3.utils.toWei(options.value, 'ether');

    const getGasPrice = this.web3.eth.getGasPrice();
    const getEstimatedGas = transaction.estimateGas({
      chainId: environment.chainId,
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: this.currentWalletAddress,
      value: this.web3.utils.toHex(aeroValueInWei),
      data: transaction.encodeABI()
    });

    const [gasPrice, estimatedGas] = await Promise.all([getGasPrice, getEstimatedGas]);
    return [gasPrice, estimatedGas, estimatedGas + this.contractGasThreshold];
  }

  private retry<T>(func: () => Promise<T>, times: number, interval: number) : Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      if(times <= 0) {
        reject('Cannot retry 0 times');
        return;
      }

      if(times === 1) {
        resolve(await func());
        return;
      }

      try {
        const response = await func();
        resolve(response);
        return;
      } catch(e) {
        console.warn(e.message);
      }

      setTimeout(async () => {
        resolve(await this.retry(func, times - 1, interval));
      }, interval);
    });
  }
}
