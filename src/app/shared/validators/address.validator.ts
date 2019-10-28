import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { AerumNameService } from "@core/aens/aerum-name-service/aerum-name.service";

@Injectable()
export class AddressValidator {

  private static nameService: AerumNameService;

  constructor(nameService: AerumNameService) {
    AddressValidator.nameService = nameService;
  }

  static isAddress(control: AbstractControl) {
    if (!control.value) {
      return { empty: true };
    }
    if (!new RegExp('^(0x)[0-9a-fA-F]{40}$').test(control.value)) {
      return { invalid: true };
    }
    return null;
  }

   isAddressOrAensName(control: AbstractControl) : Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
       return new Promise((resolve, reject) => {
         const value = control.value as string;
         if (!value) {
           return resolve({ empty: true });
         }

         if(value.startsWith('0x')) {
           if (!new RegExp('^(0x)[0-9a-fA-F]{40}$').test(control.value)) {
             return resolve({ invalid: true });
           }
           return resolve(null);
         }

         if (!value.endsWith('.f')) {
           return resolve({ invalid: true });
         }

         return AddressValidator.nameService.ensureNameCanBeResolved(value)
           .then(resolved => {
             if(resolved) {
               resolve(null);
             } else {
               resolve({ unresolvable: true });
             }
           })
           .catch(reject);
       });
   }
}
