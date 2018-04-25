import * as CryptoJS from 'crypto-js';
import { environment } from '@app/../environments/environment';
import { Injectable } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SessionStorageService } from 'ngx-webstorage';
import Web3 from 'web3';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { tokensABI } from '@app/abi/tokens';

@Injectable()
export class TokenService {
  web3: any;
  tokensContract: any;

  constructor(
    private _auth: AuthenticationService,
    private sessionStorage: SessionStorageService,
  ) { 
    this.web3 = this.initWeb3();
  }

  initWeb3 = () => {
    return new Web3( new Web3.providers.HttpProvider(environment.HttpProvider)); 
  };

  
  
  addToken(tokenData) {
    const date = new Date();
    const token = tokenData;
    const tokens = this.sessionStorage.retrieve('tokens') || [];
    tokens.push(token);
    console.log(tokens);
    this.saveTokens(tokens);
  }

  saveTokens(tokens) {
    // DONT DELETE
    console.log(tokens);
    console.log('save tokens');

    const password = this.sessionStorage.retrieve('password');
    const stringtoken = JSON.stringify(tokens);
    const encryptedtokens = CryptoJS.AES.encrypt( stringtoken, password );
    Cookie.set('tokens', encryptedtokens, 7, "/", environment.cookiesDomain);
    this.sessionStorage.store('tokens', tokens);
  }

  getTokens() {
   return this.sessionStorage.retrieve('tokens');
  }

  updateTokensBalance() {
    const tokens = this.sessionStorage.retrieve('tokens');
    console.log(tokens);
    const address = this.sessionStorage.retrieve('acc_address');
    const updatedTokens = [];
    return new Promise((resolve, reject)=> {
      for (let i = 0; i < tokens.length; i++) {
        console.log(i);
        // console.log(tokens.length);
        console.log(Number(tokens.length -1));
        this.tokensContract = new this.web3.eth.Contract(tokensABI, tokens[i].address);
        // this.tokensContract.methods.balanceOf(address).call({}, (error, result)=>{
        //   tokens[i].balance = result;
        //   updatedTokens.push(tokens[i]);
        //   if(i === Number(tokens.length - 1)) {
        //     console.log(updatedTokens);
        //     this.saveTokens(updatedTokens);
        //     resolve(updatedTokens);
        //   }
        // });
        this.tokensContract.methods.balanceOf(address).call({}).then((res)=>{
          console.log(res);
          tokens[i].balance = res;
          updatedTokens.push(tokens[i]);
          if(i === Number(tokens.length - 1)) {
            console.log(updatedTokens);
            this.saveTokens(updatedTokens);
            resolve(updatedTokens);
          }
        }).catch((err)=>{
          tokens[i].balance = 0;
          updatedTokens.push(tokens[i]);
          if(i === Number(tokens.length - 1)) {
            console.log(updatedTokens);
            this.saveTokens(updatedTokens);
            resolve(updatedTokens);
          }
        });
      }
    });
  }

  getTokensInfo(contractAddress) {
    return new Promise((resolve, reject) => {
      const address = this.web3.utils.isAddress([contractAddress]);
      if(address) {
        this.tokensContract = new this.web3.eth.Contract(tokensABI, contractAddress);
        this.tokensContract.methods.symbol().call({}, (error, result)=>{
          const contract = {
            symbol: '',
            decimals: 0,
            totalSupply: 0,
          };
          contract.symbol = result;
          this.tokensContract.methods.decimals().call({}, (error, result)=>{
            contract.decimals = result;
            this.tokensContract.methods.totalSupply().call({}, (error, result)=>{
              contract.totalSupply = result;
              resolve(contract);
            });
            
          });
        });
      } else {
        reject('not valid address');
      }
    });
  }

}
