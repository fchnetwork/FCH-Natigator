import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { ExternalRoutingModule } from "@app/external/external.routes";
import { ExternalTransactionComponent } from "@app/external/external-transaction/external-transaction.component";
import { AppUIModule } from "@app/app.ui.module";
import { SharedModule } from "@app/shared/shared.module";
import { EthereumWalletComponent } from './ethereum-wallet/ethereum-wallet.component';
import { PaymentGatewayWizardComponent } from './payment-gateway-wizard/payment-gateway-wizard.component';

@NgModule({
    entryComponents: [
        ExternalTransactionComponent,
        EthereumWalletComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ExternalRoutingModule,
        AppUIModule,
    ],
    declarations: [
        ExternalTransactionComponent,
        EthereumWalletComponent,
        PaymentGatewayWizardComponent,
    ]
})
export class ExternalModule { }
