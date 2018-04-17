import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject';
import { PasswordValidator } from '../../shared/helpers/validator.password';

import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  address: string;
  password: string;
  avatar: string;
  private: string; // i dont know 
  loginForm: FormGroup;

  step = 'step_1';  // default page to show

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
    this.authServ.unencryptKeystore(this.password).then( result => {
      sessionStorage.setItem('acc_address', result.web3.address);
      setTimeout(()=>{
        this.router.navigate(['/transaction']);
      }, 300);
      
    });
  }

  windowStateChange() {
    if (this.windowState) {
      this.router.navigate(['/account/recovery']);
    }
  }
}
