import { ActivatedRoute } from '@angular/router'; 
import { Component, OnInit } from '@angular/core';
import * as Moment from 'moment';  
import { FormsModule } from '@angular/forms'; 
import { SessionStorageService } from 'ngx-webstorage'; 
import * as CryptoJs from 'crypto-js';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';  
import { environment } from '@env/environment';   
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service'; 
import { ModalService } from '@app/core/general/modal-service/modal.service';
import { ClipboardService } from '@app/core/general/clipboard-service/clipboard.service';
import { InternalNotificationService } from '@app/core/general/internal-notification-service/internal-notification.service';
import { TransactionService } from '@app/core/transactions/transaction-service/transaction.service';
import { TokenService } from '@app/core/transactions/token-service/token.service';

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
  txnForm: FormGroup = this.formBuilder.group({});

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
  querySenderAddress: any;
  assetAddress: any;
  timeStamp: any;
  returnUrlFailed: any;
  moreOptionsData = {
    data: '',
    limit: '',
    price: '',
    selectedToken: 'AERO',
  };
  showedMore = false;
  updateInterval: any;
  invalid = [];
  
  
  formControlKeys = [];
  errorMessages = {};
  
  constructor(
    public formBuilder: FormBuilder,
    public authServ: AuthenticationService,
    private modalSrv: ModalService,
    private clipboardService: ClipboardService,
    private notificationService: InternalNotificationService,
    public txnServ: TransactionService,
    public sessionStorageService: SessionStorageService,
    private tokenService: TokenService,
    private route: ActivatedRoute,) {
    this.userData();
    this.updateInterval = setInterval(()=>{
      this.userData();
      this.updateTokensBalance();
    },3000);
    
    // work on these more with https://regex101.com
    let regexAmount = "^[0-9\.\-\/]+$"; // issues with decimals and validation - needs more work
    // Address is to fix
    let regexAddress = '^0x[0-9a-{0,42}]+$' 

    this.txnForm = this.formBuilder.group({
      senderAddress: [ this.senderAddress, [Validators.required, Validators.minLength(42), Validators.maxLength(42)]],
      receiverAddress: [ this.receiverAddress, [Validators.required, Validators.minLength(42), Validators.maxLength(42)]],
      amount: [ null, [Validators.required, Validators.pattern(regexAmount) ]],
      selectedToken: [ this.selectedToken, [Validators.required]]
    });
    

    this.formControlKeys = Object.keys(this.txnForm.controls);

    this.errorMessages = {
      required: "You must add a value to this field",
      max: "Max allowed value for input is 42",
      min: "Min allowed value for input is 42",
      pattern: "this is not an allowed value",
    };
   
    
   }

   getObjectKeys(arg) {
     if(arg != null || arg != null) {
        return Object.keys(arg);
     }
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
          this.querySenderAddress = parsed.from;
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
      this.txnServ.maxTransactionFee(this.receiverAddress, this.selectedToken.symbol === 'AERO' ? (this.showedMore && this.moreOptionsData.data ? this.moreOptionsData.data : ''): {type: 'token', contractAddress: this.selectedToken.address, amount: Number(this.amount * Math.pow(10,this.selectedToken.decimals))}).then(res=>{
        this.maxTransactionFee = res[0];
        this.maxTransactionFeeEth = res[1];
        this.moreOptionsData.price = res[2];
        this.moreOptionsData.limit = res[3];
        this.getTotalAmount();
        if(this.external) {
          this.send();
        }
      }).catch((err)=>{
       // console.log(err);
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

  showMore() {
    this.showedMore = this.showedMore ? false : true;
    if(!this.showedMore) {
      this.moreOptionsData = {
        data: '',
        limit: '',
        price: '',
        selectedToken: this.selectedToken.symbol,
      };
    }
  }

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
      this.moreOptionsData.data = null;
    }
    this.moreOptionsData.selectedToken = this.selectedToken.symbol;
    this.getMaxTransactionFee();
    this.getTotalAmount();
  }

  checkHash(pin){
    // if(this.external) {
    //   return String(this.hash) === String(this.web3.utils.keccak256(`${this.querySenderAddress},${this.receiverAddress}, ${this.amount}, ${this.assetAddress}, ${this.timeStamp}, ${pin}`));
    // }
    return true;
  }

  openTransactionConfirm(message) {
    this.modalSrv.openTransactionConfirm(message, this.external).then( result =>{ 
      const urls = {success: this.redirectUrl, failed: this.returnUrlFailed};
      // const validHash = this.checkHash(result.pin ? result.pin : '');
      const validHash = true;
      if(result.result === true && validHash) {
        const privateKey = this.sessionStorageService.retrieve('private_key');
        const address = this.sessionStorageService.retrieve('acc_address');
        if(this.selectedToken.symbol === 'AERO' && !this.isToken) {
          this.txnServ.transaction( privateKey, address, this.receiverAddress, this.amount, this.showedMore && this.moreOptionsData.data ? this.moreOptionsData.data : null, this.external, urls, this.moreOptionsData).then( res => {
            this.transactionMessage = res;
          }).catch( (error) =>  {
            console.log(error);
            if(this.external) {
              window.location.href=urls.failed;
            }
          });
        } else if(this.selectedToken.address) {
          this.txnServ.sendTokens(address, this.receiverAddress, Number(this.amount * Math.pow(10,this.selectedToken.decimals)), this.selectedToken.address, this.external, urls, this.moreOptionsData).then((res)=>{
            this.transactionMessage = res;
          });
        }
      } else if(this.external) {
        window.location.href=this.returnUrlFailed;
      }
    });
  };

  send() {
    this.transactionMessage = "";
    if( this.receiverAddress === undefined || this.receiverAddress == null) {
      alert("You need to add a receiver address");  
      return false;      
    } else {
      this.txnServ.checkAddressCode(this.receiverAddress).then((res:any)=>{
        let message = {
          title: null,
          text: null,
          checkbox: false,
          sender:  this.senderAddress,
          recipient: this.receiverAddress,
          amount:  this.amount,
          fee: this.maxTransactionFeeEth,
          maxFee: this.maxTransactionFee,
          token: this.selectedToken.symbol
        };

        if(res.length > 3) {
          message.title = 'WARNING!';
          message.text = 'You are sending tokens to a contract address that appears to support ERC223 standard. However, this is not a guaranty that your token transfer will be processed properly. Always make sure you trust a contract you are sending your tokens to.';

          this.tokenService.tokenFallbackCheck(this.receiverAddress, 'tokenFallback(address,uint256,bytes)').then((res)=>{
            if(!res) {
              message.text = 'The contract address you are sending your tokens to does not appear to support ERC223 standard, sending your tokens to this contract address will likely result in a loss of tokens sent. Please acknowledge your understanding of risks before proceeding further.';
              message.checkbox = true;
            }
            this.openTransactionConfirm(message);
          });
        } else {
          message = message;
          this.openTransactionConfirm(message);        
        }
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    clearInterval(this.updateInterval);
  }

  moreOptionsChange(event){
    this.moreOptionsData = event.data;
    if(event.type === 'data') {
      this.getMaxTransactionFee();
      this.getTotalAmount();
    }
  }

}
