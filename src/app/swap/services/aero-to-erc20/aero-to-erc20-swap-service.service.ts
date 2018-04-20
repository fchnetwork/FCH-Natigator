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

  async openSwap(swapId: string, aeroTrader: string, aeroValueInGwei: number, erc20Value: number, erc20Trader: string, erc20ContractAddress: string) {

    const openSwap = this.contract.methods.open(
      this.web3.utils.hexToAscii(swapId),
      // NOTE: we don't support decimals here as ERC20 doen't require decimals
      erc20Value,
      erc20Trader,
      erc20ContractAddress
    );

    const tx = await this.calculateCallOptions(openSwap, aeroTrader, aeroValueInGwei);
    const response = await openSwap.call(tx);

    console.log(response);
  }

  private async calculateCallOptions(callObject: TransactionObject<any>, from: string, aeroValueInGwei: number) : Promise<Tx> {
    
    // NOTE: shannon is Gwei as per this link http://ethdocs.org/en/latest/ether.html
    const aeroValueInWei = this.web3.utils.toWei(aeroValueInGwei, 'shannon');
    const maxContractGas = this.web3.utils.toWei(16, 'shannon');
    const contractGasThresholdInWei = 1000;

    const getGasPrice = await this.web3.eth.getGasPrice();
    const getEstimatedGas = callObject.estimateGas({ from, value: aeroValueInWei });

    const [gasPrice, estimatedGas] = await Promise.all([getGasPrice, getEstimatedGas]);

    return { 
      from,
      value: aeroValueInWei,
      gasPrice,
      gas: estimatedGas + contractGasThresholdInWei
    };
  }
}
