import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { PasswordValidator } from '../../../shared/helpers/validator.password';
import { AuthenticationService } from '../../../account/services/authentication-service/authentication.service';

export interface BasicModalContext {
  param?: any;
}

@Component({
  selector: 'app-transaction-sign-modal',
  templateUrl: './transaction-sign-modal.component.html',
  styleUrls: ['./transaction-sign-modal.component.scss']
})
export class TransactionSignModalComponent implements ModalComponent<BasicModalContext>, OnInit {

  getVariable: any;
  unlockAccountForm: FormGroup;
  message = {};


  senderAddress: string;
  receiverAddress: string;  
  senderAvatar: string;
  receiverAvatar: string;  
  gasPrice: string;
  maxFee: string;
  fee: string;

  // {"sender":"0x76f98d0d811037b58aa496bb8a3583e86985c54f","recipient":"0x76f98d0d811037b58aa496bb8a3583e86985c54f","amount":0,"fee":0.000022496,"maxFee":"22496","gas":10}





  constructor( public dialog: DialogRef<BasicModalContext>,
               public authServ: AuthenticationService,
               public formBuilder: FormBuilder) {

            if(dialog.context.param) {
              this.getVariable = dialog.context.param;
              this.message = dialog.context.param;
              this.senderAddress = this.cropAddress( dialog.context.param.sender );
              this.receiverAddress = this.cropAddress(  dialog.context.param.recipient );
              this.senderAvatar = this.authServ.generateCryptedAvatar( dialog.context.param.sender );
              this.receiverAvatar = this.authServ.generateCryptedAvatar( dialog.context.param.recipient );
              this.maxFee = dialog.context.param.maxFee;
              this.fee = dialog.context.param.fee;        
            }
  }

  ngOnInit() {}  	


  cropAddress(address:string) {
    const start = address.substr(0, 6);
    const end = address.substr(-4);
     return start + "..."+ end;
   }



  accept(){
    this.dialog.close(true);
  }

  dismiss() {
    this.dialog.close(false);
  }


}
