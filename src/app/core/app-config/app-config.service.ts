import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from "@core/general/environment-service/environment.service";
import { LoggerService } from "@core/general/logger-service/logger.service";

@Injectable()
export class AppConfigService {
  private appConfig;

  constructor(
    private http: HttpClient,
    private logger: LoggerService,
    private environment: EnvironmentService) { }

  loadAppConfig() {
    if (!this.environment.get().externalConfig) {
      this.logger.logMessage('No external config to load');
      return;
    }

    return this.http.get(this.environment.get().externalConfig)
      .toPromise()
      .then(data => {
        this.appConfig = data;
        if(!this.appConfig) {
          this.logger.logMessage('no external config provided, using default one');
          return;
        }
        this.logger.logMessage('using external config');
        Object.assign(this.environment.get(), this.appConfig);
      })
      .catch(error => this.logger.logError('external config error', error));
  }
}
