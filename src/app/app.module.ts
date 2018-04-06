import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { HttpModule } from "@angular/http"; 
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routes";

import { AccountModule } from "./account/account.module";
import { SharedModule } from "./shared/shared.module";
import { DashboardModule } from "./dashboard/dashboard.module";

import { AppUIModule } from "./app.ui.module";

import { ToastModule } from "ng2-toastr";
import { ExplorerModule } from "./explorer/explorer.module"; 
import { TranslateHttpLoader } from "@ngx-translate/http-loader"; 
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
 

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    // aerumWALLET modules
    AccountModule,
    SharedModule,
    DashboardModule.forRoot(),
    // aerumUI modules
    AppUIModule,
    // MISC modules
    ToastModule.forRoot(),
    ExplorerModule.forRoot()
  ], 
  declarations: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
