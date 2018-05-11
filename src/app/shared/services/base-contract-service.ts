import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { ContractExecutorService } from '@app/shared/services/contract-executor.service';

import Web3 from 'web3';
import { Contract } from 'web3/types';

export class BaseContractService {
    protected web3: Web3;
    protected contract: Contract;
  
    constructor(
      protected abi: any[],
      protected address: string,
      protected authenticationService: AuthenticationService,
      protected contractExecutorService: ContractExecutorService
    ) { 
      this.web3 = this.authenticationService.initWeb3();
      this.contract = new this.web3.eth.Contract(abi, address);
    }
}
