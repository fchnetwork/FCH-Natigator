import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationRouteData } from '../models/RegistrationRouteData';
import { Router } from '@angular/router';
import { RouteDataService } from '@app/core/general/route-data-service/route-data.service';
import { PasswordCheckerService } from '@app/core/authentication/password-checker-service/password-checker.service';
import { SessionStorageService } from 'ngx-webstorage';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = this.formBuilder.group({});
  password: string;
  confirmPassword: string;
  avatar: string;
  returnUrl: string;

  passwordStrength = {
    strength: '',
    class: '',
  };

  constructor(
    public translate: TranslateService,
    public formBuilder: FormBuilder,
    public router: Router,
    public route: ActivatedRoute,
    private routeDataService: RouteDataService<RegistrationRouteData>,
    public passCheckService: PasswordCheckerService,
    public sessionStorage: SessionStorageService
  ) { }

  // TODO: export somewhere to lib to avoid double code
  cleanCookies() {
    Cookie.set('aerum_base', null, 7, "/", environment.cookiesDomain);
    Cookie.set('aerum_keyStore', null, 7, "/", environment.cookiesDomain);
    Cookie.set('tokens', null, 7, "/", environment.cookiesDomain);
    Cookie.set('transactions', null, 7, "/", environment.cookiesDomain);
    Cookie.set('ethereum_accounts', null, 7, "/", environment.cookiesDomain);
    Cookie.set('cross_chain_swaps', null, 7, "/", environment.cookiesDomain);
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || null;
    this.registerForm = this.formBuilder.group({
      // password: [ null, [Validators.required, Validators.minLength(10), PasswordValidator.number, PasswordValidator.upper, PasswordValidator.lower]],
      password: [ null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [ null, [Validators.required]],
      avatar: [1]
    }, {
        validator: this.matchingPasswords('password', 'confirmPassword')
      });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.cleanCookies();
      const data = new RegistrationRouteData();

      this.sessionStorage.store('acc_address', this.registerForm.value.avatar.address);
      this.sessionStorage.store('acc_avatar', this.registerForm.value.avatar.avatar);
      this.sessionStorage.store('seed', this.registerForm.value.avatar.seed);
      this.sessionStorage.store('private_key', this.registerForm.value.avatar.private);
      this.sessionStorage.store('password', this.registerForm.value.password);
      this.sessionStorage.store('transactions', []);
      this.sessionStorage.store('tokens', []);
      this.sessionStorage.store('ethereum_accounts', []);
      this.sessionStorage.store('cross_chain_swaps', []);

      data.avatar = this.registerForm.value.avatar.avatar;
      data.password = this.registerForm.value.password;
      data.mnemonic = this.registerForm.value.avatar.seed;
      data.address = this.registerForm.value.avatar.address;
      data.extendedPrivateKey = this.registerForm.value.avatar.privExtend;
      data.extendedPublicKey = this.registerForm.value.avatar.pubExtend;
      data.privateKey = this.registerForm.value.avatar.private;
      data.publicKey = this.registerForm.value.avatar.public;
      data.returnUrl = this.returnUrl || '/';

      this.routeDataService.routeData = data;
      this.router.navigate(['/account/backup']);
    }
  }

  onKey(event: any) {
    this.passwordStrength = this.passCheckService.checkPassword(event);
  }

  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey];
      const passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true });
      }
    };
  }
}
