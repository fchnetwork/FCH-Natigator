import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';

import { environment } from 'environments/environment';

import Web3 from 'web3';
import { Contract, Tx, TransactionObject } from 'web3/types';
const abi = require('./abi/AtomicSwapEtherToERC20.json');

@Injectable()
export class AeroToErc20SwapServiceService {

  web3: Web3;
  contract: Contract;

  constructor(private authenticationService: AuthenticationService) { 
    this.web3 = this.authenticationService.initWeb3();

    this.contract = new this.web3.eth.Contract(abi, environment.contracts.swap.address.AeroToErc20);
  }

  async openSwap(caller: string, swapId: string, aeroValueInGwei: number, erc20Value: number, erc20Trader: string, erc20ContractAddress: string) {
    const openSwap = this.contract.methods.open(
      this.web3.utils.hexToAscii(swapId),
      // NOTE: we don't support decimals here as ERC20 doen't require decimals
      erc20Value,
      erc20Trader,
      erc20ContractAddress
    );
    const response = await this.execute(openSwap, caller);
  }

  async closeSwap(caller: string, swapId: string) {
    const closeSwap = this.contract.methods.close(this.web3.utils.hexToAscii(swapId));
    const response = await this.execute(closeSwap, caller);
  }

  async expireSwap(caller: string, swapId: string) {
    const expireSwap = this.contract.methods.expire(this.web3.utils.hexToAscii(swapId));
    const response = await this.execute(expireSwap, caller);
  }

  async checkSwap(caller: string, swapId: string) {
    const checkSwap = this.contract.methods.check(this.web3.utils.hexToAscii(swapId));
    const response = await this.execute(checkSwap, caller);
  }

  private async execute(transaction: TransactionObject<any>, caller: string, aeroValueInGwei = 0) {
    const tx = await this.calculateTransactionOptions(transaction, caller, aeroValueInGwei);
    const response = await transaction.call(tx);

    // TODO: Remove later
    console.log(response);

    return response;
  }

  private async calculateTransactionOptions(transaction: TransactionObject<any>, caller: string, aeroValueInGwei = 0) : Promise<Tx> {
    
    // NOTE: shannon is Gwei as per this link http://ethdocs.org/en/latest/ether.html
    const aeroValueInWei = this.web3.utils.toWei(aeroValueInGwei, 'shannon');
    const maxContractGasInWei = this.web3.utils.toWei(16, 'shannon');
    const contractGasThresholdInWei = this.web3.utils.toWei(1, 'shannon');

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
