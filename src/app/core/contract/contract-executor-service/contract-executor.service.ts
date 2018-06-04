import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

import { environment } from "@env/environment";

import Web3 from 'web3';

import { LoggerService } from '@core/general/logger-service/logger.service';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { BaseContractExecutorService } from "@core/contract/contract-executor-service/base-contract-executor.service";

@Injectable()
export class ContractExecutorService extends BaseContractExecutorService {

  protected currentWalletAddress: string;
  protected privateKey: string;
  protected web3: Web3;
  protected chainId: number;

  constructor(
    logger: LoggerService,
    private authService: AuthenticationService,
    private sessionService: SessionStorageService
  ) {
    super(logger);

    const keystore = this.authService.getKeystore();
    this.currentWalletAddress = "0x" + keystore.address;
    this.privateKey = this.sessionService.retrieve('private_key');

    this.web3 = this.authService.initWeb3();

    this.chainId = environment.chainId;
  }
}
