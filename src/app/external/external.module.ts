import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from "@core/core.module";
import { ExternalRoutingModule } from "@app/external/external.routes";
import { AppUIModule } from "@app/app.ui.module";
import { SharedModule } from "@app/shared/shared.module";
import { ExternalTransactionComponent } from "@app/external/external-transaction/external-transaction.component";
import { PaymentGatewayWizardComponent } from './payment-gateway-wizard/payment-gateway-wizard.component';
import { EthereumWalletComponent } from './payment-gateway-wizard-steps/ethereum-wallet/ethereum-wallet.component';
import { SwapCreateComponent } from './payment-gateway-wizard-steps/swap-create/swap-create.component';
import { SwapConfirmComponent } from './payment-gateway-wizard-steps/swap-confirm/swap-confirm.component';

@NgModule({
    entryComponents: [
        ExternalTransactionComponent,
        EthereumWalletComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        SharedModule,
        ExternalRoutingModule,
        AppUIModule,
        CoreModule
    ],
    declarations: [
        ExternalTransactionComponent,
        EthereumWalletComponent,
        PaymentGatewayWizardComponent,
        SwapCreateComponent,
        SwapConfirmComponent,
    ]
})
export class ExternalModule { }
