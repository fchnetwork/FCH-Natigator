const artifacts = require('@core/abi/AtomicSwapERC20ToEther.json');

import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';

import { BaseContractService } from '../../../contract/base-contract-service/base-contract.service';
import { AuthenticationService } from '../../../authentication/authentication-service/authentication.service';
import { ContractExecutorService } from '../../../contract/contract-executor-service/contract-executor.service';

@Injectable()
export class Erc20ToAeroSwapService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService
  ) {
    super(artifacts.abi, environment.contracts.swap.address.Erc20ToAero, authenticationService, contractExecutorService);
  }

  async openSwap(swapId: string, erc20Value: string, erc20ContractAddress: string, aeroValue: string, aeroTrader: string) {
    const openSwap = this.contract.methods.open(
      this.web3.utils.fromAscii(swapId),
      erc20Value,
      erc20ContractAddress,
      this.web3.utils.toWei(aeroValue, 'ether'),
      aeroTrader
    );
    const receipt = await this.contractExecutorService.send(openSwap);
    return receipt;
  }

  async closeSwap(swapId: string, ethValue: string) {
    const closeSwap = this.contract.methods.close(this.web3.utils.fromAscii(swapId));
    const receipt = await this.contractExecutorService.send(closeSwap, { value: ethValue });
    return receipt;
  }

  async expireSwap(swapId: string) {
    const expireSwap = this.contract.methods.expire(this.web3.utils.fromAscii(swapId));
    const receipt = await this.contractExecutorService.send(expireSwap);
    return receipt;
  }

  async checkSwap(swapId: string) {
    const checkSwap = this.contract.methods.check(this.web3.utils.fromAscii(swapId));
    const response = await this.contractExecutorService.call(checkSwap);
    return response;
  }
}
