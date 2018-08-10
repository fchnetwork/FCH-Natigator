const artifacts = require('@core/abi/TokenFactory.json');

import { Injectable } from '@angular/core';
import { environment } from "@env/environment";

import { CreateTokenModel } from "@core/factory/models/create-token.model";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { BaseContractService } from "@core/contract/base-contract-service/base-contract.service";
import { AuthenticationService } from "@core/authentication/authentication-service/authentication.service";
import { ContractExecutorService } from "@core/contract/contract-executor-service/contract-executor.service";

@Injectable()
export class TokenFactoryService extends BaseContractService {

  constructor(
    authenticationService: AuthenticationService,
    contractExecutorService: ContractExecutorService,
    private loggerService: LoggerService
  ) {
    super(artifacts.abi, environment.contracts.factory.address.TokenFactory, authenticationService, contractExecutorService);
  }

  async create(data: CreateTokenModel): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      try {
        const contract = this.createEventsSupportingContract();
        const create = contract.methods.create(data.name, data.symbol, data.decimals, data.supply);

        const latestBlockNumber = await this.web3.eth.getBlockNumber();
        await this.contractExecutorService.send(create);

        contract.events.NewToken({fromBlock: latestBlockNumber}, (err, event) => {
          if (err) {
            this.loggerService.logError("Error on token created event", err);
            reject(err);
          } else {
            this.loggerService.logMessage("Token created event", err);
            const values = event.returnValues;
            // NOTE: Just make sure it's correct event
            if((values.name === data.name) && (values.symbol === data.symbol)) {
              resolve(values.token);
            }
          }
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
