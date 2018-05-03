import { Injectable } from '@angular/core';

import { SessionStorageService } from 'ngx-webstorage/dist/services';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';

import { environment } from 'environments/environment';

import Web3 from 'web3';
import { Contract, Tx, TransactionObject, EventLog, Signature, TransactionReceipt } from 'web3/types';
import { setTimeout } from 'timers';

@Injectable()
export class ContractExecutorService {

  currentWalletAddress: string;
  privateKey: string;

  private web3: Web3;

  constructor(
    private authService: AuthenticationService,
    private sessionService: SessionStorageService
  ) {
    const keystore = this.authService.getKeystore();
    this.currentWalletAddress = "0x" + keystore.address;
    this.privateKey = this.sessionService.retrieve('private_key');

    this.web3 = this.authService.initWeb3();
  }

  async send(transaction: TransactionObject<any>, options: { value: string } = { value: '0' }) {
    const tx = await this.createTx(transaction, options.value);
    const txHex = this.web3.utils.toHex(tx);
    const signedTransaction = await this.web3.eth.accounts.signTransaction(tx, this.privateKey) as any;
    console.log('Transaction being sent');
    const receipt = await this.sendSignedTransaction(signedTransaction.rawTransaction);
    return receipt;
  }
  
  private sendSignedTransaction(data: string) : Promise<TransactionReceipt> {
    let transactionHash: string;
    return new Promise((resolve, reject) => {
      this.web3.eth.sendSignedTransaction(data)
      .on('transactionHash', (hash) => {
        console.log(`Transaction hash: ${hash}`);
        transactionHash = hash;
      })
      .on('receipt', (receipt) => {
        console.log('Transaction receipt returned:', receipt);
        resolve(receipt); 
      })
      .on('error', async (error) => {
        // TODO: We do this workarround due to this issue: https://github.com/ethereum/web3.js/issues/1534
        if(error && error.message && error.message.startsWith('Failed to check for transaction receipt:')) {
          const receipt = await this.retry(() => this.web3.eth.getTransactionReceipt(transactionHash), 10, 1500);
          console.log('Transaction receipt returned:', receipt);
          resolve(receipt);
        } else {
          console.log('Transaction error:', error);
          reject(error);
        }
      });
    });
  }

  async call(transaction: TransactionObject<any>) {
    const tx = await this.createTx(transaction);
    const response = await transaction.call(tx);
    return response.valueOf();
  }

  private async createTx(transaction: TransactionObject<any>, aeroValue = '0') : Promise<Tx> {
    const aeroValueInWei = this.web3.utils.toWei(aeroValue, 'ether');
    const contractGasThreshold = 10 * 1000;

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

    console.log(`Transaction estimated gas: ${estimatedGas}`);
    return {
      chainId: environment.chainId,
      // NOTE: Accessing private members is not the best way to do this but no need for another parameter
      to: (transaction as any)._parent._address,
      from: this.currentWalletAddress,
      value: this.web3.utils.toHex(aeroValueInWei),
      gasPrice: this.web3.utils.toHex(gasPrice),
      gas: this.web3.utils.toHex(estimatedGas + contractGasThreshold),
      nonce: this.web3.utils.toHex(transactionsCount),
      data: transaction.encodeABI()
    };
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
        const respone = await func();
        resolve(respone);
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
