import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../account/services/authentication-service/authentication.service';
import { TransactionServiceService } from '../services/transaction-service/transaction-service.service';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../shared/services/modal.service';
import { ClipboardService } from '../../shared/services/clipboard.service';
import { NotificationService } from '../../shared/services/notification.service';

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
  receiverAddress: string;
  amount: number;
  transactions: any[];
  includedDataLength: number;
  walletBalance: number;
  sendEverything: boolean;
  transactionMessage:any;
  addressQR: string;

  constructor(
    public authServ: AuthenticationService,
    private modalSrv: ModalService,
    private clipboardService: ClipboardService,
    private notificationService: NotificationService,
    public txnServ: TransactionServiceService ) {
    this.userData();
   }


  ngOnInit() {
    this.walletBalance = this.myBalance;
    this.includedDataLength = 0;
  }

  public copyToClipboard() {
    this.clipboardService.copy(this.senderAddress);
    this.notificationService.showMessage('Copied to clipboard!');
  }

  userData() {
      return this.authServ.showKeystore().then( 
        (keystore) => {

          const getBalance = this.txnServ.checkBalance(keystore.address);
          const getQR      = this.authServ.createQRcode( "0x" + keystore.address );  

          return Promise.all([ keystore, getBalance, getQR ]); 

      }
    )
      .then(
        ([ keystore, accBalance, qrCode ]) => {
        this.senderAddress = "0x" + keystore.address ;
        this.walletBalance = accBalance;
        this.addressQR     = qrCode;
      }
    );
  }

  getMaxTransactionFee() {
    this.receiverAddress = '0x5a71daa132d05d15bf5f6e26fc0afa9454b55bbd';
    if(this.receiverAddress) {
      return String(this.txnServ.maxTransactionFee(this.receiverAddress, "aerum test transaction"));
   } else {
     return String(0.000);
   }

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
