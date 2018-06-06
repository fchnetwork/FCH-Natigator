import { Injectable } from '@angular/core';

import { environment } from "@env/environment";
import Web3 from "web3";

import { LoggerService } from "@core/general/logger-service/logger.service";

declare const window: any;

@Injectable()
export class EthereumAuthenticationService {

  private readonly injectedWeb3: Promise<Web3>;

  constructor(private logger: LoggerService) {
    this.injectedWeb3 = new Promise((resolve, reject) => {
      window.addEventListener('load', () => {
        try {
          if (!window.web3) {
            this.logger.logMessage("Web3 is not provided!");
            resolve(null);
          } else {
            this.logger.logMessage("Web3 is present");
            resolve(new Web3(window.web3.currentProvider));
          }
        } catch (e) {
          reject("Error while loading injected web3");
        }
      });
    });
  }

  getWeb3(): Web3 {
    const ethereumEndpoint = environment.ethereum.endpoint;
    return new Web3(ethereumEndpoint);
  }

  getInjectedWeb3(): Promise<Web3> {
    return this.injectedWeb3;
  }
}
