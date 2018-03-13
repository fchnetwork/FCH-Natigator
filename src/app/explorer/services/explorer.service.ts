import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { environment } from '../../../environments/environment';
import {BehaviorSubject}    from 'rxjs/BehaviorSubject';
import {Subject}    from 'rxjs/Subject';
//     "types": [ "node" ],
// "typeRoots": [ "../node_modules/@types" ]
const Web3 = require('web3');

declare var window: any;


@Injectable()
export class ExplorerService {

  public web3: any;
  
  public data$: BehaviorSubject<any> = new BehaviorSubject({});
  private pongSource = new Subject<any>();
  pong$ = this.pongSource.asObservable();
  
  

  constructor() { 
    // console.log("Web3" + Web3)
    this.checkAndInstantiateWeb3();
  
  }

  
  checkAndInstantiateWeb3 = () => {
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

  fromWei(amountInWei, currency) {
    return this.web3.utils.fromWei( amountInWei.toString(), currency );
  }

  getBlock(): Observable<any>{
    return Observable.create(observer => {
      this.web3.eth.getBlockNumber((err, block) => {
        if (err != null) {
          observer.error('There was an error fetching your blocks.')
        }

        if (block.length === 0) {
          observer.error('no blocks')
        }
        console.log( block );
        return observer.next(block)
        // observer.complete()
      });
    })
  }
  
  getAccounts(): Observable<any>{
  	return Observable.create(observer => {
  	  this.web3.eth.getAccounts((err, accs) => {
  	    if (err != null) {
  	      observer.error('There was an error fetching your accounts.')
  	    }

  	    if (accs.length === 0) {
  	      observer.error('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.')
  	    }

  	    observer.next(accs)
  	    observer.complete()
  	  });
  	})
  }

}
