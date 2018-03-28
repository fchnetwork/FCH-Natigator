import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { TransactionServiceService } from '../services/transaction-service/transaction-service.service';
const Tx = require('ethereumjs-tx');
const ethJsUtil = require('ethereumjs-util');

const Web3 = require('web3');

declare var window: any;

@Component({
  selector: 'app-createTransaction',
  templateUrl: './createTransaction.component.html',
  styleUrls: ['./createTransaction.component.scss']
})
export class CreateTransactionComponent implements OnInit {

  backupKeystore: any;
  decryptKeystore: any;
  myBalance: any;
  theirBalance: any;
  
  constructor(
    public authServ: AuthenticationService, 
    public txnServ: TransactionServiceService ) {
      
     }

  ngOnInit() { }

  showKeyStore() {
    this.backupKeystore =	this.authServ.showKeystore()
  }
  
  showDecryptedKeyStore() {
    this.decryptKeystore =	this.authServ.unencryptKeystore( "prettyGoodPa55w0rd")
  }
  
  
  checkYourBalance() {
    this.txnServ.checkBalance(this.decryptKeystore.address).then( res => {
      console.log("res " +  res)
      this.myBalance = 	res
    } )
  }
  
  checkReceiverBalance( address ) {
   // this.theirBalance = this.txnServ.checkBalance()
   this.txnServ.checkBalance( address ).then( res => {
    console.log("res " +  res)
    this.theirBalance = 	res
  } )   
  }
  
  

  
  createTransaction(){
  // console.log ( JSON.parse( Cookie.get('account') ) ); 
  // console.log ( JSON.parse( Cookie.get('encrypted') ) );   

  // const accounts = JSON.parse( Cookie.get('account') )
  
  // console.log(this.decryptKeystore.address)
  this.txnServ.transaction(  this.decryptKeystore.privateKey, this.decryptKeystore.address, "0xb0573f6b040fddf1250cdd38983f4eac06fbf3ca", '0.01', "hi its paddy" )
  
  // remoteFunc(privkey, from, to, amount, data,  )
  
  

  
  
  }
  
  
  
  
  
  
  
  
  
  
}
