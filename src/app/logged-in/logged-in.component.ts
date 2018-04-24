import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';

@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.component.html',
  styleUrls: ['./logged-in.component.scss']
})
export class LoggedInComponent implements OnInit {

  constructor(
    private authService: AuthenticationService
  ) { }

  logout() {
    this.authService.logout();
  }

  ngOnInit() {
  }

}
