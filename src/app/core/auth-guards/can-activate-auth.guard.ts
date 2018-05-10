import { ActivatedRouteSnapshot, Router, CanActivate } from "@angular/router";
import { SessionStorageService } from "ngx-webstorage";
import { AuthenticationService } from "@app/core/authentication-service/authentication.service";
import { Injectable } from "@angular/core";
import { Cookie } from "ng2-cookies/ng2-cookies";

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {

    constructor( 
        public authServ: AuthenticationService,
        private router: Router,
        public sessionStorageService: SessionStorageService,
    ) {}

        canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
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
                    if(route.queryParams.query) {
                        this.router.navigate(['/account/unlock'], { queryParams: { query: route.queryParams.query } });
                    } else {
                        this.router.navigate(['/account/unlock']);
                    }
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