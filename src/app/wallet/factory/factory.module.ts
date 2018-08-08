import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppUIModule } from '@app/app.ui.module';
import { SharedModule } from '@app/shared/shared.module';
import { SwapRoutingModule } from '@app/wallet/swap/swap.routes';
import { CoreModule } from '@app/core/core.module';
import { FactoryRoutingModule } from "./factory.routes";

import { CreateTokenComponent } from "./components/create-token/create-token.component";

@NgModule({
  entryComponents: [
    CreateTokenComponent
  ],
  imports: [
    FormsModule,
    AppUIModule,
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    SharedModule,
    FactoryRoutingModule
  ],
  declarations: [
    CreateTokenComponent
  ],
  exports: [
    CreateTokenComponent
  ]
})
export class FactoryModule { }
