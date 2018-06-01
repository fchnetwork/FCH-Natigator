import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { ExternalRoutingModule } from "@app/external/external.routes";
import { ExternalTransactionComponent } from "@app/external/external-transaction/external-transaction.component";
import { AppUIModule } from "@app/app.ui.module";
import { SharedModule } from "@app/shared/shared.module";
import { EthereumWalletComponent } from './ethereum-wallet/ethereum-wallet.component';

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
    ]
})
export class ExternalModule { }
