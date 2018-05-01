import { ActivatedRoute } from '@angular/router';
import { environment } from './../../../environments/environment.local';
import { Component, OnInit } from '@angular/core';
import * as Moment from 'moment';
import { AuthenticationService } from '../../account/services/authentication-service/authentication.service';
import { TransactionServiceService } from '../services/transaction-service/transaction-service.service';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../shared/services/modal.service';
import { ClipboardService } from '../../shared/services/clipboard.service';
import { InternalNotificationService } from '../../shared/services/notification.service';
import { SessionStorageService } from 'ngx-webstorage';
import { TokenService } from '@app/dashboard/services/token.service';
import * as CryptoJs from 'crypto-js';

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
  amount = 0;
  transactions: any[];
  includedDataLength: number;
  walletBalance: number;
  aeroBalance: number;
  sendEverything: boolean;
  transactionMessage:any;
  addressQR: string;
  maxTransactionFee = 0;
  maxTransactionFeeEth = 0;
  totalAmount = 0;
  tokens: any;
  selectedToken = {
    symbol: 'AERO',
    address: null,
    balance: 0,
    decimals: null,
  };
  web3: any;
  sub: any;
  isToken = false;
  redirectUrl: string;
  external = false;

  constructor(
    public authServ: AuthenticationService,
    private modalSrv: ModalService,
    private clipboardService: ClipboardService,
    private notificationService: InternalNotificationService,
    public txnServ: TransactionServiceService,
    public sessionStorageService: SessionStorageService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
   ) {
    this.userData();
    setInterval(()=>{
      this.userData();
      this.updateTokensBalance();
    },3000);
    
   }

  updateTokensBalance() {
    this.tokenService.updateTokensBalance().then((res)=>{
      this.tokens = res;
      for (let i = 0; i < this.tokens.length; i ++) {
        if(this.selectedToken.symbol === this.tokens[i].symbol) {
          this.walletBalance = this.tokens[i].balance;
          return true;
        } else {
          this.walletBalance = this.aeroBalance;
        }
      }
    });
  }

  initWeb3 = () => {
    return new Web3( new Web3.providers.HttpProvider(environment.HttpProvider)); 
  };

  ngOnInit() {
    this.walletBalance = this.myBalance;
    this.includedDataLength = 0;
    this.handleInputsChange();
    this.tokens = this.tokenService.getTokens();
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        if(params.query) {
          const parsed = JSON.parse(params.query);
          this.senderAddress = parsed.from ? parsed.from : this.senderAddress;
          this.receiverAddress = parsed.to ? parsed.to : this.receiverAddress;
          this.amount = parsed.amount ? parsed.amount : this.amount;
          this.isToken = parsed.assetAddress === "0" ? false : true;
          this.redirectUrl = parsed.returnUrl ? parsed.returnUrl : this.redirectUrl;
          this.external = true;
          this.getMaxTransactionFee();
          this.getTotalAmount();
        }
      });
  }

  copyToClipboard() {
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
        if(this.selectedToken.symbol === 'AERO') {
          this.walletBalance = accBalance;
        }
        this.aeroBalance = accBalance;
        this.addressQR     = qrCode;
      }
    );
  }

  getMaxTransactionFee() {
    if(this.receiverAddress) {
      this.txnServ.maxTransactionFee(this.receiverAddress, this.selectedToken.symbol === 'AERO' ? "aerum test transaction" : {type: 'token', contractAddress: this.selectedToken.address, amount: Number(this.amount * Math.pow(10,this.selectedToken.decimals))}).then(res=>{
        this.maxTransactionFee = res[0];
        this.maxTransactionFeeEth = res[1];
        this.getTotalAmount();
        if(this.external) {
          this.send();
        }
      }).catch((err)=>{
        console.log(err);
      });
    } else {
      this.maxTransactionFee = 0.000;
    }
  }

  setSendEverything(event) {
    if(event) {
      this.amount = Number(this.walletBalance) - Number(this.maxTransactionFeeEth);
    }
    this.sendEverything = event;
  }

  getTotalAmount() {
    if(this.receiverAddress) {
      this.totalAmount = this.selectedToken.symbol === 'AERO' ?  Number(this.amount) + Number(this.maxTransactionFeeEth) : Number(this.maxTransactionFeeEth);
    }
    else {
      this.totalAmount = 0;
    }
  }

  showMore() {}

  showTransactions() {}

  handleInputsChange() {
    this.getMaxTransactionFee();
    this.getTotalAmount();
  }

  handleSelectChange() {
    if(this.selectedToken.symbol === 'AERO') {
      this.isToken = false;
      this.walletBalance = this.aeroBalance;
    } else {
      this.isToken = true;
      this.walletBalance = this.selectedToken.balance;
    }
    this.getMaxTransactionFee();
    this.getTotalAmount();
  }

  send() {
    this.transactionMessage = "";
    if( this.receiverAddress === undefined || this.receiverAddress == null) {
      alert("You need to add a receiver address");  
      return false;      
    } else {
      this.txnServ.checkAddressCode(this.receiverAddress).then((res:any)=>{
        let message = null;

        if(res.length > 3) {
          message = {
            title: 'WARNING!',
            text: 'The address you are sending to appears to be a smart contract address. Unless this token contract follows ERC223 standard and receiving smart contract implements a call back function that allows it to handle incoming token transfers your tokens can be lost forever. Do you still want to continue?',
          };
        } else {
          // else standard transaction so prepare the txn details for the modal window
          message = {
            sender:  this.senderAddress,
            recipient: this.receiverAddress,
            amount:  this.amount,
            fee: this.totalAmount,
            maxFee: this.maxTransactionFee,
          }          
        }
        this.modalSrv.openTransactionConfirm(message).then( result =>{ 
          if(result === true) {
            const privateKey = this.sessionStorageService.retrieve('private_key');
            const address = this.sessionStorageService.retrieve('acc_address');
    
            if(this.selectedToken.symbol === 'AERO' && !this.isToken) {
              this.txnServ.transaction( privateKey, address, this.receiverAddress, this.amount, "aerum test transaction", this.external, this.redirectUrl ).then( res => {
                this.transactionMessage = res;
              }).catch( error =>  console.log(error) );
            } else if(this.selectedToken.address) {
              this.txnServ.sendTokens(address, this.receiverAddress, Number(this.amount * Math.pow(10,this.selectedToken.decimals)), this.selectedToken.address, this.external, this.redirectUrl).then((res)=>{
                this.transactionMessage = res;
              });
            }
          }
        });
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
