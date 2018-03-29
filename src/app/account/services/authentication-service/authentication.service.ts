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

//   headers:       Headers = new Headers;

//   aerum$: Observable<any[]>;  // not in use yet
//   private _aerumMainObservable: Observer<any[]>;  // not in use yet
//   private _dataStoreAerum: { aerum: any[]  };  // not in use yet
    public web3: any;

    constructor(private _http: Http) {
        this.initWeb3();
        // this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        // this.headers.append('X-Requested-With', 'XMLHttpRequest');
        // this.aerum$ = new Observable<any[]>( observer => this._aerumMainObservable = observer).share();  // not in use yet
        // this._dataStoreAerum = {  aerum: []  }; // not in use yet
    }
    
    
    

    initWeb3 = () => {
        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof window.web3 !== 'undefined') {
          console.warn(
            'Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask'
          );
          // Use Mist/MetaMask's provider
          this.web3 = new Web3(window.web3.currentProvider);
        } else {
          console.warn(
            'No web3 detected. Falling back to ${environment.HttpProvider}. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
          );
          // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
          this.web3 = new Web3(
            new Web3.providers.HttpProvider(environment.HttpProvider)
          ); 
        }
      };
      
      
      
      
      


avatarsGenerator() {
    const seeds = []
    avatars.config({ rows: 8, cells: 8 });

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
            avatar: avatars.create( address, { size: 67 * 3, bgColor: "#ffffff" }),
            address: address,
            private: getPriv,
            public: getPublic,            
            extendedPrivateKey: privExtend,
            extendedPublicKey:pubExtend,
        })
    }

    return seeds;
}



// creates an auth cookie
saveKeyStore(privateKey, Password){
    const encryptAccount = this.web3.eth.accounts.encrypt( privateKey, Password);
    Cookie.set('aerum_keyStore', JSON.stringify(encryptAccount) );
    // console.log(JSON.stringify( encryptAccount ))
    return encryptAccount
}         





public showKeystore() : Promise<any> {
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
public unencryptKeystore( password ) : Promise<any> {
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
public generateAddressLogin( seed: any ) : Promise<any> {

    return new Promise( (resolve, reject) => {

        avatars.config({ rows: 8, cells: 8 });
   
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
        const avatar = avatars.create( address, { size: 67 * 3, bgColor: "#ffffff" }) 

        if(address) {
            resolve({ address: address, avatar: avatar, private:getPriv })
        } else {
            reject({ error: "issue with address generation" });
        }
    });
}











    // public generateMnumonic() : any {
    //    return bip39.generateMnemonic().split(" ").map(String);
    // }
    
    
    
    

    // public generateAddress( payload: any ) : Promise<any> {

    //     return new Promise( (resolve, reject) => {
    //         const mnemonicToSeed     = bip39.mnemonicToSeed( payload.mnemonic )
    //         const hdwallet           = hdkey.fromMasterSeed( mnemonicToSeed );
    //         const privExtend         = hdwallet.privateExtendedKey();
    //         const pubExtend          = hdwallet.publicExtendedKey();      
    //         const wallet             = hdwallet.derivePath( "m/44'/60'/0'/0/0" ).getWallet();
    //         const getAddress         = wallet.getAddress().toString("hex")
    //         const getChecksumAddress = ethUtil.toChecksumAddress( getAddress )
    //         const address            = ethUtil.addHexPrefix( getChecksumAddress )

    //         if(address) {

    //          //   avatars.config({ rows: 8, cells: 8 });

    //             //   console.log(  avatars.create( address, { size: 67 * 3 }) )
    //             //   console.log(  avatars.create( address, { size: 67 * 3 }) )
    //             //   console.log(  avatars.create( address, { size: 67 * 3 }) )

    //             const data = {
    //                 aerAddress:address,
    //                 extendedPrivateKey: privExtend,
    //                 extendedPublicKey:pubExtend,
    //                 mnemonicSeedPhrase: payload.mnemonic
    //             }
    //             resolve(data)
    //         } else {
    //             reject({ error: "issue with address generation" });
    //         }
    //     });
    // }

    
    
    
    
    

    // public generateAccount( payload: any) : Promise<any> {
    //     return new Promise( (resolve, reject) => {
    //         const mnemonicToSeed     = bip39.mnemonicToSeed( payload.mnemonic )
    //         const hdwallet           = hdkey.fromMasterSeed( mnemonicToSeed );
    //         const privExtend         = hdwallet.privateExtendedKey();
    //         const pubExtend          = hdwallet.publicExtendedKey();      
    //         const wallet             = hdwallet.derivePath( "m/44'/60'/0'/0/0" ).getWallet();
    //         const getAddress         = wallet.getAddress().toString("hex")
    //         const getChecksumAddress = ethUtil.toChecksumAddress( getAddress )
    //         const address            = ethUtil.addHexPrefix( getChecksumAddress )

    //         if(address) {
    //             const data = {
    //                 avatar:payload.avatar,
    //                 aerAddress:address,
    //                 extendedPrivateKey: privExtend,
    //                 extendedPublicKey:pubExtend,
    //                 mnemonicSeedPhrase: payload.mnemonic 
    //             }
    //             resolve(data)
    //         } else {
    //             reject({ error: "issue with address generation" });
    //         }
    //     });

    // }







    /**
     * @description this is not being used yet 
     * @param restEndPoint url to retrieve data from
     */
//   public importantAerumLiveData( restEndPoint:string ) {
//       this._http.get( restEndPoint ).map(response => response.json()).subscribe( data => {
//               this._dataStoreAerum.aerum = data.aerum;
//               this._aerumMainObservable.next(this._dataStoreAerum.aerum);
//           }, error => console.log('Could not load.'),
//           () => 'done');
//   }    
  
  
  
  
//   /**
//    * @description fetch a new address from the backend system
//    * @param restEndPoint url to retrieve data from
//    * @param body Json request consisting of seed phrase, password and avatar id
//    */
//   public generateAerumAddress( restEndPoint: string, body:any ) : Promise<any> {
//     return new Promise((resolve, reject) => {
//         this._http.post(restEndPoint, body ).map((res: Response) => res.json()).subscribe( (res) => {
//                 resolve(res);
//             }, (error) => {
//                 reject(error);
//             });
//     });
// }  
  
  

}
