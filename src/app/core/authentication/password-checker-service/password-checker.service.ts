import { Injectable } from '@angular/core';
const taiPasswordStrength = require("tai-password-strength")

@Injectable()
export class PasswordCheckerService {
    strengthTester: any;
    passClass = {
        'VERY_WEAK': 'red',
        'WEAK': 'yellow',
        'REASONABLE': 'green',
        'STRONG': 'blue',
        'VERY_STRONG': 'blue'
    }

    passwordStrength = {
        strength: '',
        class: '',
      };

    constructor() {
        this.strengthTester = new taiPasswordStrength.PasswordStrength();
        this.strengthTester.addCommonPasswords(taiPasswordStrength.commonPasswords);
        this.strengthTester.addTrigraphMap(taiPasswordStrength.trigraphs);
    }

    checkPassword(event: any) {
        if (event.target.value == "") {
          this.passwordStrength.class = "";
          this.passwordStrength.strength = "";
        } else {
          this.passwordStrength.strength = this.strengthTester.check(event.target.value).strengthCode;
          this.passwordStrength.class = this.passClass[this.strengthTester.check(event.target.value).strengthCode];
        }
        return this.passwordStrength;
    }

}
