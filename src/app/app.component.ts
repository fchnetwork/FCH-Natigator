import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from './account/services/authentication-service/authentication.service';
import { AccountIdleService } from './shared/services/account-idle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(
    public authServ: AuthenticationService,
    private idle: AccountIdleService,
    private translate: TranslateService) {
    this.initTranslate();

    this.authServ.authState().subscribe(res => {
      // this.router.navigate(['/transaction']); 
    },
      err => console.log(err));
  }

  ngOnInit() {
        //Start watching for user inactivity.
        this.idle.startWatching();
    
        // Start watching when user idle is starting.
        this.idle.onTimerStart().subscribe(count => console.log(count));
        
        // Start watch when time is up.
        this.idle.onTimeout().subscribe(() => console.log('Time is up!'));
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
