import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

import Web3 from 'web3';

import { LoggerService } from '@core/general/logger-service/logger.service';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { BaseContractExecutorService } from "@core/contract/contract-executor-service/base-contract-executor.service";
import { EthWalletService } from "@core/ethereum/eth-wallet-service/eth-wallet.service";
import { EthereumAuthenticationService } from "@core/ethereum/ethereum-authentication-service/ethereum-authentication.service";

@Injectable()
export class EthereumContractExecutorService extends BaseContractExecutorService {

  protected readonly currentWalletAddress: string;
  protected readonly privateKey: string;
  protected readonly web3: Web3;
  protected chainId: number;

  constructor(
    logger: LoggerService,
    private ethWalletService: EthWalletService,
    private ethAuthenticationService: EthereumAuthenticationService
  ) {
    super(logger);

    this.currentWalletAddress = this.ethWalletService.getAddress();
    this.privateKey = this.ethWalletService.getPrivateKey();

    this.web3 = this.ethAuthenticationService.getWeb3();

    this.chainId = 4;
  }
}
