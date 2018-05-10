import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppUIModule } from '@app/app.ui.module';
import { SharedModule } from '@app/shared/shared.module';

import { AerumNameService } from './services/aerum-name.service';

import { ManageAerumNamesComponent } from './components/manage-aerum-names/manage-aerum-names.component';
import { AerunNameBuyConfirmComponent } from './components/aerun-name-buy-confirm/aerun-name-buy-confirm.component';
import { ManageAensContractComponent } from './components/manage-aens-contract/manage-aens-contract.component';
import { AensRegistryContractService } from '@app/aens/services/aens-registry-contract.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  entryComponents: [
    ManageAerumNamesComponent,
    AerunNameBuyConfirmComponent
  ],
  imports: [
    FormsModule,
    AppUIModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ManageAerumNamesComponent,
    AerunNameBuyConfirmComponent,
    ManageAensContractComponent
  ],
  exports: [
    ManageAerumNamesComponent,
    AerunNameBuyConfirmComponent
  ],
  providers: [
    AerumNameService,
    AensRegistryContractService
  ]
})
export class AensModule { }
