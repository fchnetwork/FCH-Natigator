import { ActivatedRouteSnapshot, Router, CanActivate } from "@angular/router";
import { Injectable } from "@angular/core";
import { StorageService } from "@core/general/storage-service/storage.service";
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {
  constructor(
    public authServ: AuthenticationService,
    private router: Router,
    public storageService: StorageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
      const registered = this.storageService.getCookie('aerum_keyStore');
      const loggedIn = this.storageService.getSessionData('acc_address');

      if(!registered) {
        this.router.navigate(['/account/register']);
        resolve(false);
      }
      else if(loggedIn) {
        resolve(true);
      }
      else {
        if(route.queryParams.query) {
          this.router.navigate(['/account/unlock'], { queryParams: { returnUrl: route.queryParams.query } });
        } else {
          this.router.navigate(['/account/unlock']);
        }
        resolve(false);
      }
    });
  }
}
