import { Component, ViewChild, EventEmitter, AfterViewChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '@app/core/authentication/authentication-service/authentication.service';
import { AccountIdleService } from '@app/core/authentication/account-idle-service/account-idle.service';
import { EnvironmentService } from "@core/general/environment-service/environment.service";

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements AfterViewChecked, OnDestroy {
  @ViewChild('sidebar') sidebar: any;
  viewLoaded$ = new EventEmitter<any>();
  sidebarLoaded$: EventEmitter<any>;
  routeData$: Subscription;

  isMobileBuild: boolean;

  constructor(
    private authService: AuthenticationService,
    public router: Router,
    private idle: AccountIdleService,
    public activeRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private environment: EnvironmentService
  ) {
    this.idle.startWatching();
    this.idle.onTimerStart().subscribe(count => {});
    this.idle.onTimeout().subscribe( () => {
      this.idle.stopWatching();
      this.logout();
    });

    // Expand correct sidebar group based on url
    this.routeData$ = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activeRoute)
      .map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .mergeMap(route => route.data)
      .subscribe(currentData => {
        if(this.sidebar.isToggled) {
          this.sidebar.toggleSidebar();
        }
        if (currentData && currentData.sidebarGroup) {
          this.viewLoaded$.subscribe(w => {
            this.sidebar.toggleGroup(currentData.sidebarGroup);
            this.viewLoaded$.complete();
          });
        }
      });

    this.isMobileBuild = this.environment.get().isMobileBuild;
  }

  logout() {
    this.authService.logout();
  }

  home() {
    this.router.navigate(['/wallet/home']);
  }

  settings() {
    this.router.navigate(['/wallet/settings']);
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
