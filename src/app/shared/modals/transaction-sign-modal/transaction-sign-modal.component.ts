import { Component } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { DefaultModalContext } from '@app/shared/modals/models/default-modal-context.model';

@Component({
  selector: 'app-transaction-sign-modal',
  templateUrl: './transaction-sign-modal.component.html',
  styleUrls: ['./transaction-sign-modal.component.scss']
})
export class TransactionSignModalComponent implements ModalComponent<DefaultModalContext> {

  unlockAccountForm: FormGroup;
  senderAddress: string;
  receiverAddress: string;
  senderAvatar: string;
  receiverAvatar: string;
  amount: string;
  maxFee: string;
  fee: string;
  token: string;
  checkbox: false;
  checked: false;
  title: string;
  text:string;
  external = false;
  pin: number;

  constructor (
    public dialog: DialogRef<DefaultModalContext>,
    public authServ: AuthenticationService,
    public formBuilder: FormBuilder
  ) {
    if(dialog.context.param) {
      this.title = dialog.context.param.title;
      this.text = dialog.context.param.text;
      this.senderAddress = this.cropAddress( dialog.context.param.sender );
      this.receiverAddress = this.cropAddress(  dialog.context.param.recipient );
      this.senderAvatar = this.authServ.generateCryptedAvatar( dialog.context.param.sender );
      this.receiverAvatar = this.authServ.generateCryptedAvatar( dialog.context.param.recipient );
      this.maxFee = dialog.context.param.maxFee;
      this.fee = dialog.context.param.fee;
      this.token = dialog.context.param.token;
      this.amount = dialog.context.param.amount;
      this.checkbox = dialog.context.param.checkbox || false;
      this.external = dialog.context.param.external;
    }
  }


  cropAddress(address:string) {
     return address.substr(0, 6) + "..."+  address.substr(-4);
   }

  accept(){
    this.dialog.close({result: true, pin: this.pin ? this.pin : ''});
  }

  dismiss() {
    this.dialog.close(false);
  }


}
