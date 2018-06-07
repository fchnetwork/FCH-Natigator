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
    const rinkebyAddress = environment.ethereum.endpoint;
    let provider = new Web3.providers.WebsocketProvider(rinkebyAddress);
    const web3 = new Web3(provider);

    provider.on('error', () => this.logger.logError('WS Error'));
    provider.on('end', () => {
      this.logger.logMessage('WS closed');
      this.logger.logMessage('Attempting to reconnect...');
      provider = new Web3.providers.WebsocketProvider(rinkebyAddress);

      provider.on('connect', () => {
        this.logger.logMessage('WSS Reconnected');
      });

      web3.setProvider(provider);
    });

    return web3;
  }

  getInjectedWeb3(): Promise<Web3> {
    return this.injectedWeb3;
  }
}
