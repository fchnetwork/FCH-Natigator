import { Component,Input, Injectable  } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { AuthenticationService } from './account/services/authentication-service/authentication.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

    constructor( 
        public authServ: AuthenticationService,
        private router: Router,
        public sessionStorageService: SessionStorageService,
    ) {}

        canActivate(): Promise<boolean> {
            return new Promise((resolve) => {
                const registered = Cookie.get('aerum_keyStore');
                const loggedIn = this.sessionStorageService.retrieve('acc_address');
                
                if(!registered) {
                    this.router.navigate(['/account/register']);
                    resolve(false);
                }
                else if(loggedIn) {
                    resolve(true);
                } 
                else {
                    this.router.navigate(['/account/unlock']);
                    resolve(false);
                }
                // DON'T DELETE
                // this.authServ.showKeystore()
                // .then(  ( keystore: any) => {
                //     resolve(true);
                // })
                // .catch( () => {
                //    this.router.navigate(['/account/unlock']);
                //     resolve(false);
                // });
            });
        }

}
@Injectable()
export class CanActivateAccountAuthGuard implements CanActivate {

    constructor( 
        private router: Router,
        public sessionStorageService: SessionStorageService,
    ) {}

        canActivate(): Promise<boolean> {
            return new Promise((resolve) => {
                const registered = Cookie.get('aerum_keyStore');
                const loggedIn = this.sessionStorageService.retrieve('acc_address');
                
                if(!registered) {
                    this.router.navigate(['/account/register']);
                    resolve(false);
                }
                else if(loggedIn) {
                    this.router.navigate(['/dashboard']);
                    resolve(false);
                } 
                else {
                    resolve(true);
                }
            });
        }

}


