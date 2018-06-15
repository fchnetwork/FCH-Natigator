import * as CryptoJS from 'crypto-js';
import { environment } from '@app/../environments/environment';
import { Injectable } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SessionStorageService } from 'ngx-webstorage';
import Web3 from 'web3';
import { tokensABI } from '@app/core/abi/tokens';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { iToken } from '@shared/app.interfaces';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { Token } from "@core/transactions/token-service/token.model";
import { LoggerService } from "@core/general/logger-service/logger.service";
import { TokenError } from "@core/transactions/token-service/token.error";

@Injectable()
export class TokenService {
  web3: Web3;
  tokensContract: any;
  tokens$: BehaviorSubject<iToken> = new BehaviorSubject(<any>[]);

  constructor(
    private logger: LoggerService,
    private _auth: AuthenticationService,
    private sessionStorage: SessionStorageService,
  ) {
    this.web3 = _auth.getWSWeb3();
  }

  addToken(tokenData) {
    const token = tokenData;
    const tokens = this.sessionStorage.retrieve('tokens') || [];
    tokens.push(token);
    this.saveTokens(tokens);
    // ADD observable here
    this.tokens$.next(tokens);
    setTimeout(() => {
      this.updateTokensBalance();
    }, 100);
  }

  deleteToken(token) {
    let tokens = this.sessionStorage.retrieve('tokens') || [];
    tokens = tokens.filter((item) => {
      return item.address !== token.address;
    });
    this.saveTokens(tokens);
    // ADD observable here
    this.tokens$.next(tokens);
    setTimeout(() => {
      this.updateTokensBalance();
    }, 100);
  }

  saveTokens(tokens) {
    const password = this.sessionStorage.retrieve('password');
    const stringtoken = JSON.stringify(tokens);
    const encryptedtokens = CryptoJS.AES.encrypt(stringtoken, password);
    Cookie.set('tokens', encryptedtokens, 7, "/", environment.cookiesDomain);
    this.sessionStorage.store('tokens', tokens);
  }

  getTokens() {
    return this.sessionStorage.retrieve('tokens');
  }

  updateStoredTokens(token) {
    const tokens = this.sessionStorage.retrieve('tokens');
    const updatedTokens = tokens.filter((item) => {
      return item.symbol !== token.symbol;
    });
    updatedTokens.push(token);
    this.saveTokens(updatedTokens);
  }

  getTokenBalance(tokenAddress) {
    return new Promise((resolve)=>{
      const address = this.sessionStorage.retrieve('acc_address');
      this.tokensContract = new this.web3.eth.Contract(tokensABI, tokenAddress);
      this.tokensContract.methods.balanceOf(address).call({}).then((res) => {
        resolve(res);
      });
    });
  }

  updateTokensBalance() {
    const tokens = this.sessionStorage.retrieve('tokens');
    const address = this.sessionStorage.retrieve('acc_address');
    return new Promise((resolve) => {
      for (let i = 0; i < tokens.length; i++) {
        this.tokensContract = new this.web3.eth.Contract(tokensABI, tokens[i].address);
        this.tokensContract.methods.balanceOf(address).call({}).then((res) => {
          tokens[i].balance = res / Math.pow(10, tokens[i].decimals);
          this.updateStoredTokens(tokens[i]);
          if (i === Number(tokens.length - 1)) {
            const tokens = this.sessionStorage.retrieve('tokens');
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

  getLocalTokenInfo(address: string): Token {
    if (!address) {
      return null;
    }

    const tokens = this.getTokens();
    const token = tokens.find(item => item.address.toLowerCase() === address.toLowerCase());
    return token;
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
    const myAddress = this.sessionStorage.retrieve('acc_address');
    const [symbol, decimals, totalSupply, balance] = await Promise.all([
      this.safePromise(this.tokensContract.methods.symbol().call({from: myAddress}), null),
      this.safePromise(this.tokensContract.methods.decimals().call({from: myAddress}), 0),
      this.safePromise(this.tokensContract.methods.totalSupply().call({from: myAddress}), 0),
      this.safePromise(this.tokensContract.methods.balanceOf(myAddress).call({from: myAddress}), 0)
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

  private async safePromise<T>(promise: Promise<T>, defaultValue: T = null) {
    try {
      return await promise;
    } catch (e) {
      return defaultValue;
    }
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
      const tokensContract = new this.web3.eth.Contract(tokensABI, contractAddress);
      tokensContract.events.Transfer({fromBlock: blockNumber}, (contractEventsErr, eventsRes) => {
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
