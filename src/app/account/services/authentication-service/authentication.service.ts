import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import * as avatars from 'identity-img'

// Cryptography and address generation
const ethUtil = require('ethereumjs-util');
// const crypto = require('crypto-browserify');
const hdkey = require("ethereumjs-wallet/hdkey")
const bip39 = require("bip39");



/**
 * To Do
 * Avatars: Waves creates 5 different seeds on application load, this generates 5 different avatar images
 * when the person selects an avatar that is the seed which will be used to generate their address
 * 
 */



@Injectable()
export class AuthenticationService {

  headers:       Headers = new Headers;

  aerum$: Observable<any[]>;  // not in use yet
  private _aerumMainObservable: Observer<any[]>;  // not in use yet
  private _dataStoreAerum: { aerum: any[]  };  // not in use yet
    
    constructor(private _http: Http) {
        this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this.headers.append('X-Requested-With', 'XMLHttpRequest');
        this.aerum$ = new Observable<any[]>( observer => this._aerumMainObservable = observer).share();  // not in use yet
        this._dataStoreAerum = {  aerum: []  }; // not in use yet
    }
    




avatarsGenerator() {

    const seeds = []

    avatars.config({ rows: 8, cells: 8 });

    for( let i =0; i <=4; i++ ) {
        const newSeed = bip39.generateMnemonic()
        const mnemonicToSeed     = bip39.mnemonicToSeed( newSeed )
        const hdwallet           = hdkey.fromMasterSeed( mnemonicToSeed );
        const privExtend         = hdwallet.privateExtendedKey();
        const pubExtend          = hdwallet.publicExtendedKey();      
        const wallet             = hdwallet.derivePath( "m/44'/60'/0'/0/0" ).getWallet();
        const getAddress         = wallet.getAddress().toString("hex")
        const getChecksumAddress = ethUtil.toChecksumAddress( getAddress )
        const address            = ethUtil.addHexPrefix( getChecksumAddress )

        seeds.push({
            id: i,
            seed: newSeed,
            avatar: avatars.create( address, { size: 67 * 3, bgColor: "#ffffff" }),
            address: address,
            extendedPrivateKey: privExtend,
            extendedPublicKey:pubExtend,
        })
    }

    return seeds;
}





    public generateMnumonic() : any {
       return bip39.generateMnemonic().split(" ").map(String);
    }

    public generateAddress( payload: any ) : Promise<any> {

        return new Promise( (resolve, reject) => {
            const mnemonicToSeed     = bip39.mnemonicToSeed( payload.mnemonic )
            const hdwallet           = hdkey.fromMasterSeed( mnemonicToSeed );
            const privExtend         = hdwallet.privateExtendedKey();
            const pubExtend          = hdwallet.publicExtendedKey();      
            const wallet             = hdwallet.derivePath( "m/44'/60'/0'/0/0" ).getWallet();
            const getAddress         = wallet.getAddress().toString("hex")
            const getChecksumAddress = ethUtil.toChecksumAddress( getAddress )
            const address            = ethUtil.addHexPrefix( getChecksumAddress )

            if(address) {

             //   avatars.config({ rows: 8, cells: 8 });

                //   console.log(  avatars.create( address, { size: 67 * 3 }) )
                //   console.log(  avatars.create( address, { size: 67 * 3 }) )
                //   console.log(  avatars.create( address, { size: 67 * 3 }) )

                const data = {
                    aerAddress:address,
                    extendedPrivateKey: privExtend,
                    extendedPublicKey:pubExtend,
                    mnemonicSeedPhrase: payload.mnemonic
                }
                resolve(data)
            } else {
                reject({ error: "issue with address generation" });
            }
        });
    }


    public generateAccount( payload: any) : Promise<any> {
        return new Promise( (resolve, reject) => {
            const mnemonicToSeed     = bip39.mnemonicToSeed( payload.mnemonic )
            const hdwallet           = hdkey.fromMasterSeed( mnemonicToSeed );
            const privExtend         = hdwallet.privateExtendedKey();
            const pubExtend          = hdwallet.publicExtendedKey();      
            const wallet             = hdwallet.derivePath( "m/44'/60'/0'/0/0" ).getWallet();
            const getAddress         = wallet.getAddress().toString("hex")
            const getChecksumAddress = ethUtil.toChecksumAddress( getAddress )
            const address            = ethUtil.addHexPrefix( getChecksumAddress )

            if(address) {
                const data = {
                    avatar:payload.avatar,
                    aerAddress:address,
                    extendedPrivateKey: privExtend,
                    extendedPublicKey:pubExtend,
                    mnemonicSeedPhrase: payload.mnemonic 
                }
                resolve(data)
            } else {
                reject({ error: "issue with address generation" });
            }
        });

    }





    public getAccounts() {

    }




    /**
     * @description this is not being used yet 
     * @param restEndPoint url to retrieve data from
     */
  public importantAerumLiveData( restEndPoint:string ) {
      this._http.get( restEndPoint ).map(response => response.json()).subscribe( data => {
              this._dataStoreAerum.aerum = data.aerum;
              this._aerumMainObservable.next(this._dataStoreAerum.aerum);
          }, error => console.log('Could not load.'),
          () => 'done');
  }    
  
  
  
  
  /**
   * @description fetch a new address from the backend system
   * @param restEndPoint url to retrieve data from
   * @param body Json request consisting of seed phrase, password and avatar id
   */
  public generateAerumAddress( restEndPoint: string, body:any ) : Promise<any> {
    return new Promise((resolve, reject) => {
        this._http.post(restEndPoint, body ).map((res: Response) => res.json()).subscribe( (res) => {
                resolve(res);
            }, (error) => {
                reject(error);
            });
    });
}  
  
  

}
