import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppUIModule } from '@app/app.ui.module';
import { SharedModule } from '@app/shared/shared.module'; 

import { CreateSwapComponent } from './components/create-swap/create-swap.component';
import { LoadSwapComponent } from './components/load-swap/load-swap.component';
import { CreateSwapConfirmComponent } from './components/create-swap/create-swap-confirm/create-swap-confirm.component';
import { LoadSwapConfirmComponent } from './components/load-swap/load-swap-confirm/load-swap-confirm.component';
import { SwapTokensListComponent } from './components/create-swap/swap-tokens-list/swap-tokens-list.component';
import { SwapRoutingModule } from '@app/wallet/swap/swap.routes';
import { CoreModule } from '@app/core/core.module';
 
@NgModule({
  entryComponents: [
    CreateSwapConfirmComponent,
    LoadSwapConfirmComponent
  ],
  imports: [
    FormsModule,
    AppUIModule,
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    SharedModule,
    SwapRoutingModule
  ],
  declarations: [
    CreateSwapComponent,
    LoadSwapComponent,
    CreateSwapConfirmComponent,
    LoadSwapConfirmComponent,
    SwapTokensListComponent
  ], 
  exports: [
    CreateSwapConfirmComponent,
    LoadSwapConfirmComponent
  ]
})
export class SwapModule { }