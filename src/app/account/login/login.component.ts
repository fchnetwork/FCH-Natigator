import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject';
import { SessionStorageService } from 'ngx-webstorage';
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
  sub: any;
  step = 'step_1';
  query: string;

  windowState: boolean;

  constructor(
    public authServ: AuthenticationService,
    private router: Router,
    public formBuilder: FormBuilder,
    public sessionStorageService: SessionStorageService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.windowState = true;

    this.loginForm = this.formBuilder.group({
      account: ["", [Validators.required]],
      password: ["", [Validators.required]],
    }, {
        // validator: this.matchingPasswords('password', 'confirmpassword')
      });
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        this.query = params.query;
      });
  }

  onSubmitAddress() {
    this.authServ.login(this.password).then((res)=>{
      if(res === 'success') {
        if(this.query) {
          this.router.navigate([`/transaction`], {queryParams: {query: this.query}});
        } else {
          this.router.navigate([`/dashboard`]);
        }
        
      }
    });
  }

  windowStateChange() {
    if (this.windowState) {
      this.router.navigate(['/account/recovery']);
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
