import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppUIModule } from '@app/app.ui.module';
import { SharedModule } from '@app/shared/shared.module';

import { AeroToErc20SwapServiceService } from '@app/swap/services/aero-to-erc20/aero-to-erc20-swap-service.service';
import { Erc20ToErc20SwapServiceService } from '@app/swap/services/erc20-to-erc20/erc20-to-erc20-swap-service.service';

import { AeroToErc20Component } from './components/aero-to-erc20/aero-to-erc20.component';
import { AeroToErc20SwapCreateComponent } from './components/aero-to-erc20/aero-to-erc20-swap-create/aero-to-erc20-swap-create.component';
import { AeroToErc20SwapManageComponent } from './components/aero-to-erc20/aero-to-erc20-swap-manage/aero-to-erc20-swap-manage.component';

import { Erc20ToAeroComponent } from './components/erc20-to-aero/erc20-to-aero.component';
import { Erc20ToAeroSwapCreateComponent } from './components/erc20-to-aero/erc20-to-aero-swap-create/erc20-to-aero-swap-create.component';
import { Erc20ToAeroSwapManageComponent } from './components/erc20-to-aero/erc20-to-aero-swap-manage/erc20-to-aero-swap-manage.component';

import { Erc20ToErc20Component } from './components/erc20-to-erc20/erc20-to-erc20.component';
import { Erc20ToErc20SwapCreateComponent } from './components/erc20-to-erc20/erc20-to-erc20-swap-create/erc20-to-erc20-swap-create.component';
import { Erc20ToErc20SwapManageComponent } from './components/erc20-to-erc20/erc20-to-erc20-swap-manage/erc20-to-erc20-swap-manage.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  imports: [
    FormsModule,
    AppUIModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    AeroToErc20Component,
    AeroToErc20SwapCreateComponent,
    AeroToErc20SwapManageComponent,
    Erc20ToAeroComponent,
    Erc20ToAeroSwapCreateComponent,
    Erc20ToAeroSwapManageComponent,
    Erc20ToErc20Component,
    Erc20ToErc20SwapCreateComponent,
    Erc20ToErc20SwapManageComponent
  ],
  providers: [
    AeroToErc20SwapServiceService,
    Erc20ToErc20SwapServiceService
  ]
})
export class SwapModule { }