import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app.routes";

import { AccountModule } from "./account/account.module";
import { SharedModule } from "./shared/shared.module";
import { DashboardModule } from "./dashboard/dashboard.module";

import { AppUIModule } from "./app.ui.module";

import { ToastModule } from "ng2-toastr";
import { ExplorerModule } from "./explorer/explorer.module";

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserModule,
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
