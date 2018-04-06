import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { testAccount } from '../../shared/helpers/data.mock';
import { PasswordValidator } from '../../shared/helpers/validator.password';
import { RegistrationRouteData } from '../models/RegistrationRouteData';
import { Router } from '@angular/router';
import { RouteDataService } from '../../shared/services/route-data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = this.formBuilder.group({});
  testAccount = testAccount;
  password: string = this.testAccount[0].password;
  confirmPassword: string = this.testAccount[0]["passwordConfirm"];
  avatar: string;

  constructor(public translate: TranslateService, public formBuilder: FormBuilder, public router: Router, private routeDataService: RouteDataService<RegistrationRouteData>) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      password: [this.testAccount[0]["password"], [Validators.required, Validators.minLength(10), PasswordValidator.number, PasswordValidator.upper, PasswordValidator.lower]],
      confirmPassword: [this.testAccount[0]["passwordConfirm"], [Validators.required]],
      avatar: [1]
    }, {
        validator: this.matchingPasswords('password', 'confirmPassword')
      });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      var data = new RegistrationRouteData();

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

  matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
    }
  }
}
