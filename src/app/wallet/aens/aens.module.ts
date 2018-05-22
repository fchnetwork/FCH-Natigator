import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppUIModule } from '@app/app.ui.module';
import { SharedModule } from '@app/shared/shared.module';
import { AensRoutingModule } from '@app/wallet/aens/aens.routes';
import { CoreModule } from '@app/core/core.module';

import { AensContractManageComponent } from './components/aens-contract-manage/aens-contract-manage.component';
import { AensDashboardComponent } from './components/aens-dashboard/aens-dashboard.component';
import { NameBuyConfirmComponent } from './components/name-buy-confirm/name-buy-confirm.component';
import { NameUpdateAddressConfirmComponent } from './components/name-update-address-confirm/name-update-address-confirm.component';
import { NameBuyComponent } from './components/name-buy/name-buy.component';
import { NameUpdateComponent } from './components/name-update/name-update.component';
import { NameReleaseConfirmComponent } from './components/name-release-confirm/name-release-confirm.component';
import { NameCheckComponent } from './components/name-check/name-check.component';
import { NameStatusComponent } from './components/name-status/name-status.component';
import { NameTransferConfirmComponent } from './components/name-transfer-confirm/name-transfer-confirm.component';

@NgModule({
  entryComponents: [
    AensDashboardComponent,
    NameBuyConfirmComponent,
    NameUpdateComponent,
    NameUpdateAddressConfirmComponent,
    NameTransferConfirmComponent,
    NameReleaseConfirmComponent
  ],
  imports: [
    FormsModule,
    AppUIModule,
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    AensRoutingModule
  ],
  declarations: [
    AensDashboardComponent,
    NameBuyConfirmComponent,
    AensContractManageComponent,
    NameUpdateComponent,
    NameBuyComponent,
    NameUpdateComponent,
    NameCheckComponent,
    NameStatusComponent,
    NameUpdateAddressConfirmComponent,
    NameTransferConfirmComponent,
    NameReleaseConfirmComponent
  ],
  exports: [
    AensDashboardComponent,
    NameBuyConfirmComponent,
    NameUpdateComponent,
    NameUpdateAddressConfirmComponent,
    NameTransferConfirmComponent,
    NameReleaseConfirmComponent
  ]
})
export class AensModule { }
