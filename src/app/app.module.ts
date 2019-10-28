import { NgModule, APP_INITIALIZER } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Ng2Webstorage } from 'ngx-webstorage';
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routes";
import { SharedModule } from "./shared/shared.module";
import { AppUIModule } from "./app.ui.module";
import { environment } from '@env/environment';
import { CoreModule } from "@app/core/core.module";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { AppConfigService } from "./core/app-config/app-config.service";

const appConfigInitializer = (appConfig: AppConfigService) => {
  return () => {
    return appConfig.loadAppConfig();
  };
};

export function createTranslateLoader(http: HttpClient) {
  const prefix = environment.isMobileBuild ? './assets/i18n/' : '../../assets/i18n/';
  return new TranslateHttpLoader(http, prefix, '.json');
}

@NgModule({
  imports: [
    CommonModule,
    CoreModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    Ng2Webstorage,
    HttpClientModule,
    HttpModule,
    AppRoutingModule,
    SharedModule,
    AppUIModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appConfigInitializer,
      multi: true,
      deps: [AppConfigService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
