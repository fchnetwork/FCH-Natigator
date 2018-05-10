import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { SessionStorageService } from "ngx-webstorage";
import { Cookie } from "ng2-cookies/ng2-cookies";

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