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
                console.log("authenticated", v)
                return true
            } else {
                this.router.navigate(['/no-account']);
                return false
            }
          })
   }
}


