import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user: any = {}
  public showLogin: boolean = false

  constructor( private _router: Router,
              // private _loginService: LoginService
              ) {}

  ngOnInit() {
    this.showLogin = true
    // this._loginService.loginToken()
    //   .then(res => {
    //     this._router.navigate(['/module'])
    //   })
    //   .catch(err => {
    //     // No token in localStorage, should go local authentication way
    //     this.showLogin = true
    //   })
  }

  onSubmit() {
    // this._loginService.loginLocal(this.user)
    //   .then(res => {
    //     this._router.navigate(['/module'])
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }



}
