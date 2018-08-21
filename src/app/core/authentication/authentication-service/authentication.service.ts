import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import * as avatars from 'identity-img';
import * as CryptoJS from 'crypto-js';
import QRCode from 'qrcode';
import { Router } from '@angular/router';
import { privateToAddress, bufferToHex } from "ethereumjs-util";
import { SettingsService } from '@app/core/settings/settings.service';
import { StorageService } from "@core/general/storage-service/storage.service";
import { FingerPrintService } from "@app/mobile/finger-print/finger-print.service";

const ethUtil = require('ethereumjs-util');
const hdkey   = require("ethereumjs-wallet/hdkey");
const bip39   = require("bip39");

import Web3 from 'web3';

declare const window: any;

@Injectable()
export class AuthenticationService {

    private readonly web3: Web3;
    private readonly wsWeb3: Web3;
    private activeDerivation: string;

    constructor(public router: Router,
                public settingsService: SettingsService,
                private storageService: StorageService,
                private fingerPrintService: FingerPrintService
    ) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(this.settingsService.settings.systemSettings.aerumNodeRpcURI));
        this.wsWeb3 = new Web3(new Web3.providers.WebsocketProvider(this.settingsService.settings.systemSettings.aerumNodeWsURI));

        this.activeDerivation = this.settingsService.settings.generalSettings.derivationPath;

        avatars.config({ size: 67 * 3, bgColor: '#fff' });
    }

    getWeb3() {
      return this.web3;
    }

    getWSWeb3() {
      return this.wsWeb3;
    }

    avatarsGenerator() {
      const seeds = [];
      for( let i = 0; i <=4; i++ ) {
        const newSeed = bip39.generateMnemonic();
        const mnemonicToSeed = bip39.mnemonicToSeed( newSeed );
        const hdwallet = hdkey.fromMasterSeed( mnemonicToSeed );
        const wallet = hdwallet.derivePath( this.activeDerivation ).getWallet();
        const getAddress = wallet.getAddress().toString("hex");
        const getPriv = wallet.getPrivateKeyString().toString("hex");
        const getPublic = wallet.getPublicKeyString().toString("hex");
        const getChecksumAddress = ethUtil.toChecksumAddress( getAddress );
        const address = ethUtil.addHexPrefix( getChecksumAddress );

        seeds.push({
            id: i,
            seed: newSeed,
            avatar: this.generateCryptedAvatar(address),
            address,
            private: getPriv,
            public: getPublic,
        });
      }
      return seeds;
    }

    generateCryptedAvatar( address: string ) {
        const avatar = avatars.create( address.toString() );
        return avatar;
    }

     // creates an auth cookie
    async saveKeyStore(privateKey: string, password: string, seed: any){
      await this.fingerPrintService.savePassword(password);
      const formatSeed = this.seedCleaner(seed.toString());
      const encryptAccount = this.web3.eth.accounts.encrypt(privateKey, password);
      this.storageService.setCookie('aerum_keyStore', JSON.stringify(encryptAccount), false, 7);
      this.storageService.setCookie('aerum_base', formatSeed, true, 7);
      return encryptAccount;
    }

    showKeystore() : Promise<any> {
      return new Promise((resolve, reject) => {
        const auth = this.storageService.getCookie('aerum_keyStore');
        if(auth) {
          resolve(JSON.parse(auth));
        }
        else{
          reject("no keystore found");
        }
      });
    }

    getAddress(): string {
      return this.storageService.getSessionData('acc_address');
    }

    getKeystore() {
      const keystore = this.storageService.getCookie('aerum_keyStore');
      if(!keystore) {
        throw new Error("No keystore found");
      }
      return JSON.parse(keystore);
    }

    // retrieve Private key using keystore auth cookie
    // will need to allow uploading this json also
    unencryptKeystore(password: string) : Promise<any> {
      return new Promise( (resolve, reject) => {
        if(password) {
          const decryptSeed = CryptoJS.AES.decrypt(this.storageService.getCookie('aerum_base'), password );
          const transactions = this.decryptCookieToArray('transactions', password);
          const tokens = this.decryptCookieToArray('tokens', password);
          const ethereumTokens = this.decryptCookieToArray('ethereum_tokens', password);
          const ethereumAccounts = this.decryptCookieToArray('ethereum_accounts', password);
          const crossChainSwaps = this.decryptCookieToArray('cross_chain_swaps', password);
          const stakings = this.decryptCookieToArray('stakings', password);

          const encryptAccount = this.web3.eth.accounts.decrypt(JSON.parse(this.storageService.getCookie('aerum_keyStore')), password);
          if( encryptAccount ) {
            const plaintext = decryptSeed.toString(CryptoJS.enc.Utf8);
            const seed = this.seedCleaner(plaintext);
            resolve( { web3: encryptAccount, s:seed, transactions, tokens, ethereumTokens, ethereumAccounts, crossChainSwaps, stakings: stakings } );
          }
          else {
            reject("no keystore found or password incorrect");
          }
        } else {
          reject("no keystore found or password incorrect");
        }
      });
    }

    private decryptCookieToArray(cookieName: string, password: string) {
      const cookie = this.storageService.getCookie(cookieName);
      if(!cookie) {
        return [];
      }
      const decryptArray = CryptoJS.AES.decrypt(cookie, password);
      const array = decryptArray.toString(CryptoJS.enc.Utf8);
      return array;
    }

    login(password) {
      return new Promise((resolve, reject) =>{
        this.unencryptKeystore(password).then( result => {
          this.storageService.setSessionData('acc_address', result.web3.address);
          this.storageService.setSessionData('acc_avatar',  this.generateCryptedAvatar( result.web3.address ) );
          this.storageService.setSessionData('seed', result.s);
          this.storageService.setSessionData('private_key', result.web3.privateKey);
          this.storageService.setSessionData('password', password);
          this.storageService.setSessionData('transactions', result.transactions.length ? JSON.parse(result.transactions) : []);
          this.storageService.setSessionData('tokens', result.tokens.length ? JSON.parse(result.tokens) : []);
          this.storageService.setSessionData('ethereum_tokens', result.ethereumTokens.length ? JSON.parse(result.ethereumTokens) : []);
          this.storageService.setSessionData('ethereum_accounts', result.ethereumAccounts.length ? JSON.parse(result.ethereumAccounts) : []);
          this.storageService.setSessionData('cross_chain_swaps', result.crossChainSwaps.length ? JSON.parse(result.crossChainSwaps) : []);
          this.storageService.setSessionData('stakings', result.stakings.length ? JSON.parse(result.stakings) : []);
          resolve('success');
        }).catch((err)=>{
            reject(err);
        });
      });
    }

    logout() {
      this.storageService.clearSessionData('acc_address');
      this.storageService.clearSessionData('acc_avatar');
      this.storageService.clearSessionData('seed');
      this.storageService.clearSessionData('private_key');
      this.storageService.clearSessionData('password');
      this.storageService.clearSessionData('transactions');
      this.storageService.clearSessionData('tokens');
      this.storageService.clearSessionData('ethereum_accounts');
      this.storageService.clearSessionData('cross_chain_swaps');
      this.storageService.clearSessionData('stakings');
      this.storageService.clearSessionData('derivation');
      this.storageService.clearSessionData('ethereum_tokens');
      //Doing page full reload to make sure all components and services will be correctly initialized for next user.
      window.location.href = 'account/unlock';
    }

    /**
     * @description trip start/end whitespace, special chars and any double spaces which can affect address generation
     * @param seed string containing bip32 specification seed phrase
     */
    seedCleaner(seed: any) {
      let cleanSeed = seed.trim();
      cleanSeed = cleanSeed.replace(/[^\w\s]/gi, ' ');
      cleanSeed.replace(/\s\s+/g, ' ');
      return cleanSeed;
    }

    // now being used in sidebar select component
    generateAdditionalAccounts( password: string, amount: number ){
        const authCookie = this.storageService.getCookie('aerum_base');
        if( authCookie ){
            const accounts        = [];
            const cookieStringify = authCookie.toString();
            const bytes           = CryptoJS.AES.decrypt( cookieStringify, password );
            const plaintext       = bytes.toString(CryptoJS.enc.Utf8);
            const seed            = this.seedCleaner(plaintext);
            const mnemonicToSeed  = bip39.mnemonicToSeed( seed );
            const hdwallet        = hdkey.fromMasterSeed( mnemonicToSeed );
            const privExtend      = hdwallet.privateExtendedKey();
            const pubExtend       = hdwallet.publicExtendedKey();
            const currentDerivation = this.activeDerivation.slice(0, -1)
             for( let i = 0; i <= amount; i++) {
                const derivationPath  = hdwallet.derivePath( currentDerivation + i );
                const initWallet      = derivationPath.getWallet();
                const address         = initWallet.getAddress().toString("hex");
                const checkSumAddress = ethUtil.toChecksumAddress( address );
                const finalAddress    = ethUtil.addHexPrefix( checkSumAddress );
                accounts.push( finalAddress );
             }
             return accounts;
        }
    }


    isHexAddress(str) {
        if (typeof str !== 'string') {
          throw new Error("Not a valid string");
        }
       return str.slice(0, 2) === '0x';
    }


    createQRcode(address:string) : Promise<any> {
        const formatAddress = this.isHexAddress(address) ? address : '0x' + address;
        return new Promise( (resolve) => {
            if( formatAddress ){
                resolve( QRCode.toDataURL( formatAddress, {margin: 0, color: {
                    dark: '#636363',  // Blue dots
                    light: '#0000' // Transparent background
                  }} ) );
            }
        });
    }

    /**
     *
     * @param seed user types their seed in on the login page and it is used here
     * @returns an ethereum address and avatar image associated with that address
     */
    generateAddressLogin( seed: any ) : Promise<any> {
        return new Promise( (resolve, reject) => {
            const mnemonicToSeed     = bip39.mnemonicToSeed( this.seedCleaner( seed ) );
            const hdwallet           = hdkey.fromMasterSeed( mnemonicToSeed );
            const privExtend         = hdwallet.privateExtendedKey();
            const pubExtend          = hdwallet.publicExtendedKey();
            const wallet             = hdwallet.derivePath( this.activeDerivation ).getWallet(); // use the ethereumjs lib now
            const getAddress         = wallet.getAddress().toString("hex");
            const getPriv            = wallet.getPrivateKeyString().toString("hex");
            const getPublic          = wallet.getPublicKeyString().toString("hex");
            const getChecksumAddress = ethUtil.toChecksumAddress( getAddress );
            const address            = ethUtil.addHexPrefix( getChecksumAddress );
            const avatar = avatars.create( address );
            if(address) {
                resolve({ address, avatar, private:getPriv });
            } else {
                reject({ error: "issue with address generation" });
            }
        });
    }

  generateAddressFromPrivateKey(privateKey: string): string {
      if (!privateKey) {
        throw new Error("Private key empty");
      }

      if (!privateKey.startsWith("0x")) {
        privateKey = "0x" + privateKey;
      }

      const address = bufferToHex(privateToAddress(privateKey));
      return address;
  }
}
