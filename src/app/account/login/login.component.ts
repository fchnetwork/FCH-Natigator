import { Component, NgZone, OnInit, Inject, ChangeDetectorRef, ElementRef, OnChanges, ViewChild, ChangeDetectionStrategy, ViewContainerRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'; 
import { AuthenticationService } from '../services/authentication-service/authentication.service';
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

  address: string;
  avatar: string;

  loginForm: FormGroup; 
  
        constructor(
          public authServ: AuthenticationService,
          private _router: Router,
          public formBuilder: FormBuilder,
          private cd: ChangeDetectorRef,
          public zone: NgZone ) {

    }



  countWords(s){
      s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
      s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
      s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
      // console.log(  s.split(' ').length ) 
      return s.split(' ').length; 
  }





  ngOnInit() {

    this.showLogin = true

		this.loginForm = this.formBuilder.group({
			seed: ["", [Validators.required ] ],
		});

  

    this.loginForm.valueChanges.subscribe( (v) => {

      const countSeed = this.countWords( v.seed )
console.log(countSeed)
      if ( countSeed == 12 ) {
        
        this.authServ.generateAddressLogin( v.seed  ).then( async res => {
          this.address = res.address
          this.avatar = res.avatar
        });

      }

      

   });

  }




  onSubmit() {

  }



}
