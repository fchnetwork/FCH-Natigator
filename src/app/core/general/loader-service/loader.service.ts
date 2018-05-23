import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, finalize, map } from 'rxjs/operators';
import { LoggerService } from '@app/core/general/logger-service/logger.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LoaderService {
    public loaderShown$ = new BehaviorSubject<boolean>(false);
    private instanceId = Math.random() * 1000;

    constructor(public router: Router, private ngZone: NgZone, public logger: LoggerService) {
        router.events.subscribe((event: RouterEvent) => {
            this.interceptNavigation(event)
        })
    }

    public toggle(visible: boolean) {
        this.loaderShown$.next(visible);
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
