import { Component,Input, Injectable  } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './account/services/authentication-service/authentication.service';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

    constructor( 
        public authServ: AuthenticationService,
        private router: Router
    ) {}

        canActivate(): Promise<boolean> {
            return new Promise((resolve) => {
                const loggedIn = sessionStorage.getItem('acc_address');
                if(loggedIn) {
                    resolve(true);
                } else {
                    this.router.navigate(['/account/login']);
                    resolve(false);
                }
                // DON'T DELETE
                // this.authServ.showKeystore()
                // .then(  ( keystore: any) => {
                //     resolve(true);
                // })
                // .catch( () => {
                //    this.router.navigate(['/account/login']);
                //     resolve(false);
                // });
            });
        }

}


