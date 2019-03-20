import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationRouteData } from '../models/RegistrationRouteData';
import { Router } from '@angular/router';
import { RouteDataService } from '@app/core/general/route-data-service/route-data.service';
import { PasswordCheckerService } from '@app/core/authentication/password-checker-service/password-checker.service';
import { StorageService } from '@app/core/general/storage-service/storage.service';
import { TokenService } from '@app/core/transactions/token-service/token.service';
import { environment } from '@env/environment';

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
    public storageService: StorageService,
    private tokenService: TokenService
  ) { }

  // TODO: export somewhere to lib to avoid double code
  cleanCookies() {
    this.storageService.setCookie('aerum_base', null, false, 7);
    this.storageService.setCookie('aerum_keyStore', null, false, 7);
    this.storageService.setCookie('tokens', null, false, 7);
    this.storageService.setCookie('ethereum_tokens', null, false, 7);
    this.storageService.setCookie('transactions', null, false, 7);
    this.storageService.setCookie('ethereum_accounts', null, false, 7);
    this.storageService.setCookie('cross_chain_swaps', null, false, 7);
    this.storageService.setCookie('stakings', null, false, 7);
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

      this.storageService.setSessionData('acc_address', this.registerForm.value.avatar.address);
      this.storageService.setSessionData('acc_avatar', this.registerForm.value.avatar.avatar);
      this.storageService.setSessionData('seed', this.registerForm.value.avatar.seed);
      this.storageService.setSessionData('private_key', this.registerForm.value.avatar.private);
      this.storageService.setSessionData('password', this.registerForm.value.password);
      this.storageService.setSessionData('transactions', []);
      this.storageService.setSessionData('tokens', []);
      this.storageService.setSessionData('ethereum_tokens', []);
      this.storageService.setSessionData('ethereum_accounts', []);
      this.storageService.setSessionData('cross_chain_swaps', []);
      this.storageService.setSessionData('stakings', []);

      this.addPredefinedTokens();

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
      this.router.navigate(['/account/register-name']);
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

  private addPredefinedTokens() {
    const addresses = environment.predefinedTokens;
    if(!addresses) {
      return;
    }
    addresses.forEach(async address => {
      const token = await this.tokenService.getTokensInfo(address);
      if(token && token.address) {
        this.tokenService.addToken(token);
      }
    });
  }
}
