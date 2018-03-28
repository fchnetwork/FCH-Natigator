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
    public txnServ: TransactionServiceService ) {}

  ngOnInit() { }

  showKeyStore() {
    this.authServ.showKeystore().then( v => {
      this.backupKeystore =	v
    })
  }
  
  showDecryptedKeyStore() {
    // set up as a promise to let user know about wrong password
    this.authServ.unencryptKeystore( "prettyGoodPa55w0rd").then( (v) => {
      this.decryptKeystore = v
    }, (err) => {
      this.decryptKeystore = err
    })
  }
  
  
  checkYourBalance() {
    if(this.decryptKeystore) {
        this.txnServ.checkBalance(this.decryptKeystore.address).then( res => {
          console.log("res " +  res)
          this.myBalance = 	res
        }, (err) => {
          this.myBalance = err
        })
    } else {
      alert("Error: Either your keystore does not exist or you have not unlocked it, is your password correct ?")
    }
  }
  
  checkReceiverBalance( address ) {
   // this.theirBalance = this.txnServ.checkBalance()
   this.txnServ.checkBalance( address ).then( res => {
    console.log("res " +  res)
    this.theirBalance = 	res
  } )   
  }
  

  createTransaction(){
  if(  this.decryptKeystore ) {
      this.txnServ.transaction(  this.decryptKeystore.privateKey, this.decryptKeystore.address, "0xb0573f6b040fddf1250cdd38983f4eac06fbf3ca", '0.01', "hi its paddy" )
  } else {
    alert("Error: Either your keystore does not exist or you have not unlocked it, is your password correct ?")
  }
  }
  
}
