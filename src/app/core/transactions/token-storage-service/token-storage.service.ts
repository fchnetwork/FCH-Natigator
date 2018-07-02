import { Injectable } from '@angular/core';

import { environment } from '@app/../environments/environment';

import * as CryptoJS from 'crypto-js';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SessionStorageService } from 'ngx-webstorage';
import { Token } from "@core/transactions/token-service/token.model";

@Injectable()
export class TokenStorageService {
  private key: string;

  constructor(key: string, private sessionStorage: SessionStorageService) {
    this.key = key;
  }

  getTokens() {
    return this.sessionStorage.retrieve(this.key) || [];
  }

  addToken(token: Token) {
    const tokens = this.sessionStorage.retrieve(this.key) || [];
    tokens.push(token);
    this.saveTokens(tokens);
  }

  deleteToken(token: Token) {
    let tokens = this.sessionStorage.retrieve(this.key) || [];
    tokens = tokens.filter((item) => {
      return item.address !== token.address;
    });
    this.saveTokens(tokens);
  }

  saveTokens(tokens: Token[]) {
    const password = this.sessionStorage.retrieve('password');
    const stringtoken = JSON.stringify(tokens);
    const encryptedtokens = CryptoJS.AES.encrypt(stringtoken, password);
    Cookie.set(this.key, encryptedtokens, 7, "/", environment.cookiesDomain);
    this.sessionStorage.store(this.key, tokens);
  }

  updateStoredTokens(token) {
    const tokens = this.sessionStorage.retrieve(this.key);
    const updatedTokens = tokens.filter((item) => {
      return item.symbol !== token.symbol;
    });
    updatedTokens.push(token);
    this.saveTokens(updatedTokens);
  }
}
