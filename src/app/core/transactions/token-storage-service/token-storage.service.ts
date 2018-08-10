import { Injectable } from '@angular/core';
import { Token } from "@core/transactions/token-service/token.model";
import { StorageService } from "@core/general/storage-service/storage.service";

@Injectable()
export class TokenStorageService {
  private key: string;

  constructor(key: string, private storageService: StorageService) {
    this.key = key;
  }

  getTokens() {
    return this.storageService.getSessionData(this.key) || [];
  }

  addToken(token: Token) {
    const tokens = this.storageService.getSessionData(this.key) || [];
    tokens.push(token);
    this.saveTokens(tokens);
  }

  deleteToken(token: Token) {
    let tokens = this.storageService.getSessionData(this.key) || [];
    tokens = tokens.filter((item) => {
      return item.address !== token.address;
    });
    this.saveTokens(tokens);
  }

  saveTokens(tokens: Token[]) {
    const stringToken = JSON.stringify(tokens);
    this.storageService.setCookie(this.key, stringToken, true, 7);
    this.storageService.setSessionData(this.key, tokens);
  }

  updateToken(token) {
    const tokens = this.storageService.getSessionData(this.key);
    const updatedTokens = tokens.filter((item) => {
      return item.symbol !== token.symbol;
    });
    updatedTokens.push(token);
    this.saveTokens(updatedTokens);
  }

  getLocalTokenInfo(address: string): Token {
    if (!address) {
      return null;
    }

    const tokens = this.getTokens();
    const token = tokens.find(item => item.address.toLowerCase() === address.toLowerCase());
    return token;
  }
}
