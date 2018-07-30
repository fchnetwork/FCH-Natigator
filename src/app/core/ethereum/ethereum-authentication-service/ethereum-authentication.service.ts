import { Injectable } from '@angular/core';

import { environment } from "@env/environment";
import Web3 from "web3";
import { toChecksumAddress, addHexPrefix } from "ethereumjs-util";

// TODO: Should be strongly typed
const hdkey = require("ethereumjs-wallet/hdkey");
const bip39 = require("bip39");

import { getCurrentProvider } from "@shared/helpers/web3-providers";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { EthereumAccount } from "@core/ethereum/ethereum-authentication-service/ethereum-account.model";
import { StorageService } from "@core/general/storage-service/storage.service";
import { GlobalEventService } from "@core/general/global-event-service/global-event.service";

declare const window: any;

@Injectable()
export class EthereumAuthenticationService {

  private readonly web3: Web3;
  private readonly injectedWeb3: Promise<Web3>;

  constructor(
    private logger: LoggerService,
    private storageService: StorageService,
    private globalEventService: GlobalEventService
  ) {
    this.web3 = new Web3(environment.ethereum.endpoint);
    this.injectedWeb3 = this.loadInjectedWeb3();
  }

  private loadInjectedWeb3(): Promise<Web3> {
    return new Promise(async (resolve, reject) => {
      if(environment.isMobileBuild) { 
        this.logger.logMessage("Mobile build: Web3 is not provided!");
        resolve(null);
        return; // NO need for window 'load' since 'deviceready' have already fired.
      }

      const windowLoaded = await this.globalEventService.isWindowLoaded();
      if(windowLoaded) {
        if (window.web3) {
          this.logger.logMessage("Web3 is present");
          resolve(new Web3(window.web3.currentProvider));
        }else {
          this.logger.logMessage("Web3 is not provided!");
          resolve(null);
        }
      } else {
        reject("Error while loading injected web3");
      }
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

    const accounts = this.storageService.getSessionData('ethereum_accounts') as EthereumAccount[] || [];
    return accounts.find(account => account.address === address);
  }

  saveEthereumAccounts(accounts: EthereumAccount[]): void {
    const stringAccounts = JSON.stringify(accounts);
    this.storageService.setCookie('ethereum_accounts', stringAccounts, true, 7);
    this.storageService.setSessionData('ethereum_accounts', accounts);
  }

  generateAddressFromSeed(seed: string): EthereumAccount {
    const mnemonicToSeed = bip39.mnemonicToSeed(this.cleanSeed(seed));
    const hdWallet = hdkey.fromMasterSeed(mnemonicToSeed);
    const wallet = hdWallet.derivePath("m/44'/60'/0'/0/0").getWallet();
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
