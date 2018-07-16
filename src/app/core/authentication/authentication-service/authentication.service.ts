import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import * as avatars from 'identity-img';
import * as CryptoJS from 'crypto-js';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import QRCode from 'qrcode';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { privateToAddress, bufferToHex } from "ethereumjs-util";
import { SettingsService } from '@app/core/settings/settings.service';

import { StorageService } from "@core/general/storage-service/storage.service";

const ethUtil = require('ethereumjs-util');
const hdkey   = require("ethereumjs-wallet/hdkey");
const bip39   = require("bip39");

import Web3 from 'web3';
import { environment } from '@env/environment';

@Injectable()
export class AuthenticationService {

    private readonly web3: Web3;
    private readonly wsWeb3: Web3;
    private activeDerivation: string;

    constructor(private sessionStorage: SessionStorageService,
                public router: Router,
                public settingsService: SettingsService,
                private storageService: StorageService
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
    saveKeyStore( privateKey: string, password: string, seed: any ){
        const formatSeed     = this.seedCleaner( seed.toString() );
        const encryptSeed    = CryptoJS.AES.encrypt( formatSeed, password );
        const encryptAccount = this.web3.eth.accounts.encrypt( privateKey, password);
        Cookie.set('aerum_keyStore', JSON.stringify( encryptAccount), 7, "/", environment.cookiesDomain);
        Cookie.set('aerum_base', encryptSeed, 7, "/", environment.cookiesDomain);
        return encryptAccount;
    }

    showKeystore() : Promise<any> {
        return new Promise( (resolve, reject) => {
            const Auth = Cookie.get('aerum_keyStore');
            if(Auth) {
                resolve( JSON.parse( Auth ) );
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
        const keystore = Cookie.get('aerum_keyStore');
        if(!keystore) {
            throw new Error("No keystore found");
        }
        return JSON.parse( keystore );
    }

    // retrieve Private key using keystore auth cookie
    // will need to allow uploading this json also
    unencryptKeystore( password: string ) : Promise<any> {

        return new Promise( (resolve, reject) => {
            if(password) {
                const decryptSeed = CryptoJS.AES.decrypt( Cookie.get('aerum_base'), password );

                const transactions = this.decryptCookieToArray('transactions', password);
                const tokens = this.decryptCookieToArray('tokens', password);
                const ethereumTokens = this.decryptCookieToArray('ethereum-tokens', password);
                const ethereumAccounts = this.decryptCookieToArray('ethereum_accounts', password);
                const crossChainSwaps = this.decryptCookieToArray('cross_chain_swaps', password);

                const encryptAccount = this.web3.eth.accounts.decrypt( JSON.parse( Cookie.get('aerum_keyStore') ), password);
                if( encryptAccount ) {
                    const plaintext = decryptSeed.toString(CryptoJS.enc.Utf8);
                    const seed = this.seedCleaner(plaintext);
                    resolve( { web3: encryptAccount, s:seed, transactions, tokens, ethereumTokens, ethereumAccounts, crossChainSwaps } );
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
      const cookie = Cookie.get(cookieName);
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
                this.sessionStorage.store('acc_address', result.web3.address);
                this.sessionStorage.store('acc_avatar',  this.generateCryptedAvatar( result.web3.address ) );
                this.sessionStorage.store('seed', result.s);
                this.sessionStorage.store('private_key', result.web3.privateKey);
                this.sessionStorage.store('password', password);
                this.sessionStorage.store('transactions', result.transactions.length ? JSON.parse(result.transactions) : []);
                this.sessionStorage.store('tokens', result.tokens.length ? JSON.parse(result.tokens) : []);
                this.sessionStorage.store('ethereum-tokens', result.ethereumTokens.length ? JSON.parse(result.ethereumTokens) : []);
                this.sessionStorage.store('ethereum_accounts', result.ethereumAccounts.length ? JSON.parse(result.ethereumAccounts) : []);
                this.sessionStorage.store('cross_chain_swaps', result.crossChainSwaps.length ? JSON.parse(result.crossChainSwaps) : []);
                resolve('success');
            }).catch((err)=>{
                reject(err);
            });
        });
    }

    logout() {
        this.router.navigate(['account/unlock']);
        this.sessionStorage.clear('acc_address');
        this.sessionStorage.clear('acc_avatar');
        this.sessionStorage.clear('seed');
        this.sessionStorage.clear('private_key');
        this.sessionStorage.clear('password');
        this.sessionStorage.clear('transactions');
        this.sessionStorage.clear('tokens');
        this.sessionStorage.clear('ethereum_accounts');
        this.sessionStorage.clear('cross_chain_swaps');
        this.sessionStorage.clear('derivation');
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
        const authCookie = Cookie.get('aerum_base');
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
                resolve( QRCode.toDataURL( formatAddress  ) );
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
