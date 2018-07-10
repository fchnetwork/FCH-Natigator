import { CommonModule } from "@angular/common";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "@shared/shared.module";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { D3Service } from 'd3-ng2-service'; // <-- import the D3 Service, the type alias for the d3 variable and the Selection interface
import { AppUIModule } from "@app/app.ui.module";
import { CoreModule } from "@app/core/core.module";
import { SettingsComponent } from "@app/wallet/settings/settings.component";
import { SettingsRoutingModule } from "@app/wallet/settings/settings.routes";
import { DerivationPathComponent } from "@app/wallet/settings/components/derivation-path/derivation-path.component";
import { SettingsBackupComponent } from "@app/wallet/settings/components/settings-backup/settings-backup.component";
import { SettingsGeneralComponent } from "@app/wallet/settings/components/settings-general/settings-general.component";
import { SettingsTokenComponent } from "@app/wallet/settings/components/settings-token/settings-token.component";
import { SettingsTransactionsComponent } from "@app/wallet/settings/components/settings-transactions/settings-transactions.component";
import { SettingsSystemComponent } from "@app/wallet/settings/components/settings-system/settings-system.component";

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
    entryComponents: [],
    imports: [
        SettingsRoutingModule,
        FormsModule,
        AppUIModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        CoreModule
    ],
    declarations: [
        SettingsComponent,
        SettingsBackupComponent,
        DerivationPathComponent,
        SettingsGeneralComponent,
        SettingsTokenComponent,
        SettingsTransactionsComponent,
        SettingsSystemComponent
    ]
})

export class SettingsModule { }
