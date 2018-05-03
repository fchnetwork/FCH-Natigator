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

  myBalance: any;
  privateKey: string;

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
  hash: any;
  assetAddress: any;
  timeStamp: any;
  returnUrlFailed: any;

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
          this.hash = parsed.hash ? parsed.hash : this.hash;
          this.assetAddress = parsed.assetAddress ? parsed.assetAddress : this.assetAddress;
          this.timeStamp = parsed.timeStamp ? parsed.timeStamp : this.timeStamp;
          this.returnUrlFailed = parsed.returnUrlFailed ? parsed.returnUrlFailed : this.returnUrlFailed;
          this.getMaxTransactionFee();
          this.getTotalAmount();
        }
      });
    this.web3 = this.initWeb3();
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

  openTransactionConfirm(message) {
    this.modalSrv.openTransactionConfirm(message, this.external).then( result =>{ 
      const urls = {success: this.redirectUrl, failed: this.returnUrlFailed};
      const validHash = this.checkHash(result.pin);
      if(result.result === true && validHash) {
        const privateKey = this.sessionStorageService.retrieve('private_key');
        const address = this.sessionStorageService.retrieve('acc_address');

        if(this.selectedToken.symbol === 'AERO' && !this.isToken) {
          this.txnServ.transaction( privateKey, address, this.receiverAddress, this.amount, "aerum test transaction", this.external, urls).then( res => {
            this.transactionMessage = res;
          }).catch( (error) =>  {
            console.log(error);
            if(this.external) {
              window.location.href=urls.failed;
            }
          });
        } else if(this.selectedToken.address) {
          this.txnServ.sendTokens(address, this.receiverAddress, Number(this.amount * Math.pow(10,this.selectedToken.decimals)), this.selectedToken.address, this.external, urls).then((res)=>{
            this.transactionMessage = res;
          });
        }
      } else if(this.external) {
        window.location.href=this.returnUrlFailed;
      }
    });
  }

  checkHash(pin){
    if(this.external) {
      return String(this.hash) === String(this.web3.utils.keccak256(`${this.senderAddress},${this.receiverAddress}, ${this.amount}, ${this.assetAddress}, ${this.timeStamp}, ${pin}`));
    }
    return false;
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
            text: 'You are sending tokens to a contract address that appears to support ERC223 standard. However, this is not a guaranty that your token transfer will be processed properly. Always make sure you trust a contract you are sending your tokens to.',
            sender:  this.senderAddress,
            recipient: this.receiverAddress,
            amount:  this.amount,
            fee: this.totalAmount,
            maxFee: this.maxTransactionFee,
          };
          this.tokenService.tokenFallbackCheck(this.receiverAddress, 'tokenFallback(address,uint256,bytes)').then((res)=>{
            if(!res) {
              message.text = 'The contract address you are sending your tokens to does not appear to support ERC223 standard, sending your tokens to this contract address will likely result in a loss of tokens sent. Please acknowledge your understanding of risks before proceeding further.';
              message.checkbox = true;
            }
            this.openTransactionConfirm(message);
          });
        } else {
          message = {
            sender:  this.senderAddress,
            recipient: this.receiverAddress,
            amount:  this.amount,
            fee: this.totalAmount,
            maxFee: this.maxTransactionFee,
          };
          this.openTransactionConfirm(message);        
        }
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
