import { Injectable } from '@angular/core';
const taiPasswordStrength = require("tai-password-strength")

@Injectable()
export class PasswordCheckerService {
    strengthTester: any;

    constructor() {
        this.strengthTester = new taiPasswordStrength.PasswordStrength();
        this.strengthTester.addCommonPasswords(taiPasswordStrength.commonPasswords);
        this.strengthTester.addTrigraphMap(taiPasswordStrength.trigraphs);
    }

    checkPassword( password: string ) {
        return this.strengthTester.check(password);
    }

}
