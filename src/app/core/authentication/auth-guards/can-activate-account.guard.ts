import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { StorageService } from "@core/general/storage-service/storage.service";

@Injectable()
export class CanActivateAccountAuthGuard implements CanActivate {
  constructor( 
    private router: Router,
    public storageService: StorageService
  ) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      const registered = this.storageService.getCookie('aerum_keyStore');
      const loggedIn = this.storageService.getSessionData('acc_address');
      if(!registered || registered === 'null') {
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