import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject'
import { PasswordValidator } from '../../shared/helpers/validator.password';

import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  address: string;
  avatar: string;
  private: string; // i dont know 
  loginForm: FormGroup

  step: string = 'step_1';  // default page to show

  windowState: boolean;

  constructor(
    public authServ: AuthenticationService,
    private router: Router,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.windowState = true;

    this.loginForm = this.formBuilder.group({
      account: ["", [Validators.required]],
      password: ["", [Validators.required]],
    }, {
        // validator: this.matchingPasswords('password', 'confirmpassword')
      });
  }

  onSubmitAddress() {
    this.router.navigate(['/transaction']);
    if (this.loginForm.valid) {
      //this.authServ.authorize(this.login, this.password).then( result => {
      // something
      //});
      this.router.navigate(['/transaction']); // improvements need to be made here but for now the auth guard should work just fine
    }

    // if (this.loginFormFindAddress.valid) {
    //   console.log(this.private)
    //   console.log(this.loginFormFindAddress.value.password)
    //   this.authServ.saveKeyStore(this.private, this.loginFormFindAddress.value.password)

    //   // this.authServ.showKeystore2();


    //   this.router.navigate(['/transaction']); // improvements need to be made here but for now the auth guard should work just fine
    // }
  }

  windowStateChange() {
    if (this.windowState) {
      this.router.navigate(['/account/recovery']);
    }
  }
}
