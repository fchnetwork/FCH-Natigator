import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, AfterViewChecked, ChangeDetectorRef, OnDestroy, AfterContentInit, AfterContentChecked } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRoute, NavigationEnd, Data } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html'
})
export class WalletComponent implements AfterViewChecked, OnDestroy {
  @ViewChild('sidebar') sidebar: any;
  viewLoaded$ = new EventEmitter<any>();
  sidebarLoaded$: EventEmitter<any>;
  routeData$: Subscription;

  constructor(
    private authService: AuthenticationService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef
  ) {
    this.routeData$ = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activeRoute)
      .map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .mergeMap(route => route.data)
      .subscribe(currentData => {
        if (currentData && currentData.sidebarGroup) {
          console.log('Selected the ' + currentData.sidebarGroup + ' group');

          this.viewLoaded$.subscribe(w => {
            console.log('view loaded');
            this.sidebar.toggleGroup(currentData.sidebarGroup); 
            this.viewLoaded$.complete();
          });
        }
      });
  }

  logout() {
    this.authService.logout();
  }

  home() {
    this.router.navigate(['/wallet/home']);
  }

  ngAfterViewChecked() {
    // Preventing Angular ExpressionChangedAfterItHasBeenCheckedError.
    this.changeDetector.detectChanges();

    if (this.sidebarLoaded$ == null) {
      this.sidebarLoaded$ = this.sidebar.sidebarLoaded.subscribe(w => { 
        this.viewLoaded$.emit();
        this.sidebarLoaded$.complete();
      });
    }
  }

  ngOnDestroy() {
    this.viewLoaded$.unsubscribe();
    this.sidebarLoaded$.unsubscribe();
    this.routeData$.unsubscribe();
  }
}
