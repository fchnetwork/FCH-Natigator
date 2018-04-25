import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppUIModule } from '@app/app.ui.module';
import { SharedModule } from '@app/shared/shared.module';

import { AeroToErc20SwapService } from '@app/swap/services/aero-to-erc20/aero-to-erc20-swap.service';
import { Erc20ToErc20SwapService } from '@app/swap/services/erc20-to-erc20/erc20-to-erc20-swap.service';
import { CreateSwapComponent } from '@app/swap/components/create-swap/create-swap.component';
import { LoadSwapComponent } from './components/load-swap/load-swap.component';
import { CreateSwapConfirmComponent } from './components/create-swap/create-swap-confirm/create-swap-confirm.component';
import { LoadSwapConfirmComponent } from './components/load-swap/load-swap-confirm/load-swap-confirm.component';
import { SwapTokensListComponent } from './components/create-swap/swap-tokens-list/swap-tokens-list.component';

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
    CreateSwapComponent,
    LoadSwapComponent,
    CreateSwapConfirmComponent,
    LoadSwapConfirmComponent,
    SwapTokensListComponent
  ],
  providers: [
    AeroToErc20SwapService,
    Erc20ToErc20SwapService
  ]
})
export class SwapModule { }