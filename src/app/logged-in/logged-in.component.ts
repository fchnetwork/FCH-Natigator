import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/account/services/authentication-service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.component.html',
  styleUrls: ['./logged-in.component.scss']
})
export class LoggedInComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    public router: Router,
  ) { }

  logout() {
    this.authService.logout();
  }

  home() {
    this.router.navigate(['/dashboard']);
  }

  ngOnInit() {
  }

}
