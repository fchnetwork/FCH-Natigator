import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { TransactionService } from '@app/core/transactions/transaction-service/transaction.service';
import { AerumNameService } from '@app/core/aens/aerum-name-service/aerum-name.service';
import { TokenService } from '@app/core/transactions/token-service/token.service';

@Component({
  selector: 'app-external-transaction',
  templateUrl: './external-transaction.component.html',
  styleUrls: ['./external-transaction.component.scss']
})
export class ExternalTransactionComponent implements OnInit {
  sub: any;
  isToken: boolean;
  redirectUrl: string;
  returnUrlFailed: string;
  assetAddress: string;
  orderId: string;
  contractAddress: string;

  senderAddress: string;
  receiverAddress: string;
  senderAddressShort: string;
  receiverAddressShort: string;
  senderAvatar: string;
  receiverAvatar: string;
  amount: any;
  maxFee: string;
  fee: string;
  token: string;
  checkbox = false;
  checked = false;
  title: string;
  text:string;
  external = true;
  pin: number;

  constructor(
    public authServ: AuthenticationService,
    public route: ActivatedRoute,
    public sessionStorageService: SessionStorageService,
    public transactionService: TransactionService,
    public tokenService: TokenService,
    public nameService: AerumNameService,
  ) {
                 
    // if(dialog.context.param) {
    //   this.title = dialog.context.param.title;
    //   this.text = dialog.context.param.text;              
    //   this.receiverAddress = this.cropAddress(  dialog.context.param.recipient );
    //   this.maxFee = dialog.context.param.maxFee;
    //   this.fee = dialog.context.param.fee;
    //   this.token = dialog.context.param.token;   
    //   this.amount = dialog.context.param.amount;   
    //   this.checkbox = dialog.context.param.checkbox || false;      
    // }

    this.prepareData();
  }

  ngOnInit(){}

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  prepareData() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        if (params.query) {
          const parsed = JSON.parse(params.query);
          this.senderAddressShort = this.cropAddress(this.sessionStorageService.retrieve('acc_address'));
          this.senderAddress = this.sessionStorageService.retrieve('acc_address');
          this.receiverAddressShort = parsed.to ? this.cropAddress(parsed.to) : this.receiverAddress;
          this.receiverAddress = parsed.to ? parsed.to : this.receiverAddress;
          this.senderAvatar = this.authServ.generateCryptedAvatar( this.senderAddress );
          this.receiverAvatar = this.authServ.generateCryptedAvatar( this.receiverAddress );
          this.amount = parsed.amount ? parsed.amount : this.amount;
          this.isToken = parsed.assetAddress !== "0";
          this.redirectUrl = parsed.returnUrl ? parsed.returnUrl : this.redirectUrl;
          this.assetAddress = parsed.assetAddress ? parsed.assetAddress : this.assetAddress;
          this.orderId = parsed.orderId ? parsed.orderId : this.orderId;
          this.returnUrlFailed = parsed.returnUrlFailed ? parsed.returnUrlFailed : this.returnUrlFailed;
          this.contractAddress = parsed.contractAddress ? parsed.contractAddress : this.contractAddress;
          // TODO: handle transactionfee
          // this.safeGetMaxTransactionFee();
          this.prepareMessages();
        }
      });
  }

  async prepareMessages() {
    const checkedAddress: any = await this.transactionService.checkAddressCode(this.receiverAddress);
    if (checkedAddress.length > 3) {
      this.title = 'WARNING!';
      this.text = 'You are sending tokens to a contract address that appears to support ERC223 standard. However, this is not a guarantee that your token transfer will be processed properly. Mmake sure you always trust a contract that you are sending your tokens to.';

      const res = await this.tokenService.tokenFallbackCheck(this.receiverAddress, 'tokenFallback(address,uint256,bytes)');
      if (!res) {
        this.text = 'The contract address you are sending your tokens to does not appear to support ERC223 standard, sending your tokens to this contract address will likely result in a loss of tokens sent. Please acknowledge your understanding of risks before proceeding further.';
        this.checkbox = true;
      }
    }
  }
  cropAddress(address:string) {
     return address.substr(0, 6) + "..."+  address.substr(-4);
   }

  async accept(){
    const resolvedAddress = await this.nameService.resolveNameOrAddress(this.receiverAddress);
    console.log(resolvedAddress);
    const privateKey = this.sessionStorageService.retrieve('private_key');
    const address = this.sessionStorageService.retrieve('acc_address');
    const urls = {
      failed: this.returnUrlFailed,
      success: this.redirectUrl,
    };
    if(this.isToken) {
    // TODO: add decimals
      const dec = this.tokenService.getTokensInfo(this.contractAddress);
      console.log(dec);
      const decimals = 8;
      console.log(dec);
      this.transactionService.sendTokens(this.senderAddress, resolvedAddress, Number(this.amount * Math.pow(10, decimals)), this.contractAddress, this.external, urls, this.orderId).then((res) => {
        console.log(res);
      });
    } else {
      this.transactionService.transaction(privateKey, this.senderAddress, resolvedAddress, this.amount, null, this.external, urls, this.orderId, {}).then(res => {
        console.log(res);
      }).catch((error) => {
        console.log(error);
        if (this.external) {
          // window.location.href = this.returnUrlFailed;
        }
      });
    }
  }

  dismiss() {
    window.location.href = this.returnUrlFailed;
  }

}
