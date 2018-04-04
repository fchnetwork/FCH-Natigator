import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './account/services/authentication-service/authentication.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(
    public authServ: AuthenticationService,
    private router: Router,
    private translate: TranslateService){
    this.initTranslate()



    this.authServ.authState().subscribe( res => { 
     // this.router.navigate(['/transaction']); 
    },
      err => console.log(err) ); 

    
  }




  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }

  }


}
