import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { testAccount } from '../../shared/helpers/data.mock';
import { PasswordValidator } from '../../shared/helpers/validator.password';
import { RegistrationRouteData } from '../models/RegistrationRouteData';
import { Router } from '@angular/router';  
import { RouteDataService } from '@app/core/general/route-data-service/route-data.service';
import { PasswordCheckerService } from '@app/core/authentication/password-checker-service/password-checker.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = this.formBuilder.group({});
  testAccount = testAccount;
  password: string;
  confirmPassword: string;
  avatar: string;
  
  passwordStrength = {
    strength: '',
    class: '',
  };

  constructor(
    public translate: TranslateService, 
    public formBuilder: FormBuilder, 
    public router: Router, 
    private routeDataService: RouteDataService<RegistrationRouteData>,
    public passCheck: PasswordCheckerService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      // password: [ null, [Validators.required, Validators.minLength(10), PasswordValidator.number, PasswordValidator.upper, PasswordValidator.lower]],
      password: [ null, [Validators.required, Validators.minLength(5)]],
      confirmPassword: [ null, [Validators.required]],
      avatar: [1]
    }, {
        validator: this.matchingPasswords('password', 'confirmPassword')
      });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const data = new RegistrationRouteData();

      data.avatar = this.registerForm.value.avatar.avatar;
      data.password = this.registerForm.value.password;
      data.mnemonic = this.registerForm.value.avatar.seed;
      data.address = this.registerForm.value.avatar.address;
      data.extendedPrivateKey = this.registerForm.value.avatar.privExtend;
      data.extendedPublicKey = this.registerForm.value.avatar.pubExtend;
      data.privateKey = this.registerForm.value.avatar.private;
      data.publicKey = this.registerForm.value.avatar.public;

      this.routeDataService.routeData = data;
      this.router.navigate(['/account/backup']);
    }
  }

  onKey(event: any) {
    this.passwordStrength = this.passCheck.checkPassword(event);
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
