import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { environment } from '../../../../environments/environment';
import * as avatars from 'identity-img'
import * as CryptoJS from 'crypto-js';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import QRCode from 'qrcode'

const ethUtil = require('ethereumjs-util');
const hdkey   = require("ethereumjs-wallet/hdkey")
const wall    = require("ethereumjs-wallet")
const bip39   = require("bip39");
const Web3    = require('web3');

declare var window: any;

@Injectable()
export class AuthenticationService {

    public web3: any;

    constructor( private _http: Http ) {

        this.web3 = this.initWeb3();

        avatars.config({ size: 67 * 3, bgColor: '#fff' });

    }
    
    
    initWeb3 = () => {
        return new Web3( new Web3.providers.HttpProvider(environment.HttpProvider)); 
    };
      

    avatarsGenerator() {
        const seeds = []
        for( let i =0; i <=4; i++ ) {
            const newSeed            = bip39.generateMnemonic()
            const mnemonicToSeed     = bip39.mnemonicToSeed( newSeed )
            const hdwallet           = hdkey.fromMasterSeed( mnemonicToSeed ); 
            const wallet             = hdwallet.derivePath( "m/44'/60'/0'/0/0" ).getWallet();
            const getAddress         = wallet.getAddress().toString("hex")
            const getPriv            = wallet.getPrivateKeyString().toString("hex")
            const getPublic          = wallet.getPublicKeyString().toString("hex")        
            const getChecksumAddress = ethUtil.toChecksumAddress( getAddress )
            const address            = ethUtil.addHexPrefix( getChecksumAddress )
            seeds.push({
                id: i,
                seed: newSeed,
                avatar: avatars.create( address ),
                address: address,
                private: getPriv,
                public: getPublic,            
            })
        }
        return seeds;
    }



    authState() : Observable<any> {
        return Observable.fromPromise( this.showKeystore() );
    }

 

    // creates an auth cookie
    saveKeyStore( privateKey: string, password: string, seed: any ){
    
        const formatSeed     = this.seedCleaner( seed.toString() )
        const encryptSeed    = CryptoJS.AES.encrypt( formatSeed, password );
        const encryptAccount = this.web3.eth.accounts.encrypt( privateKey, password);

        Cookie.set('aerum_keyStore', JSON.stringify( encryptAccount) );
        Cookie.set('aerum_base', encryptSeed );

        return encryptAccount 
        
    }         


    showKeystore() : Promise<any> {
        return new Promise( (resolve, reject) => {
            const Auth = Cookie.get('aerum_keyStore')
            if(Auth) {
                resolve( JSON.parse( Auth ) )
            } 
            else{
                reject("no keystore found");
            }
        });
    }



    // retrieve Private key using keystore auth cookie
    // will need to allow uploading this json also
    unencryptKeystore( password: string ) : Promise<any> {

        return new Promise( (resolve, reject) => {

            const decryptSeed = CryptoJS.AES.decrypt( Cookie.get('aerum_base'), password );

            const encryptAccount = this.web3.eth.accounts.decrypt( JSON.parse( Cookie.get('aerum_keyStore') ), password);

            if( encryptAccount ) {
                resolve( { web3: encryptAccount, s:decryptSeed  } )
            } 
            else {
                reject("no keystore found or password incorrect");
            }

        });

    }



    /**
     * @description trip start/end whitespace, special chars and any double spaces which can affect address generation
     * @param seed string containing bip32 specification seed phrase
     */
    seedCleaner(seed: any) {

        let cleanSeed = seed.trim()
            cleanSeed = cleanSeed.replace(/[^\w\s]/gi, ' ') 
            cleanSeed.replace(/\s\s+/g, ' ')

        return cleanSeed;

    }



    generateAdditionalAccounts( password: string, amount: number ){

        const authCookie = Cookie.get('aerum_base')

        if( authCookie ){
            const accounts        = []
            const cookieStringify = authCookie.toString()
            const bytes           = CryptoJS.AES.decrypt( cookieStringify, password );
            const plaintext       = bytes.toString(CryptoJS.enc.Utf8);
            const seed            = this.seedCleaner(plaintext)
            const mnemonicToSeed  = bip39.mnemonicToSeed( seed )
            const hdwallet        = hdkey.fromMasterSeed( mnemonicToSeed ); 
            const privExtend      = hdwallet.privateExtendedKey();
            const pubExtend       = hdwallet.publicExtendedKey();      
             for( let i = 0; i <= amount; i++) {
                const derivationPath  = hdwallet.derivePath( "m/44'/60'/0'/0/" + i )
                const initWallet      = derivationPath.getWallet()
                const address         = initWallet.getAddress().toString("hex")
                const checkSumAddress = ethUtil.toChecksumAddress( address )
                const finalAddress    = ethUtil.addHexPrefix( checkSumAddress )
                accounts.push( finalAddress )
             }
             return accounts
        }
    }


    isHexAddress(str) {
        if (typeof str !== 'string') {
          throw new Error("Not a valid string");
        }
       return str.slice(0, 2) === '0x';
    }


    createQRcode(address:string) : Promise<any> {

        const formatAddress = this.isHexAddress(address) ? address : '0x' + address

        return new Promise( (resolve) => {

            if( formatAddress ){
                resolve( QRCode.toDataURL( formatAddress  ) )
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
            const mnemonicToSeed     = bip39.mnemonicToSeed( this.seedCleaner( seed ) )
            const hdwallet           = hdkey.fromMasterSeed( mnemonicToSeed );
            const privExtend         = hdwallet.privateExtendedKey();
            const pubExtend          = hdwallet.publicExtendedKey();      
            const wallet             = hdwallet.derivePath( "m/44'/60'/0'/0/0" ).getWallet(); // use the ethereumjs lib now
            const getAddress         = wallet.getAddress().toString("hex")
            const getPriv            = wallet.getPrivateKeyString().toString("hex")
            const getPublic          = wallet.getPublicKeyString().toString("hex")        
            const getChecksumAddress = ethUtil.toChecksumAddress( getAddress )
            const address            = ethUtil.addHexPrefix( getChecksumAddress )
            const avatar = avatars.create( address ) 
            if(address) {
                resolve({ address: address, avatar: avatar, private:getPriv })
            } else {
                reject({ error: "issue with address generation" });
            }
        });
    }


}
