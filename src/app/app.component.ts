import { Component, OnInit } from "@angular/core";
import { environment } from "../environments/environment";
import { ActivatedRoute, Router, NavigationStart } from "@angular/router";
import { LoggerService } from "@app/core/general/logger-service/logger.service";
import { LogLevel } from "@app/core/general/logger-service/log-level.enum";
import { ConnectionCheckerService } from "@core/general/connection-checker-service/connection-checker.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "app";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private logger: LoggerService,
    public connectionCheckerService: ConnectionCheckerService,
    public translate: TranslateService
  ) {
    // Initialize the logger service
    logger.setLogLevel(environment.loglevel);

    // Configure the translation service.
    this.translate.setDefaultLang("en");
    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use("en"); // Set your language here
    }

    router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  ngOnInit() {
    this.logger.logMessage(`Current Env: ${environment.configInUse}`);
    this.logger.logMessage(
      `Current WebsocketProvider: ${environment.WebsocketProvider}`
    );
  }
}
