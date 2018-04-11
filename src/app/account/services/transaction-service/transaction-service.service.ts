import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Overlay } from 'ngx-modialog';

const Tx = require('ethereumjs-tx');
const ethJsUtil = require('ethereumjs-util');
const Web3 = require('web3');

declare var window: any;
declare var window: any;

@Injectable()
export class TransactionServiceService {

    public web3: any;
    
    constructor() {
        this.initWeb3();
    }


    initWeb3 = () => {
        if (typeof window.web3 !== 'undefined') {
          console.warn('Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask');
          this.web3 = new Web3(window.web3.currentProvider);
        } else {
          console.warn('No web3 detected. Falling back to ${environment.HttpProvider}. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask');
          this.web3 = new Web3(
            new Web3.providers.HttpProvider(environment.HttpProvider)
          ); 
        }
      };

 
    checkBalance(account?:string) {
      return this.web3.eth.getBalance(account)
    }  
      

    transaction( privkey, activeUser, to, amount, data ) : Promise<any> {
        return new Promise( (resolve, reject) => {
            const privateKey =  ethJsUtil.toBuffer( privkey )
            const sendTo = ethJsUtil.toChecksumAddress( to ) ;
            const from = ethJsUtil.toChecksumAddress( activeUser );
            const txValue = this.web3.utils.numberToHex(this.web3.utils.toWei( amount.toString(), 'ether'));
            const txData = this.web3.utils.asciiToHex( data ); 
          
            const getGasPrice = this.web3.eth.getGasPrice()
            const getTransactionCount = this.web3.eth.getTransactionCount( from )
            const estimateGas = this.web3.eth.estimateGas({to:sendTo, data:txData})            

         return Promise.all([getGasPrice, getTransactionCount, estimateGas]).then( (values) => {

              // console.log("gas price" + values[0]);
              // console.log("count" + values[1]);  
              // console.log("estimateGas" + values[2]);      

              let nonce = parseInt(values[1], 10)   
              let gas = parseInt(values[2], 10)   
              console.log( this.web3.utils.toHex( nonce ) )

              const rawTransaction = {
                nonce: this.web3.utils.toHex( nonce ), 
                gas: this.web3.utils.toHex( gas ),
                gasPrice: this.web3.utils.toHex( this.web3.utils.toWei( "12", 'gwei')),
                to: to,
                value: txValue,
                //data: txData
              }

              const tx = new Tx(rawTransaction);
                    tx.sign(privateKey);

                  let transaction = this.web3.eth.sendSignedTransaction( '0x' + tx.serialize().toString('hex') )
                      transaction.on('transactionHash', hash => { 
                        alert(hash) 
                        setTimeout(() => {
                          this.web3.eth.getTransactionReceipt( hash ).then( res =>  alert( "receipt "+JSON.stringify(res) ) );
                        }, 4000);
                      }).catch( error => {
                          alert( error )
                      })
            });
        });
    }
}