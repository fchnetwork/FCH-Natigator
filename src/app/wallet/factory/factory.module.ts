import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppUIModule } from '@app/app.ui.module';
import { SharedModule } from '@app/shared/shared.module';
import { CoreModule } from '@app/core/core.module';
import { FactoryRoutingModule } from "./factory.routes";

import { CreateTokenComponent } from "./components/create-token/create-token.component";
import { CreateTokenConfirmModalComponent } from './components/create-token-confirm-modal/create-token-confirm-modal.component';

@NgModule({
  entryComponents: [
    CreateTokenComponent,
    CreateTokenConfirmModalComponent
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
    CreateTokenComponent,
    CreateTokenConfirmModalComponent
  ],
  exports: [
    CreateTokenComponent,
    CreateTokenConfirmModalComponent
  ]
})
export class FactoryModule { }
