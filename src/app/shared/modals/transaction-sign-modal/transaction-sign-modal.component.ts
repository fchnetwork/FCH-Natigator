import { ModalViewComponent, DialogRef } from '@aerum/ui';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';

export class TransactionSignData {
  unlockAccountForm: FormGroup;
  senderAddress: string;
  receiverAddress: string;
  senderAvatar: string;
  receiverAvatar: string;
  amount: string;
  maxFee: number;
  fee: number;
  token: string;
  checkbox: boolean;
  checked: boolean;
  text:string;
  external = false;
  pin: number;
}

export class TransactionSignResponse {
  pin: number;
}

@Component({
  selector: 'app-transaction-sign-modal',
  templateUrl: './transaction-sign-modal.component.html',
  styleUrls: ['./transaction-sign-modal.component.scss']
})
export class TransactionSignModalComponent implements ModalViewComponent<TransactionSignData, TransactionSignResponse> {

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
    public dialogRef: DialogRef<TransactionSignData, TransactionSignResponse>,
    public authServ: AuthenticationService,
    public formBuilder: FormBuilder
  ) {
  }


  cropAddress(address:string) {
     return address.substr(0, 6) + "..."+  address.substr(-4);
   }

  accept(){
    this.dialogRef.close({pin: this.pin ? this.pin : 0});
  }
}
