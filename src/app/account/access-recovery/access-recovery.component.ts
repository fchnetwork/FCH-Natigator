import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'; 
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject'
import { PasswordValidator } from '../../shared/helpers/validator.password';

import { Cookie } from 'ng2-cookies/ng2-cookies';
  

@Component({
  selector: 'app-access-recovery',
  templateUrl: './access-recovery.component.html',
  styleUrls: ['./access-recovery.component.scss']
})
export class AccessRecoveryComponent implements OnInit {

  address: string;
  avatar: string;
  private: string;
  accessrecFormFindAddress: FormGroup; 
  loginFormGetKey: FormGroup; 
  componentDestroyed$: Subject<boolean> = new Subject()
	step: string = 'step_1';  // default page to show
  accountPayload = { address: "", password: "" }

    constructor(
          public authServ: AuthenticationService,
          private router: Router,
          public formBuilder: FormBuilder
        ) {}


    countWords(s){
      s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
      s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
      s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
      return s.split(' ').length; 
    }

    confirm(){
      console.log("Confirmed....... KEY FILES");
    }

    ngOnInit() {
      this.accessrecFormFindAddress = this.formBuilder.group({
        seed: ["", [Validators.required ] ],
        password: [ "", [Validators.required, Validators.minLength(10), PasswordValidator.number, PasswordValidator.upper, PasswordValidator.lower ] ],
        confirmpassword: ["", [Validators.required ] ]
      },{ 
        validator: this.matchingPasswords('password', 'confirmpassword')
      });

      this.accessrecFormFindAddress.controls['seed'].valueChanges.takeUntil( this.componentDestroyed$ ).subscribe( v => {
       console.log( v.length );

        if ( v.length > 2 ) {
        // const countSeed = this.countWords( v )
        // if ( countSeed == 12 ) {
          this.authServ.generateAddressLogin( v  ).then( async res => {
            //console.log(res);  
            this.address = res.address
              this.avatar = res.avatar
              this.private = res.private
          });
        } else {
          this.address = "";
        }
      });
    }


  // Custom validator to make sure the password and confirm password match /    
	matchingPasswords( passwordKey: string, passwordConfirmationKey: string ) {
		return (group: FormGroup ) => {
			let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      console.log( "Som v pass validatore a passwordInput value je :" + passwordInput.value )
			if (passwordInput.value !== passwordConfirmationInput.value ) {
				return passwordConfirmationInput.setErrors({notEquivalent: true})
			}
		}
	}

  onSubmitAddress() {
      if( this.accessrecFormFindAddress.valid ) {
        console.log( this.private )
        console.log( this.accessrecFormFindAddress.value.password )
        this.authServ.saveKeyStore( this.private, this.accessrecFormFindAddress.value.password )

       // this.authServ.showKeystore2();

        this.router.navigate(['/transaction']); // improvements need to be made here but for now the auth guard should work just fine
      }
    }


    ngOnDestroy() {
      this.componentDestroyed$.next(true);
      this.componentDestroyed$.complete();
    }


}
