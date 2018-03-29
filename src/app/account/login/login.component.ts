import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'; 
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { Router } from '@angular/router'
import {TranslateService} from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject'
import { PasswordValidator } from '../../shared/helpers/validator.password';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  address: string;
  avatar: string;
  private: string;
  loginFormFindAddress: FormGroup; 
  loginFormGetKey: FormGroup; 
  componentDestroyed$: Subject<boolean> = new Subject()
	step: string = 'step_1';  // default page to show
  accountPayload = { address: "", password: "" }


    constructor(
          public authServ: AuthenticationService,
          private _router: Router,
          public formBuilder: FormBuilder
        ) {}

    countWords(s){
      s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
      s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
      s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
      return s.split(' ').length; 
    }

    ngOnInit() {

      this.loginFormFindAddress = this.formBuilder.group({
        seed: ["", [Validators.required ] ],
      });

      this.loginFormGetKey = this.formBuilder.group({
        password: [ "", [Validators.required, Validators.minLength(10), PasswordValidator.number, PasswordValidator.upper, PasswordValidator.lower ] ],
        confirmpassword: ["", [Validators.required ] ]
		},{ 
			validator: this.matchingPasswords('password', 'confirmpassword')
		});



      this.loginFormFindAddress.valueChanges.takeUntil( this.componentDestroyed$ ).subscribe( v => {
        const countSeed = this.countWords( v.seed )
        // if ( countSeed == 12 ) {
          this.authServ.generateAddressLogin( v.seed  ).then( async res => {
              this.address = res.address
              this.avatar = res.avatar
              this.private = res.private
          });
        // }
      });
    }


    

  // Custom validator to make sure the password and confirm password match /    
	matchingPasswords( passwordKey: string, passwordConfirmationKey: string ) {
		return (group: FormGroup ) => {
			let passwordInput = group.controls[passwordKey];
			let passwordConfirmationInput = group.controls[passwordConfirmationKey];
			if (passwordInput.value !== passwordConfirmationInput.value ) {
				return passwordConfirmationInput.setErrors({notEquivalent: true})
			}
		}
	}


  onSubmitAddress() {
      if( this.loginFormFindAddress.valid ) {
        this.step = "step_2"
        console.log(this.step)
        console.log( JSON.stringify(this.address) )
      }
    }




  onSubmitPassword() {
      if( this.loginFormGetKey.valid ) {
       this.authServ.saveKeyStore( this.private, this.loginFormGetKey.value.password )
      }
    }

    ngOnDestroy() {
      this.componentDestroyed$.next(true);
      this.componentDestroyed$.complete();
    }


}
