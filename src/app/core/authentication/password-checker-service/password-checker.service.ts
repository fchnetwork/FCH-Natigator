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

    constructor() {
        this.strengthTester = new taiPasswordStrength.PasswordStrength();
        this.strengthTester.addCommonPasswords(taiPasswordStrength.commonPasswords);
        this.strengthTester.addTrigraphMap(taiPasswordStrength.trigraphs);
    }

    checkPassword( password: string ) {
        return this.strengthTester.check(password);
    }

}
