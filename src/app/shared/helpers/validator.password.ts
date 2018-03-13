import { FormControl } from '@angular/forms';

export interface ValidationResult {
    [key: string]: boolean;
}

export class PasswordValidator {

    // public static strong(control: FormControl): ValidationResult {
    //     let hasNumber = /\d/.test(control.value);
    //     let hasUpper = /[A-Z]/.test(control.value);
    //     let hasLower = /[a-z]/.test(control.value);
    //   //  console.log('Num, Upp, Low', hasNumber, hasUpper, hasLower);
    //     const valid = hasNumber && hasUpper && hasLower;
              
    //     if (!valid) {
    //         // return what´s not valid
    //         return { strong: true };
    //     }
    //     return null;
    // }
    
    
    public static number(control: FormControl): ValidationResult {
        let hasNumber = /\d/.test(control.value);
              
        if (!hasNumber) {
            // return what´s not valid
            return { number: true };
        }
        return null;
    }    
    
    public static upper(control: FormControl): ValidationResult {

        let hasUpper = /[A-Z]/.test(control.value);
              
        if (!hasUpper) {
            // return what´s not valid
            return { upper: true };
        }
        return null;
    }    
    
    public static lower(control: FormControl): ValidationResult {

        let hasLower = /[a-z]/.test(control.value);
              
        if (!hasLower) {
            // return what´s not valid
            return { lower: true };
        }
        return null;
    }      
    
    
}