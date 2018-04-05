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

 
    checkBalance(account?:string) {
      return this.web3.eth.getBalance(account)
    }  
      
  
  
transaction( privkey, activeUser, to, amount, data ) {

    const privateKey =  ethJsUtil.toBuffer( privkey )
    const sendTo = ethJsUtil.toChecksumAddress( to ) ;
    const from = ethJsUtil.toChecksumAddress( activeUser );
    const txValue = this.web3.utils.numberToHex(this.web3.utils.toWei( amount.toString(), 'ether'));
    const txData = this.web3.utils.asciiToHex( data ); 
    
    this.web3.eth.getTransactionCount( from ).then( res => {
  
          
      const rawTx = {
        nonce: '0x'+res, 
        gasPrice: '0x14f46b0400',
        gasLimit: '0x47b760', 
        to: to,
        value: txValue,
        data: txData
      }
        
      console.log(rawTx)
      
  const tx = new Tx(rawTx);
        tx.sign(privateKey);
  
  
  const serializedTx = tx.serialize(); // Clean things up a bit
  
  console.log(serializedTx.toString('hex')); // Log the resulting raw transaction hex for debugging if it fails to send
  
  this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')) // Broadcast the transaction to the network
  .on('transactionHash',  (hash) => {
    console.log("hash " + hash)
  })
  // .on('receipt', (receipt) => {
  // console.log("receipt " + receipt)
  // })
  // .on('confirmation', (confirmationNumber, receipt) => { 
  //   console.log("confirmation " + confirmationNumber + receipt)
  //  })
  .on('error', console.error); // If a out of gas error, the second parameter is the receipt.      
    })
    // const receipt = this.web3.eth.getTransactionReceipt('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b')
    // .then(console.log);
}






// getTransactionsByAccount(myaccount, startBlockNumber, endBlockNumber) {
//   if (endBlockNumber == null) {
//     endBlockNumber = this.web3.blockNumber;
//     console.log("Using endBlockNumber: " + endBlockNumber);
//   }
//   if (startBlockNumber == null) {
//     startBlockNumber = endBlockNumber - 1000;
//     console.log("Using startBlockNumber: " + startBlockNumber);
//   }
//   console.log("Searching for transactions to/from account \"" + myaccount + "\" within blocks "  + startBlockNumber + " and " + endBlockNumber);

//   for (var i = startBlockNumber; i <= endBlockNumber; i++) {
//     if (i % 1000 == 0) {
//       console.log("Searching block " + i);
//     }
//     var block = this.web3.getBlock(i, true);
//     if (block != null && block.transactions != null) {
//       block.transactions.forEach( function(e) {
//         if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
//           console.log("  tx hash          : " + e.hash + "\n"
//             + "   nonce           : " + e.nonce + "\n"
//             + "   blockHash       : " + e.blockHash + "\n"
//             + "   blockNumber     : " + e.blockNumber + "\n"
//             + "   transactionIndex: " + e.transactionIndex + "\n"
//             + "   from            : " + e.from + "\n" 
//             + "   to              : " + e.to + "\n"
//             + "   value           : " + e.value + "\n"
//             + "   time            : " + block.timestamp + " " + new Date(block.timestamp * 1000).toUTCString() + "\n"
//             + "   gasPrice        : " + e.gasPrice + "\n"
//             + "   gas             : " + e.gas + "\n"
//             + "   input           : " + e.input);
//         }
//       })
//     }
//   }
// }















}