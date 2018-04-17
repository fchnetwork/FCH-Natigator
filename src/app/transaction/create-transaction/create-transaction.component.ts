import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../account/services/authentication-service/authentication.service';
import { TransactionServiceService } from '../services/transaction-service/transaction-service.service';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../shared/services/modal.service';


const Tx = require('ethereumjs-tx');
const ethJsUtil = require('ethereumjs-util');
const Web3 = require('web3');

declare var window: any;

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss']
})
export class CreateTransactionComponent implements OnInit {

  backupKeystore: any;
  decryptKeystore: any;
  myBalance: any;
  theirBalance: any;

  privateKey: string;

  /* new fields */
  senderAddress: string;
  receiverAddress: string = "0xa20e9de99c67bb25b04af7893b4d0ca1ce3b6ef9";
  amount: number = 0.1;
  transactions: any[];
  includedDataLength: number;
  walletBalance: number;
  sendEverything: boolean;
  transactionMessage:any;
  addressQR: string;

  constructor(
    public authServ: AuthenticationService,
    private modalSrv: ModalService,
    public txnServ: TransactionServiceService ) {
    this.userData();
   }


  ngOnInit() {
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
    this.walletBalance = this.myBalance;
    this.includedDataLength = 0;
  }


  userData() {
      return this.authServ.showKeystore().then( 
        (keystore) => {

          const getBalance = this.txnServ.checkBalance(keystore.address);
          const getQR = this.authServ.createQRcode( "0x" + keystore.address );  

          return Promise.all([ keystore, getBalance, getQR ]); 

      }
    )
      .then(
        ([ keystore, accBalance, qrCode ]) => {
        this.senderAddress = "0x" + keystore.address ;
        this.walletBalance = accBalance;
        this.addressQR = qrCode;
      }
    );
  }

  getMaxTransactionFee() {
    // TODO: calculation logic here
    return 0.000000;
  }

  setSendEverything(event) {
    if(event) {
      this.amount = this.walletBalance;
    }
    this.sendEverything = event;
  }

  getTotalAmount() {
    if(this.amount) {
      return Number(this.amount) + Number(this.getMaxTransactionFee());
    }
    else {
      return 0;
    }
  }


  showMore() {}

  showTransactions() {}

  getICoin(amount) {
    return amount > 0;
  }


  send() {
    this.transactionMessage = "";

    this.modalSrv.openTransactionConfirm().then( result =>{ 

       if( this.receiverAddress == undefined || this.receiverAddress == null) {
          alert("You need to add a receiver address");  
          return false;      
       }
       this.txnServ.transaction( result.web3.privateKey, result.web3.address, this.receiverAddress, this.amount, "aerum test transaction" ).then( res => {
        this.transactionMessage = res;
      }).catch( error =>  console.log(error) );

    });

  }




}
