import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { StorageService } from "@core/general/storage-service/storage.service";

declare const window: any;

@Injectable()
export class UniversalLinkService {

  constructor(private router: Router, private storageService: StorageService) { }

  init() {
    if(window.universalLinks) {
      window.universalLinks.subscribe(null, eventData => {
        const path = this.getUrlPath(eventData.url);
        const loggedIn = this.storageService.getSessionData('acc_address');
        if (!loggedIn) {
          this.storageService.setSessionData('universal_link', path);
        } else {
          this.router.navigateByUrl(path || '/');
        }
      });
    }
  }

  getLink(clear: boolean) {
    const link = this.storageService.getSessionData('universal_link');
    if(clear) {
      this.storageService.clearSessionData('universal_link');
    }
    return link;
  }

  private getUrlPath(urlStr): string {
    const url = new URL(urlStr);
    return url.pathname + url.search;
  }
}
