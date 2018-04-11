import { Component, OnInit } from '@angular/core';
import { ModalComponent, DialogRef } from 'ngx-modialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { PasswordValidator } from '../../../shared/helpers/validator.password';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';

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

  constructor( public dialog: DialogRef<BasicModalContext>,
               public authServ: AuthenticationService,
               public formBuilder: FormBuilder) {

            if(dialog.context.param) {
              this.getVariable = dialog.context.param;
            }
  }

  ngOnInit() {
    this.unlockAccountForm = this.formBuilder.group({
    //	password: [ null, [Validators.required, Validators.minLength(10), PasswordValidator.number, PasswordValidator.upper, PasswordValidator.lower ] ]
    password: [ null, [Validators.required, Validators.minLength(5) ] ]
		});
  }  	

  onSubmit(){
    this.authServ.unencryptKeystore( this.unlockAccountForm.controls['password'].value ).then( (v) => {
      if(v) {
        this.dialog.close( v );
      }
    }, (err) => {
      alert("error - is this password correct?" + err);
    })
  }

  dismiss(): void {
    this.dialog.dismiss();
  }


}
