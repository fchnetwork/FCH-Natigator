import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { TransactionServiceService } from '../services/transaction-service/transaction-service.service';
import { ModalService } from '../../shared/services/modal.service';
import { FormsModule } from '@angular/forms';


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

  /* new fields */
  senderAddress: string;
  receiverAddress: any;
  amount: number;
  transactions: any[];
  includedDataLength: number;
  walletBalance: number;
  sendEverything: boolean;
  
  constructor(
    public authServ: AuthenticationService, 
    public txnServ: TransactionServiceService,
    public modal: ModalService
   ) {}

  ngOnInit() { 
    this.senderAddress = '35a1sd6f8ew13f5a1f5sd1f6a854e65f1'; // fake address
    this.transactions = [
      {month: 'Feb', day: '22', eventType: 'Contract execution', senderAddress: 'Partnership Execution', receiverAddress: '3Pasdfawe56f5wae4f68', amount: 10.00},
      {month: 'Feb', day: '22', eventType: 'Contract execution', senderAddress: 'Partnership Execution', receiverAddress: '3Pasdfawe56f5wae4f68', amount: 155.10},
      {month: 'Feb', day: '22', eventType: 'Contract execution', senderAddress: 'Partnership Execution', receiverAddress: '3Pasdfawe56f5wae4f68', amount: 0.04165},
      {month: 'Feb', day: '22', eventType: 'Sent', senderAddress: 'Partnership Execution', receiverAddress: '3Pasdfawe56f5wae4f68', amount: -1.00},
      {month: 'Feb', day: '22', eventType: 'Sent', senderAddress: 'Partnership Execution', receiverAddress: '3Pasdfawe56f5wae4f68', amount: -51.00},
      {month: 'Feb', day: '22', eventType: 'Contract execution', senderAddress: 'Partnership Execution', receiverAddress: '3Pasdfawe56f5wae4f68', amount: 1.00},
      {month: 'Feb', day: '22', eventType: 'Contract execution', senderAddress: 'Partnership Execution', receiverAddress: '3Pasdfawe56f5wae4f68', amount: 1.00},
      {month: 'Feb', day: '22', eventType: 'Contract execution', senderAddress: 'Partnership Execution', receiverAddress: '3Pasdfawe56f5wae4f68', amount: 1.00},
      {month: 'Feb', day: '22', eventType: 'Contract execution', senderAddress: 'Partnership Execution', receiverAddress: '3Pasdfawe56f5wae4f68', amount: 1.00}
    ];
    this.walletBalance = 10.6654345;
    this.includedDataLength = 0;
  }

  public getMaxTransactionFee() {
    // TODO: calculation logic here
    return 0.000420;
  }

  public setSendEverything(event) {
    if(event) {
      this.amount = this.walletBalance;
    }
    this.sendEverything = event;
  }

  public getTotalAmount() {
    if(this.amount) {
      return Number(this.amount) + Number(this.getMaxTransactionFee());
    } 
    else {
      return 0;
    }
  }

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
  
  public openDemoModal(dataModel) {
    this.modal.openBasicModal(dataModel).then((result)=>{
      console.log("Modal window was closed with SuccessButton.");
    })
    .catch(()=>{
    });
  }

  public showMore() {

  }

  public send() {

  }

  public showTransactions() {

  }

  public getICoin(amount) {
    return amount > 0;
  }
}
