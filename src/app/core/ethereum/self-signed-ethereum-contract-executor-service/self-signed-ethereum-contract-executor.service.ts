import { Injectable } from '@angular/core';

import { environment } from "@env/environment";
import Web3 from 'web3';

import { LoggerService } from "@core/general/logger-service/logger.service";
import { BaseContractExecutorService } from "@core/contract/contract-executor-service/base-contract-executor.service";
import { ContractExecutorService } from "@core/ethereum/contract-executor-service/contract.executor.service";

@Injectable()
export class SelfSignedEthereumContractExecutorService extends BaseContractExecutorService implements ContractExecutorService {

  protected currentWalletAddress: string;
  protected privateKey: string;
  protected web3: Web3;
  protected chainId: number;

  constructor(logger: LoggerService) {
    super(logger);

    this.chainId = environment.ethereum.chainId;
  }

  init(web3: Web3, account: string, privateKey: string): void {
    this.web3 = web3;
    this.currentWalletAddress = account;
    this.privateKey = privateKey;
  }

  getWeb3() {
    return this.web3;
  }
}
