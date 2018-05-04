import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'; 
import { AuthenticationService } from '@account/services/authentication-service/authentication.service';
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject';
import { PasswordValidator } from '../../shared/helpers/validator.password';

import { Cookie } from 'ng2-cookies/ng2-cookies';
  

@Component({
  selector: 'app-access-recovery',
  templateUrl: './access-recovery.component.html',
  styleUrls: ['./access-recovery.component.scss']
})
export class AccessRecoveryComponent implements OnInit {

  address = "";
  avatar: string;
  private: string;
  recoverForm: FormGroup; 
  loginFormGetKey: FormGroup; 
  componentDestroyed$: Subject<boolean> = new Subject();
	step = 'step_1';
  accountPayload = { address: "", password: "" };
  seedFileText: string;

    constructor(
          public authServ: AuthenticationService,
          private router: Router,
          public formBuilder: FormBuilder,
          public cd: ChangeDetectorRef
        ) {}


    openSeedFile(event) {
        const input = event.target;
        for ( let index = 0; index < input.files.length; index++ ) {
            const reader = new FileReader();
            reader.onload = () => {
                this.seedFileText = reader.result;
                console.log(this.seedFileText);
                this.recoverForm.controls['seed'].setValue( this.seedFileText );
            };
            reader.readAsText(input.files[index]);
        }
    }


    ngOnInit() {

      this.recoverForm = this.formBuilder.group({
        seed: ["", [Validators.required ] ],
        // password: [ "", [Validators.required, Validators.minLength(10), PasswordValidator.number, PasswordValidator.upper, PasswordValidator.lower ] ],
        password: [ "", [Validators.required ] ],
        confirmpassword: ["", [Validators.required ] ]
      },{ 
        validator: this.matchingPasswords('password', 'confirmpassword')
      });

      this._processFormData();
      
    }

    private _processFormData() {
      const seedControl = this.recoverForm.controls['seed'];
            seedControl.valueChanges.takeUntil( this.componentDestroyed$ ).subscribe( async v => {
              if ( v && v.length > 2 ) {

                let cleanSeed = v.trim(); // trim starting and ending spaces
                    cleanSeed = cleanSeed.replace(/[^\w\s]/gi, ' '); // clean all special characters 
                    cleanSeed.replace(/\s\s+/g, ' ');  // remove double spaces

                this.authServ.generateAddressLogin( cleanSeed ).then( async res => {
                    this.address = res.address;
                    this.avatar = res.avatar;
                    this.private = res.private;
                });
                
              } 
          this.address = "";
          this.cd.detectChanges();
        });
    }

    // Custom validator to make sure the password and confirm password match /    
    matchingPasswords( passwordKey: string, passwordConfirmationKey: string ) {
      return (group: FormGroup ) => {
        const passwordInput = group.controls[passwordKey];
        const passwordConfirmationInput = group.controls[passwordConfirmationKey];
        if (passwordInput.value !== passwordConfirmationInput.value ) {
          return passwordConfirmationInput.setErrors({notEquivalent: true});
        }
      };
    }

    onSubmitAddress() {
      if( this.recoverForm.valid ) {
        console.log( this.private );
        console.log( this.recoverForm.value.password );
        this.authServ.saveKeyStore( this.private, this.recoverForm.value.password, this.recoverForm.value.seed );
        this.router.navigate(['/dashboard']); // improvements need to be made here but for now the auth guard should work just fine
      }
    }

    ngOnDestroy() {
      this.componentDestroyed$.next(true);
      this.componentDestroyed$.complete();
    }


}
