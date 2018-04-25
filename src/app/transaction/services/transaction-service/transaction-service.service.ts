import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Overlay } from 'ngx-modialog';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '@account/services/authentication-service/authentication.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { SessionStorageService } from 'ngx-webstorage';
import { ModalService } from '@app/shared/services/modal.service';

const Tx = require('ethereumjs-tx');
const ethJsUtil = require('ethereumjs-util');
const Web3 = require('web3');

@Injectable()
export class TransactionServiceService {

    // if moving or renaming be sure to update the convertToEther pipe in shared modules 
    web3: any;
    
    constructor( 
      _auth: AuthenticationService,
      private sessionStorage: SessionStorageService,
      private modalService: ModalService,
     ) {
      this.web3 = _auth.initWeb3();
    }

    /**
     * @desc outputs the users balance then converts to ether balance
     * @param account 
     */
    checkBalance(account?:string) {
      return   this.web3.eth.getBalance(account).then( balance => {
        return this.web3.utils.fromWei( balance.toString(), 'ether')
       });
    }  

    // If moving this function be sure to update the convertToEther pipe in shared modules 
    convertToEther(amount) : string {
      return this.web3.utils.fromWei( amount.toString(), 'ether')
    }
    
    maxTransactionFee(to, data) {
      return new Promise((resolve, reject) => {
        const sendTo = ethJsUtil.toChecksumAddress( to ) ;
        const txData = this.web3.utils.asciiToHex( data ); 
        const estimateGas = this.web3.eth.estimateGas({to:sendTo, data:txData});
        const gasPrice = this.web3.eth.getGasPrice();

        Promise.all([gasPrice, estimateGas]).then((res) =>{
           const transactionFee = Number(this.web3.utils.toWei(String(1), 'gwei')) * Number(res[1]);
           const resultInGwei = this.web3.utils.fromWei(String(transactionFee), 'gwei');
           const resultInEther = this.web3.utils.fromWei(String(transactionFee), 'ether');
           resolve([resultInGwei, resultInEther]);
        });
      });
    }

    saveTransaction(from, to, amount, data, hash) {
      const date = new Date();
      const password = this.sessionStorage.retrieve('password');
      const transaction = { from, to, amount, data, date, hash };
      const transactions = this.sessionStorage.retrieve('transactions') || [];
      transactions.push(transaction);
      const stringTransaction = JSON.stringify(transactions);
      const encryptedTransactions = CryptoJS.AES.encrypt( stringTransaction, password );

      Cookie.set('transactions', encryptedTransactions, 7, "/", environment.cookiesDomain);
      this.sessionStorage.store('transactions', transactions);
    }

    updateStorage(transactions) {
      const password = this.sessionStorage.retrieve('password');
      const stringTransaction = JSON.stringify(transactions);
      const encryptedTransactions = CryptoJS.AES.encrypt( stringTransaction, password );
      Cookie.set('transactions', encryptedTransactions, 7, "/", environment.cookiesDomain);
      this.sessionStorage.store('transactions', transactions);
    }

    updateTransactionsStatuses(transactions) {
        const sortedTransactions = [];
        for(let i = 0; i < transactions.length; i++) {
          this.web3.eth.getTransactionReceipt( transactions[i].hash ).then( res =>  {
            if(res.status) {
              transactions[i].data = 'Successful transaction';
              sortedTransactions.push(transactions[i]);
            } else  {
              transactions[i].data = 'Failed transaction';
              sortedTransactions.push(transactions[i]);
            }

            if(i + 1 === transactions.length) {
              this.updateStorage(sortedTransactions);
            }
          }).catch((err) =>{
            sortedTransactions.push(transactions[i]);

            if(i + 1 === transactions.length) {
              this.updateStorage(sortedTransactions);
            }
          });
        }
    }

    transaction( privkey, activeUser, to, amount, data ) : Promise<any> {
      return new Promise( (resolve, reject) => {
          const privateKey          = ethJsUtil.toBuffer( privkey )
          const sendTo              = ethJsUtil.toChecksumAddress( to ) ;
          const from                = ethJsUtil.toChecksumAddress( activeUser );
          const txValue             = this.web3.utils.numberToHex(this.web3.utils.toWei( amount.toString(), 'ether'));
          const txData              = this.web3.utils.asciiToHex( data ); 
          const getGasPrice         = this.web3.eth.getGasPrice()
          const getTransactionCount = this.web3.eth.getTransactionCount( from )
          const estimateGas         = this.web3.eth.estimateGas({to:sendTo, data:txData})            

       return Promise.all([getGasPrice, getTransactionCount, estimateGas]).then( (values) => {
            let nonce = parseInt(values[1], 10);
            let gas = parseInt(values[2], 10);

            const rawTransaction = {
              nonce: this.web3.utils.toHex( nonce ), 
              gas: this.web3.utils.toHex( gas ),
              gasPrice: this.web3.utils.toHex( this.web3.utils.toWei( "16", 'gwei')),
              to: to,
              value: txValue,
              // data: txData
            };
            const tx = new Tx(rawTransaction);
                  tx.sign(privateKey);       
            const transaction = this.web3.eth.sendSignedTransaction( ethJsUtil.addHexPrefix( tx.serialize().toString('hex') ) );
                transaction.on('transactionHash', hash => { 
                  console.log(hash);
                  this.saveTransaction(activeUser, to, amount, 'Pending transaction', hash);
                  this.modalService.openTransaction(hash);
                }).catch( error => {
                    // alert( error )
                });
          });
      });
  }
}