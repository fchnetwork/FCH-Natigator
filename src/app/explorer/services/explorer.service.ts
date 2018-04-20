import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { environment } from '../../../environments/environment';
import {BehaviorSubject}    from 'rxjs/BehaviorSubject';
import {Subject}    from 'rxjs/Subject';
import { AuthenticationService } from '@account/services/authentication-service/authentication.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

const Tx = require('ethereumjs-tx');
const ethJsUtil = require('ethereumjs-util');
const Web3 = require('web3');


@Injectable()
export class ExplorerService {

  web3: any;
  
  data$: BehaviorSubject<any> = new BehaviorSubject({});
  private pongSource = new Subject<any>();
  pong$ = this.pongSource.asObservable();
  
  account: any;
   
  constructor( _auth: AuthenticationService ) {
    this.web3 = _auth.initWeb3();
    this.account  = JSON.parse( Cookie.get('account') );
  }


  fromWei(amountInWei, currency) {
    return this.web3.utils.fromWei( amountInWei.toString(), currency );
  }



  
  getBlock(): Observable<any>{





    return Observable.create(observer => {
      this.web3.eth.getBlockNumber((err, block) => {
        if (err != null) {
          observer.error('There was an error fetching your blocks.');
        }

        if (block.length === 0) {
          observer.error('no blocks');
        }
        // setInterval(() => {

        //   return observer.next(block);

        // }, 1000);
        return observer.next(block);
        // observer.complete()
      });
    });
  }
  
  getAccounts(): Observable<any>{
  	return Observable.create(observer => {
  	  this.web3.eth.getAccounts((err, accs) => {
  	    if (err != null) {
  	      observer.error('There was an error fetching your accounts.');
  	    }

  	    if (accs.length === 0) {
  	      observer.error('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
  	    }

  	    observer.next(accs);
  	    observer.complete();
  	  });
  	});
  }

  
  createAccounts(): any {
  // console.log ( JSON.parse( Cookie.get('account') ) ); 
  // console.log ( JSON.parse( Cookie.get('encrypted') ) );   

  // const accounts = JSON.parse( Cookie.get('account') )
  
  const privateKey =  ethJsUtil.toBuffer(this.account.privateKey);
  const to = ethJsUtil.toChecksumAddress( "0xb0573f6b040fddf1250cdd38983f4eac06fbf3ca" ) ;
  const from = ethJsUtil.toChecksumAddress( this.account.address);
  const txValue = this.web3.utils.numberToHex(this.web3.utils.toWei('0.01', 'ether'));
  const txData = this.web3.utils.asciiToHex('oh hai mark'); 
  
  this.web3.eth.getTransactionCount( from ).then( res => {

        
    const rawTx = {
      nonce: '0x'+res, 
      gasPrice: '0x14f46b0400',
      gasLimit: '0x47b760', 
      to,
      value: txValue,
      data: txData
    };
      
    console.log(rawTx);
    
const tx = new Tx(rawTx);
      tx.sign(privateKey);


const serializedTx = tx.serialize(); // Clean things up a bit

console.log(serializedTx.toString('hex')); // Log the resulting raw transaction hex for debugging if it fails to send

this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')) // Broadcast the transaction to the network
.on('transactionHash',  (hash) => {
  console.log("hash " + hash);
})
// .on('receipt', (receipt) => {
// console.log("receipt " + receipt)
// })
// .on('confirmation', (confirmationNumber, receipt) => { 
//   console.log("confirmation " + confirmationNumber + receipt)
//  })
.on('error', console.error); // If a out of gas error, the second parameter is the receipt.
    
    
  });

  

  // const receipt = this.web3.eth.getTransactionReceipt('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b')
  // .then(console.log);


  
  }

}
