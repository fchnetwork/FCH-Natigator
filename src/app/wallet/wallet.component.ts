import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '@app/core/authentication-service/authentication.service';
import { promise } from 'protractor';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent { 

  constructor(
    private authService: AuthenticationService,
    public router: Router,
    public activeRoute: ActivatedRoute
  ) { }

  logout() {
    this.authService.logout();
  }

  home() {
    this.router.navigate(['/dashboard']);
  }  
}
