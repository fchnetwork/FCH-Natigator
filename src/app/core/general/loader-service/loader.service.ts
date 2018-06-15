import { Injectable } from '@angular/core';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LoggerService } from '@app/core/general/logger-service/logger.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LoaderService {
    public loaderShown$ = new BehaviorSubject<any>(false);

    constructor(public router: Router, public logger: LoggerService) {
        router.events.subscribe((event: RouterEvent) => {
            this.interceptNavigation(event);
        });
    }

    public toggle(visible: boolean, message?:string) {
        this.loaderShown$.next({visible: visible, message: message});
    }

    private interceptNavigation(event: RouterEvent) {
        if (event instanceof NavigationStart) {
            this.toggle(true);
        }

        if (event instanceof NavigationEnd) {
            this.toggle(false);
        }
        if (event instanceof NavigationCancel) {
            this.toggle(false);
        }
        if (event instanceof NavigationError) {
            this.toggle(false);
        }
    }
}
