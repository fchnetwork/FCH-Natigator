import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import { environment } from '../../../../environments/environment';
import * as avatars from 'identity-img'
import { Cookie } from 'ng2-cookies/ng2-cookies';

const ethUtil = require('ethereumjs-util');
const hdkey = require("ethereumjs-wallet/hdkey")
const wall = require("ethereumjs-wallet")
const bip39 = require("bip39");
const Web3 = require('web3');

declare var window: any;

@Injectable()
export class AuthenticationService {

    public web3: any;

    constructor(private _http: Http) {
        this.initWeb3();
        avatars.config({ size: 67 * 3, bgColor: '#fff' });
    }
    
    
    
    initWeb3 = () => {
        if (typeof window.web3 !== 'undefined') {
          console.warn('Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask');
          this.web3 = new Web3(window.web3.currentProvider);
        } else {
          console.warn('No web3 detected. Falling back to ${environment.HttpProvider}. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask');
          this.web3 = new Web3( new Web3.providers.HttpProvider(environment.HttpProvider)); 
        }
    };
      

    avatarsGenerator() {
        const seeds = []
        for( let i =0; i <=4; i++ ) {
            const newSeed            = bip39.generateMnemonic()
            const mnemonicToSeed     = bip39.mnemonicToSeed( newSeed )
            const hdwallet           = hdkey.fromMasterSeed( mnemonicToSeed );
            const privExtend         = hdwallet.privateExtendedKey();
            const pubExtend          = hdwallet.publicExtendedKey();      
            const wallet             = hdwallet.derivePath( "m/44'/60'/0'/0/0" ).getWallet(); // use the ethereumjs lib now
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
                extendedPrivateKey: privExtend,
                extendedPublicKey:pubExtend,
            })
        }
        return seeds;
    }


    authState() : Observable<any> {
        return Observable.fromPromise( this.showKeystore() );
    }


    // creates an auth cookie
    saveKeyStore(privateKey, Password){
        const encryptAccount = this.web3.eth.accounts.encrypt( privateKey, Password);
        Cookie.set('aerum_keyStore', JSON.stringify(encryptAccount) );
        return encryptAccount
    }         


    showKeystore() : Promise<any> {
        return new Promise( (resolve, reject) => {
            const Auth = Cookie.get('aerum_keyStore')
            if(Auth) {
                resolve( JSON.parse( Auth ) )
            } else {
                reject("no keystore found");
            }
        });
    }



    // retrieve Private key using keystore auth cookie
    // will need to allow uploading this json also
    unencryptKeystore( password ) : Promise<any> {
        return new Promise( (resolve, reject) => {
            const encryptAccount = this.web3.eth.accounts.decrypt( JSON.parse( Cookie.get('aerum_keyStore') ), password);
            if(encryptAccount) {
                resolve( encryptAccount  )
            } else {
                reject("no keystore found or password incorrect");
            }
        });
    }



    /**
     * 
     * @param seed user types their seed in on the login page and it is used here
     * @returns an ethereum address and a blocky image associated with that address
     */
    generateAddressLogin( seed: any ) : Promise<any> {
        return new Promise( (resolve, reject) => {
            const mnemonicToSeed     = bip39.mnemonicToSeed( seed )
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
