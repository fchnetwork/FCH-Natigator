import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';

import Web3 from 'web3';
import { Contract, Tx, TransactionObject, EventLog } from 'web3/types';
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

  async openSwap(caller: string, swapId: string, aeroValueInGwei: string, erc20Value: string, erc20Trader: string, erc20ContractAddress: string) {

    // TODO: Remove later
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
    const response = await this.send(openSwap, caller, aeroValueInGwei);
  }

  async closeSwap(caller: string, swapId: string) {
    const closeSwap = this.contract.methods.close(this.web3.utils.fromAscii(swapId));
    const response = await this.send(closeSwap, caller);
  }

  async expireSwap(caller: string, swapId: string) {
    const expireSwap = this.contract.methods.expire(this.web3.utils.fromAscii(swapId));
    const response = await this.send(expireSwap, caller);
  }

  async checkSwap(caller: string, swapId: string) {

    // TODO: Remove later
    console.log(caller);
    console.log(this.web3.utils.fromAscii(swapId));

    const checkSwap = this.contract.methods.check(this.web3.utils.fromAscii(swapId));
    const response = await this.call(checkSwap, caller);
  }

  private async send(transaction: TransactionObject<any>, caller: string, aeroValueInGwei = '0') {
    debugger;
    const tx = await this.calculateTransactionOptions(transaction, caller, aeroValueInGwei);
    debugger;
    const response = await transaction.send(tx);

    // TODO: Remove later
    console.log(response.valueOf());

    return response;
  }

  private async call(transaction: TransactionObject<any>, caller: string, aeroValueInGwei = '0') {
    const tx = await this.calculateTransactionOptions(transaction, caller, aeroValueInGwei);
    const response = await transaction.call(tx);

    // TODO: Remove later
    console.log(response.valueOf());

    return response;
  }

  private async calculateTransactionOptions(transaction: TransactionObject<any>, caller: string, aeroValueInGwei = '0') : Promise<Tx> {
    
    // NOTE: shannon is Gwei as per this link http://ethdocs.org/en/latest/ether.html
    const aeroValueInWei = this.web3.utils.toWei(aeroValueInGwei, 'shannon');
    const maxContractGasInWei = this.web3.utils.toWei('16', 'shannon');
    const contractGasThresholdInWei = this.web3.utils.toWei('1', 'shannon');

    const getGasPrice = await this.web3.eth.getGasPrice();
    const getEstimatedGas = transaction.estimateGas({ from: caller, value: aeroValueInWei });

    const [gasPrice, estimatedGas] = await Promise.all([getGasPrice, getEstimatedGas]);

    return { 
      from: caller,
      value: aeroValueInWei,
      gasPrice,
      gas: estimatedGas + contractGasThresholdInWei
    };
  }
}
