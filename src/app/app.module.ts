import { NgModule, ErrorHandler } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Ng2Webstorage } from 'ngx-webstorage';
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routes";
import { AccountModule } from "./account/account.module";
import { SharedModule } from "./shared/shared.module";
import { AppUIModule } from "./app.ui.module";
import { CoreModule } from "@app/core/core.module";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../assets/i18n/', '.json');
}


class MyErrorHandler implements ErrorHandler {
  handleError(error) {
    console.log('Router Error');
    console.log(error);
  }
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
  providers: [{provide: ErrorHandler, useClass: MyErrorHandler}],
  bootstrap: [AppComponent]
})
export class AppModule { }
