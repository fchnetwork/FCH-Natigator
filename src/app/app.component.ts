import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { AccountIdleService } from '@app/core/authentication/account-idle-service/account-idle.service';
import { LoggerService } from '@app/core/general/logger-service/logger.service';
import { LogLevel } from '@app/core/general/logger-service/log-level.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app'; 

  constructor
    (
    private idle: AccountIdleService,
    private route: ActivatedRoute,
    private router: Router,
    private logger: LoggerService
    ) {
    logger.setLogLevel(LogLevel.All);
  }

  ngOnInit() {
    //Start watching for user inactivity.
    this.idle.startWatching();

    // Start watching when user idle is starting.
    this.idle.onTimerStart().subscribe(count => console.log(count));

    // Start watch when time is up.
    this.idle.onTimeout().subscribe(() => console.log('Time is up!'));

    this.logger.logMessage(`Current Env: ${environment.configInUse}`);
    this.logger.logMessage(`Current HttpProvider: ${environment.HttpProvider}`);

  }
}
