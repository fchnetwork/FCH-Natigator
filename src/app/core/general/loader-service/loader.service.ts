import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, finalize, map } from 'rxjs/operators';
import { LoggerService } from '@app/core/general/logger-service/logger.service';

@Injectable()
export class LoaderService implements HttpInterceptor {
    private loaderShownSource = new Subject<boolean>();
    public loaderShown$ = this.loaderShownSource.asObservable();

    constructor(public router: Router, private ngZone: NgZone, public logger: LoggerService) {
        router.events.subscribe((event: RouterEvent) => {
            this.interceptNavigation(event)
        })
    }

    public toggle(visible: boolean) { 
        this.loaderShownSource.next(visible);
    }

    private interceptNavigation(event: RouterEvent) { 
        if (event instanceof NavigationStart) {
            this.ngZone.runOutsideAngular(() => {
                this.loaderShownSource.next(true);
            })
        }
        if (event instanceof NavigationEnd) {
            this.loaderShownSource.next(false);
        }
        // Set loading state to false in both of the below events to
        // hide the spinner in case a request fails
        if (event instanceof NavigationCancel) {
            this.loaderShownSource.next(false);
        }
        if (event instanceof NavigationError) {
            this.loaderShownSource.next(false);
        }
    }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map(event => {
                this.loaderShownSource.next(true);
                return event;
            }),
            catchError(error => {
                this.loaderShownSource.next(false);
                return Observable.throw(error);
            }),
            finalize(() => { 
                this.loaderShownSource.next(false);
            })
        )
    }

}
