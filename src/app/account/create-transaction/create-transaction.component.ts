import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { TransactionServiceService } from '../services/transaction-service/transaction-service.service';
// import { ModalService } from '../../shared/services/modal.service';
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
  receiverAddress: any;
  amount: number;
  transactions: any[];
  includedDataLength: number;
  walletBalance: number;
  sendEverything: boolean;
  transactionMessage:any;

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
      return this.authServ.showKeystore().then( (resultA) => {
          return Promise.all([resultA, this.txnServ.checkBalance(resultA.address)]); // resultA will implicitly be wrapped
      }).then( ([resultA, resultB]) => {
        this.senderAddress = "0x" + resultA.address ;
        this.walletBalance = resultB;
      });
  }


  public getMaxTransactionFee() {
    // TODO: calculation logic here
    return 0.000000;
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


  public showMore() {}

  public showTransactions() {}

  public getICoin(amount) {
    return amount > 0;
  }


  public send() {
    this.transactionMessage = ""
    this.modalSrv.openTransactionConfirm().then( result =>{ 
       if( this.receiverAddress == undefined || this.receiverAddress == null) {
          alert("You need to add a receiver address")  
          return false      
       }
       this.txnServ.transaction(  result.privateKey, result.address, this.receiverAddress, this.amount, "aerum test transaction" ).then( res => {
        this.transactionMessage = res
      }).catch( error =>  console.log(error) );

    });

  }




}
