import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WalletRoutingModule } from "@app/wallet/wallet.routes";
import { AppUIModule } from "@app/app.ui.module";
import { SharedModule } from "@app/shared/shared.module";
import { HeaderModule } from "@app/wallet/header/header.module";
import { WalletComponent } from "@app/wallet/wallet.component";
import { CoreModule } from "@app/core/core.module";

@NgModule({
    imports: [
        CommonModule,
        WalletRoutingModule,
        AppUIModule,
        SharedModule,
        HeaderModule,
        CoreModule
    ],
    declarations: [
        WalletComponent
    ],
    exports: [
        WalletComponent
    ]
})
export class WalletModule { }
