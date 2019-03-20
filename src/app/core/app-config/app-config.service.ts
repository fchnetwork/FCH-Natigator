import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "@env/environment";
import { LoggerService } from "@core/general/logger-service/logger.service";

@Injectable()
export class AppConfigService {
  private appConfig;

  constructor(private http: HttpClient, private logger: LoggerService) { }

  loadAppConfig() {
    if (!environment.externalConfig) {
      this.logger.logMessage('No external config to load');
      return;
    }

    return this.http.get(environment.externalConfig)
      .toPromise()
      .then(data => {
        this.appConfig = data;
        if(!this.appConfig) {
          this.logger.logMessage('no external config provided, using default one');
          return;
        }
        this.logger.logMessage('using external config');
        Object.assign(environment, this.appConfig);
      })
      .catch(error => this.logger.logError('external config error', error));
  }
}
