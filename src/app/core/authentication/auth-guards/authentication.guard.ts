import { LoggerService } from "@app/core/general/logger-service/logger.service";
import { StorageService } from "@core/general/storage-service/storage.service";
import {
  ActivatedRouteSnapshot,
  Router,
  CanActivate,
  RouterStateSnapshot
} from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "@app/core/authentication/authentication-service/authentication.service";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  registerUrl = "/account/register";
  unlockUrl = "/account/unlock";

  constructor(
    public authServ: AuthenticationService,
    private router: Router,
    public storageService: StorageService,
    public logger: LoggerService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        this.logger.logMessage('[AuthGuard] - processing url ' + state.url);

        const keyStore = this.storageService.getStorage("aerum_keyStore");
        const loggedIn = this.storageService.getSessionData("acc_address");

        if (!keyStore) {
          // user doesn't have an account created
          this.router.navigate([this.registerUrl], {
            queryParams: { returnUrl: state.url }
          });

          this.logger.logMessage('[AuthGuard] - redirecting to ' + this.registerUrl);

          resolve(false);
          return;
        }

        if (!loggedIn) {
          this.router.navigate([this.unlockUrl], {
            queryParams: { returnUrl: state.url }
          });

          this.logger.logMessage('[AuthGuard] - redirecting to ' + this.unlockUrl);

          resolve(false);
          return;
        }

        resolve(true);
      } catch (e) {
        this.logger.logError("[AuthGuard] - Error", e);
        reject(e);
      }
    });
  }
}
