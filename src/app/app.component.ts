import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { LoggerService } from '@app/core/general/logger-service/logger.service';
import { LogLevel } from '@app/core/general/logger-service/log-level.enum';
import { ConnectionCheckerService } from '@core/general/connection-checker-service/connection-checker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app'; 

  constructor
    (
    private route: ActivatedRoute,
    private router: Router,
    private logger: LoggerService,
    public connectionCheckerService: ConnectionCheckerService
    ) {
    logger.setLogLevel(LogLevel.All);
  }

  ngOnInit() {
    this.logger.logMessage(`Current Env: ${environment.configInUse}`);
    this.logger.logMessage(`Current WebsocketProvider: ${environment.WebsocketProvider}`);
  }
}
