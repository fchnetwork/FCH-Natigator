import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "@env/environment";

@Injectable()
export class AppConfigService {
  private appConfig;

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    return this.http.get(environment.externalConfig)
      .toPromise()
      .then(data => {
        this.appConfig = data;
        if(!this.appConfig) {
          console.log('no external config provided, using default one');
          return;
        }
        console.log('using external config');
        Object.assign(environment, this.appConfig);
      })
      .catch(error => console.log('external config error', error));
  }

  getConfig() {
    return this.appConfig;
  }
}
