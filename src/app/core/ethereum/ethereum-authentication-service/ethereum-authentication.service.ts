import { Injectable } from '@angular/core';

import { environment } from "@env/environment";
import Web3 from "web3";
import * as CryptoJS from 'crypto-js';
import { toChecksumAddress, addHexPrefix } from "ethereumjs-util";

// TODO: Should be strongly typed
const hdkey = require("ethereumjs-wallet/hdkey");
const bip39 = require("bip39");

import { getCurrentProvider } from "@shared/helpers/web3-providers";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { SessionStorageService } from "ngx-webstorage";
import { EthereumAccount } from "@core/ethereum/ethereum-authentication-service/ethereum-account.model";

declare const window: any;

@Injectable()
export class EthereumAuthenticationService {

  private readonly web3: Web3;
  private readonly injectedWeb3: Promise<Web3>;

  constructor(
    private logger: LoggerService,
    private sessionStorage: SessionStorageService
  ) {
    this.web3 = new Web3(environment.ethereum.endpoint);
    this.injectedWeb3 = this.loadInjectedWeb3();
  }

  private loadInjectedWeb3(): Promise<Web3> {
    return new Promise((resolve, reject) => {

      if (window.web3) {
        this.logger.logMessage("Web3 is present");
        resolve(new Web3(window.web3.currentProvider));
        return;
      }

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
    return this.web3;
  }

  getInjectedWeb3(): Promise<Web3> {
    return this.injectedWeb3;
  }

  async getInjectedProviderName(): Promise<string> {
    await this.getInjectedWeb3();
    return getCurrentProvider();
  }

  getEthereumAccount(address: string): EthereumAccount {
    if (!address) {
      return null;
    }

    const accounts = this.sessionStorage.retrieve('ethereum_accounts') as EthereumAccount[] || [];
    return accounts.find(account => account.address === address);
  }

  saveEthereumAccounts(accounts: EthereumAccount[]): void {
    const password = this.sessionStorage.retrieve('password');
    const stringAccounts = JSON.stringify(accounts);
    const encryptedAccounts = CryptoJS.AES.encrypt(stringAccounts, password);
    Cookie.set('ethereum_accounts', encryptedAccounts, 7, "/", environment.cookiesDomain);
    this.sessionStorage.store('ethereum_accounts', accounts);
  }

  generateAddressFromSeed(seed: string): EthereumAccount {
    const mnemonicToSeed = bip39.mnemonicToSeed(this.cleanSeed(seed));
    const hdWallet = hdkey.fromMasterSeed(mnemonicToSeed);
    const wallet = hdWallet.derivePath("m/44'/312'/0'/0/0").getWallet();
    const getAddress = wallet.getAddress().toString("hex");
    const getChecksumAddress = toChecksumAddress(getAddress);
    const privateKey = wallet.getPrivateKeyString().toString("hex");
    const address = addHexPrefix(getChecksumAddress);
    if (!address || !privateKey) {
      throw new Error("Cannot generate address from seed");
    }
    return {address, privateKey};
  }

  private cleanSeed(seed: string): string {
    let cleanSeed = seed.trim();
    cleanSeed = cleanSeed.replace(/[^\w\s]/gi, ' ');
    cleanSeed.replace(/\s\s+/g, ' ');
    return cleanSeed;
  }
}
