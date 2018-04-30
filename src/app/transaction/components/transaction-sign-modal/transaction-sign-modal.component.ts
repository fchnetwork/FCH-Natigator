import { Component } from '@angular/core';
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
export class TransactionSignModalComponent implements ModalComponent<BasicModalContext> {

  getVariable: any;
  unlockAccountForm: FormGroup;
  message = {};


  senderAddress: string;
  receiverAddress: string;  
  senderAvatar: string;
  receiverAvatar: string;  
  amount: string;
  maxFee: string;
  fee: string;

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
              this.amount = dialog.context.param.amount;        
            }
  }


  cropAddress(address:string) {
     return address.substr(0, 6) + "..."+  address.substr(-4);
   }

  accept(){
    this.dialog.close(true);
  }

  dismiss() {
    this.dialog.close(false);
  }


}
