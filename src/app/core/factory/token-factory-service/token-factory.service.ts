const artifacts = require('@core/abi/TokenFactory.json');

import { Injectable } from '@angular/core';
import { EnvironmentService } from "@core/general/environment-service/environment.service";

import { CreateTokenModel } from "@core/factory/models/create-token.model";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { BaseContractService } from "@core/contract/base-contract-service/base-contract.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/timer';

@Injectable()
export class TokenFactoryService extends BaseContractService {
  private timer: Subscription;

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService,
    environment: EnvironmentService,
    private loggerService: LoggerService
  ) {
    super(artifacts.abi, environment.get().contracts.factory.address.TokenFactory, authenticationService, contractExecutorService);
  }

  async create(data: CreateTokenModel): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const create = this.contract.methods.create(data.name, data.symbol, data.decimals, data.supply);
        const latestBlockNumber = await this.web3.eth.getBlockNumber();
        await this.contractExecutorService.send(create);
        this.timer = Observable.timer(0, 1000)
        .subscribe(_ => {
          this.contract.getPastEvents('NewToken', { fromBlock: latestBlockNumber, toBlock: 'latest' }, (error, txs) => {
            if (error) {
              this.loggerService.logError("Error on token created event", error);
              this.timer.unsubscribe();
              reject(error);
            }
            if(!txs) { return; }
            txs.forEach(event => {
              this.loggerService.logMessage("Token created event", event);
              const values = event.returnValues;
              // NOTE: Just make sure it's correct event
              if((values.name === data.name) && (values.symbol === data.symbol)) {
                this.timer.unsubscribe();
                resolve(values.token);
              }
            });
          });
        });
      } catch (e) {
        this.loggerService.logError("Error on token creation", e);
        reject(e);
      }
    });
  }

  async estimateCreate(data: CreateTokenModel) {
    const create = this.contract.methods.create(data.name, data.symbol, data.decimals, data.supply);
    const cost = await this.contractExecutorService.estimateCost(create);
    return cost;
  }
}
