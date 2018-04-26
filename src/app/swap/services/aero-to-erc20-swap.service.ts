import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';

import Web3 from 'web3';
import { Contract, Tx, TransactionObject, EventLog, Signature, TransactionReceipt } from 'web3/types';
import { setTimeout } from 'timers';
const artifacts = require('./abi/AtomicSwapEtherToERC20.json');

@Injectable()
export class AeroToErc20SwapService {

  private web3: Web3;
  private contract: Contract;

  constructor(private authenticationService: AuthenticationService) { 
    this.web3 = this.authenticationService.initWeb3();
    this.contract = new this.web3.eth.Contract(artifacts.abi, environment.contracts.swap.address.AeroToErc20);
  }

  async openSwap(privateKey: string, caller: string, swapId: string, aeroValue: string, erc20Value: string, erc20Trader: string, erc20ContractAddress: string) {
    const openSwap = this.contract.methods.open(
      this.web3.utils.fromAscii(swapId),
      // NOTE: we don't support decimals here as ERC20 doen't require decimals
      erc20Value,
      erc20Trader,
      erc20ContractAddress
    );
    const receipt = await this.send(privateKey, openSwap, caller, aeroValue);
    return receipt;
  }

  async closeSwap(privateKey: string, caller: string, swapId: string) {
    const closeSwap = this.contract.methods.close(this.web3.utils.fromAscii(swapId));
    const receipt = await this.send(privateKey, closeSwap, caller);
    return receipt;
  }

  async expireSwap(privateKey: string, caller: string, swapId: string) {
    const expireSwap = this.contract.methods.expire(this.web3.utils.fromAscii(swapId));
    const response = await this.send(privateKey, expireSwap, caller);
    return response;
  }

  async checkSwap(privateKey: string, caller: string, swapId: string) {
    const checkSwap = this.contract.methods.check(this.web3.utils.fromAscii(swapId));
    const receipt = await this.call(privateKey, checkSwap, caller);
    return receipt;
  }

  private async send(privateKey: string, transaction: TransactionObject<any>, caller: string, aeroValue = '0') {
    const tx = await this.createTx(transaction, caller, aeroValue);
    const txHex = this.web3.utils.toHex(tx);
    const signedTransaction = await this.web3.eth.accounts.signTransaction(tx, privateKey) as any;
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
      .on('error', (error) => {
        // TODO: We do this workarround due to this issue: https://github.com/ethereum/web3.js/issues/1534
        // TODO: We probably need retry here / not rely on seconds
        if(error && error.message && error.message.startsWith('Failed to check for transaction receipt:')) {
          setTimeout(async () => {
            const receipt = await this.web3.eth.getTransactionReceipt(transactionHash);
            console.log('Transaction receipt:', receipt);
            resolve(receipt);
          }, 10 * 1000);
        } else {
          console.log('Transaction error:', error);
          reject(error);
        }
      });
    });
  }

  private async call(privateKey: string, transaction: TransactionObject<any>, caller: string) {
    const tx = await this.createTx(transaction, caller);
    const response = await transaction.call(tx);
    return response.valueOf();
  }

  private async createTx(transaction: TransactionObject<any>, caller: string, aeroValue = '0') : Promise<Tx> {
    const aeroValueInWei = this.web3.utils.toWei(aeroValue, 'ether');
    const contractGasThreshold = 1000;

    const getGasPrice = this.web3.eth.getGasPrice();
    const getTransactionsCount = this.web3.eth.getTransactionCount(caller);
    const getEstimatedGas = transaction.estimateGas({
      chainId: environment.chainId,
      to: environment.contracts.swap.address.AeroToErc20,
      from: caller,
      value: this.web3.utils.toHex(aeroValueInWei),
      data: transaction.encodeABI()
    });

    const [gasPrice, estimatedGas, transactionsCount] = await Promise.all([getGasPrice, getEstimatedGas, getTransactionsCount]);

    console.log(`Transaction estimated gas: ${estimatedGas}`);
    return {
      chainId: environment.chainId,
      to: environment.contracts.swap.address.AeroToErc20,
      from: caller,
      value: this.web3.utils.toHex(aeroValueInWei),
      gasPrice: this.web3.utils.toHex(gasPrice),
      gas: this.web3.utils.toHex(estimatedGas + contractGasThreshold),
      nonce: this.web3.utils.toHex(transactionsCount),
      data: transaction.encodeABI()
    };
  }
}
