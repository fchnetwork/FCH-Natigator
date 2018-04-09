import { Component,Input, Injectable  } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './account/services/authentication-service/authentication.service';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

    constructor( public authServ: AuthenticationService, private router: Router) {
    }

    canActivate() {
      return  this.authServ.showKeystore().then( v => {
            if (v) {
                // Successfully authenticated
                return true;
            } 
            else {
                this.router.navigate(['/account/login']);
                return false;
            }
          });
   }
}


