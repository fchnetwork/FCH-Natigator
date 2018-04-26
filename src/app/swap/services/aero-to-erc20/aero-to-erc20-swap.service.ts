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
  private eventSubject = new Subject<EventLog | Error>();

  events: Observable<EventLog | Error>;

  constructor(private authenticationService: AuthenticationService) { 
    this.web3 = this.authenticationService.initWeb3();

    this.contract = new this.web3.eth.Contract(artifacts.abi, environment.contracts.swap.address.AeroToErc20);
    this.contract.events.allEvents({ fromBlock: 'latest' }, (error, event) => this.eventSubject.next(error || event));

    this.events = this.eventSubject.asObservable();
  }

  async openSwap(privateKey: string, caller: string, swapId: string, aeroValueInGwei: string, erc20Value: string, erc20Trader: string, erc20ContractAddress: string) {

    // TODO: Remove later
    console.log(privateKey);
    console.log(caller);
    console.log(this.web3.utils.fromAscii(swapId));
    console.log(aeroValueInGwei);
    console.log(erc20Value);
    console.log(erc20Trader);
    console.log(erc20ContractAddress);

    const openSwap = this.contract.methods.open(
      this.web3.utils.fromAscii(swapId),
      // NOTE: we don't support decimals here as ERC20 doen't require decimals
      erc20Value,
      erc20Trader,
      erc20ContractAddress
    );
    const response = await this.send(privateKey, openSwap, caller, aeroValueInGwei);
  }

  async closeSwap(privateKey: string, caller: string, swapId: string) {
    const closeSwap = this.contract.methods.close(this.web3.utils.fromAscii(swapId));
    const response = await this.send(privateKey, closeSwap, caller);
  }

  async expireSwap(privateKey: string, caller: string, swapId: string) {
    const expireSwap = this.contract.methods.expire(this.web3.utils.fromAscii(swapId));
    const response = await this.send(privateKey, expireSwap, caller);
  }

  async checkSwap(privateKey: string, caller: string, swapId: string) {

    // TODO: Remove later
    console.log(privateKey);
    console.log(caller);
    console.log(this.web3.utils.fromAscii(swapId));

    const checkSwap = this.contract.methods.check(this.web3.utils.fromAscii(swapId));
    const response = await this.call(privateKey, checkSwap, caller);
  }

  private async send(privateKey: string, transaction: TransactionObject<any>, caller: string, aeroValueInGwei = '0') {
    const tx = await this.calculateTransactionOptions(transaction, caller, aeroValueInGwei);
    console.log(tx);
    const txHex = this.web3.utils.toHex(tx);
    // const signedTransaction = this.web3.eth.accounts.sign(txHex, privateKey) as Signature;
    const signedTransaction = await this.web3.eth.accounts.signTransaction(tx, privateKey) as any;
    console.log(signedTransaction);

    const receipt = await this.sendSignedTransaction(signedTransaction.rawTransaction);
    console.log(receipt);

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
          }, 15 * 1000);
        } else {
          console.log('Transaction error:', error);
          reject(error);
        }
      });
    });
  }

  private async call(privateKey: string, transaction: TransactionObject<any>, caller: string) {
    const tx = await this.calculateTransactionOptions(transaction, caller);
    console.log(tx);
    const response = await transaction.call(tx);

    // TODO: Remove later
    console.log(response.valueOf());

    return response;
  }

  private async calculateTransactionOptions(transaction: TransactionObject<any>, caller: string, aeroValueInGwei = '0') : Promise<Tx> {
    
    // NOTE: shannon is Gwei as per this link http://ethdocs.org/en/latest/ether.html
    const aeroValueInWei = this.web3.utils.toWei(aeroValueInGwei, 'shannon');
    const contractGasThreshold = 1000;

    const getGasPrice = this.web3.eth.getGasPrice();
    const getEstimatedGas = transaction.estimateGas({
      chainId: 8522,
      to: environment.contracts.swap.address.AeroToErc20,
      from: caller,
      value: this.web3.utils.toHex(aeroValueInWei),
      data: transaction.encodeABI()
    });

    const getTransactionsCount = this.web3.eth.getTransactionCount(caller);

    const [gasPrice, estimatedGas, transactionsCount] = await Promise.all([getGasPrice, getEstimatedGas, getTransactionsCount]);

    console.log('estimated gas');
    console.log(estimatedGas);
    console.log(estimatedGas + contractGasThreshold);
    return {
      chainId: 8522,
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
