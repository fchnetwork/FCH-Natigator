import { Injectable } from '@angular/core';

import Web3 from 'web3';
import { Contract } from "web3/types";
import { safePromise } from "@app/shared/helpers/promise-utils";
import { tokensABI } from '@app/core/abi/tokens';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { iToken } from '@shared/app.interfaces';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { Token } from "@core/transactions/token-service/token.model";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { TokenError } from "@core/transactions/token-service/token.error";
import { TokenStorageService } from "@core/transactions/token-storage-service/token-storage.service";
import { StorageService } from "@core/general/storage-service/storage.service";
import { bigNumbersPow, bigNumbersDivide, bigNumberToString } from "@shared/helpers/number-utils";

@Injectable()
export class TokenService {

  web3: Web3;
  wsWeb3: Web3;

  tokensContract: Contract;
  tokens$: BehaviorSubject<iToken> = new BehaviorSubject(<any>[]);

  private tokenStorageService: TokenStorageService;

  constructor(
    private logger: LoggerService,
    private authService: AuthenticationService,
    private storageService: StorageService
  ) {
    this.web3 = authService.getWeb3();
    this.wsWeb3 = authService.getWSWeb3();
    this.tokenStorageService = new TokenStorageService("tokens", this.storageService);
  }

  addToken(tokenData) {
    this.tokenStorageService.addToken(tokenData);
    const tokens = this.tokenStorageService.getTokens();
    // ADD observable here
    this.tokens$.next(tokens);
    setTimeout(() => {
      this.updateTokensBalance();
    }, 100);
  }

  deleteToken(token) {
    this.tokenStorageService.deleteToken(token);
    const tokens = this.tokenStorageService.getTokens();
    // ADD observable here
    this.tokens$.next(tokens);
    setTimeout(() => {
      this.updateTokensBalance();
    }, 100);
  }

  saveTokens(tokens) {
    this.tokenStorageService.saveTokens(tokens);
  }

  getTokens() {
    return this.tokenStorageService.getTokens();
  }

  updateStoredTokens(token) {
    this.tokenStorageService.updateStoredTokens(token);
  }

  getTokenBalance(tokenAddress) {
    return new Promise((resolve)=>{
      const address = this.storageService.getSessionData('acc_address');
      this.tokensContract = new this.web3.eth.Contract(tokensABI, tokenAddress);
      this.tokensContract.methods.balanceOf(address).call({}).then((res) => {
        resolve(res);
      });
    });
  }

  updateTokensBalance() {
    const tokens = this.storageService.getSessionData('tokens');
    const address = this.storageService.getSessionData('acc_address');
    return new Promise((resolve) => {
      for (let i = 0; i < tokens.length; i++) {
        this.tokensContract = new this.web3.eth.Contract(tokensABI, tokens[i].address);
        this.tokensContract.methods.balanceOf(address).call({}).then((res) => {
          const balance = bigNumbersDivide(res, bigNumbersPow(10, tokens[i].decimals));
          tokens[i].balance = bigNumberToString(balance);
          this.updateStoredTokens(tokens[i]);
          if (i === Number(tokens.length - 1)) {
            const tokens = this.storageService.getSessionData('tokens');
            resolve(tokens);
          }
        });
      }
    });
  }

  async getTokensInfo(contractAddress): Promise<Token> {
    let token = this.getLocalTokenInfo(contractAddress);
    if (token && token.symbol) {
      return token;
    }

    token = await this.getNetworkTokenInfo(contractAddress);
    // NOTE: We don't support not detailed tokens which are not stored locally so throw error here
    if (!token || !token.symbol) {
      throw new TokenError(`Error while loading ${contractAddress} token info`);
    }

    return token;
  }

  async getSaveTokensInfo(contractAddress): Promise<Token> {
    let token = this.getLocalTokenInfo(contractAddress);
    if (token && token.symbol) {
      return token;
    }

    token = await this.getNetworkTokenInfo(contractAddress);
    if (!token.symbol) {
      token.symbol = contractAddress;
    }

    return token;
  }

  getLocalTokenInfo(address: string): Token {
    return this.tokenStorageService.getLocalTokenInfo(address);
  }

  async getNetworkTokenInfo(address: string): Promise<Token> {
    try {
      return this.tryGetNetworkTokenInfo(address);
    } catch (e) {
      this.logger.logError(`Error while loading ${address} token info`, e);
      throw new TokenError(`Error while loading ${address} token info`);
    }
  }

  private async tryGetNetworkTokenInfo(contractAddress): Promise<Token> {
    const address = this.web3.utils.isAddress(contractAddress);
    if (!address) {
      throw new Error('Not valid address');
    }

    this.tokensContract = new this.web3.eth.Contract(tokensABI, contractAddress);
    const myAddress = this.storageService.getSessionData('acc_address');
    const [symbol, decimals, totalSupply, balance] = await Promise.all([
      safePromise(this.tokensContract.methods.symbol().call({from: myAddress}), null),
      safePromise(this.tokensContract.methods.decimals().call({from: myAddress}), 0),
      safePromise(this.tokensContract.methods.totalSupply().call({from: myAddress}), 0),
      safePromise(this.tokensContract.methods.balanceOf(myAddress).call({from: myAddress}), 0)
    ]);

    const decimalsNumber = Number(decimals) || 0;
    const token: Token = {
      address: contractAddress,
      symbol: symbol || null,
      decimals: decimalsNumber,
      totalSupply: Number(totalSupply) || 0,
      balance: (Number(balance) || 0) / Math.pow(10, Number(decimalsNumber))
    };

    return token;
  }

  tokenFallbackCheck(receiver, signature) {
    return new Promise((resolve, reject) => {
      this.web3.eth.getCode(receiver).then((res) => {
        let hash = this.web3.utils.keccak256(signature);
        hash = "63" + hash.slice(2, 10);
        resolve(res.includes(hash));
      });
    });

  }

  getTokenTransactionValue(contractAddress, blockNumber) {
    return new Promise((resolve, reject) => {
      const wsTokensContract = new this.wsWeb3.eth.Contract(tokensABI, contractAddress);
      wsTokensContract.events.Transfer({fromBlock: blockNumber}, (contractEventsErr, eventsRes) => {
        if (contractEventsErr) {
          reject(contractEventsErr);
        } else {
          if (eventsRes.blockNumber === blockNumber) {
            resolve(eventsRes.returnValues._value);
          }
        }
      });
    });
  }
}
