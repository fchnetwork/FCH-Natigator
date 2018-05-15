import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WalletRoutingModule } from "@app/wallet/wallet.routes";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppUIModule } from "@app/app.ui.module";
import { SharedModule } from "@app/shared/shared.module";
import { WalletComponent } from "@app/wallet/wallet.component";
import { CoreModule } from "@app/core/core.module";

@NgModule({
    imports: [
        CommonModule,
        WalletRoutingModule, 
        AppUIModule,
        SharedModule,
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