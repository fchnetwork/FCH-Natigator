import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/authentication-service/authentication.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
    public router: Router,
  ) { 
  }

  logout() {
    this.authService.logout();
  }

  home() {
    this.router.navigate(['/dashboard']);
  }

  ngOnInit() {
  }

}
