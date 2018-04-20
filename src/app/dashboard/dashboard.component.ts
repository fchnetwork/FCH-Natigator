import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private authService: AuthenticationService
  ) { }

  logout() {
    this.authService.logout();
  }
  
  ngOnInit() {
  }

}
