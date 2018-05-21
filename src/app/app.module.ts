import { NgModule } from "@angular/core";
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

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    Ng2Webstorage,
    HttpClientModule,
    HttpModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    AppUIModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
