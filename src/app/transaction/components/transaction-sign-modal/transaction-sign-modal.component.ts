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

  constructor( public dialog: DialogRef<BasicModalContext>,
               public authServ: AuthenticationService,
               public formBuilder: FormBuilder) {

            if(dialog.context.param) {
              this.getVariable = dialog.context.param;
              this.message = dialog.context.param;
            }
  }

  ngOnInit() {}  	

  accept(){
    this.dialog.close(true);
  }

  dismiss() {
    this.dialog.close(false);
  }


}
