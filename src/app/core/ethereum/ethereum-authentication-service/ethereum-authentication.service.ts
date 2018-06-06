import { Injectable } from '@angular/core';

import { environment } from "@env/environment";
import Web3 from "web3";
import * as CryptoJS from 'crypto-js';

import { LoggerService } from "@core/general/logger-service/logger.service";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { SessionStorageService } from "ngx-webstorage";
import { EthereumAccount } from "@core/ethereum/ethereum-authentication-service/ethereum-account.model";

declare const window: any;

@Injectable()
export class EthereumAuthenticationService {

  private readonly injectedWeb3: Promise<Web3>;

  constructor(
    private logger: LoggerService,
    private sessionStorage: SessionStorageService
  ) {
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

  saveEthereumAccounts(accounts: EthereumAccount[]): void {
    const password = this.sessionStorage.retrieve('password');
    const stringAccounts = JSON.stringify(accounts);
    const encryptedAccounts = CryptoJS.AES.encrypt(stringAccounts, password);
    Cookie.set('ethereum_accounts', encryptedAccounts, 7, "/", environment.cookiesDomain);
    this.sessionStorage.store('ethereum_accounts', accounts);
  }
}
