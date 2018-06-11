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
import { SettingsBackupComponent } from "@app/wallet/settings/components/settingsBackup/settingsBackup.component";
import { SettingsComponent } from "@app/wallet/settings/components/settings/settings.component";
import { SettingsRoutingModule } from "@app/wallet/settings/settings.routes";
import { FullBackupComponent } from "@app/wallet/settings/components/fullBackup/fullBackup.component";
import { SimpleBackupComponent } from "@app/wallet/settings/components/simpleBackup/simpleBackup.component";


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
        FullBackupComponent,
        SimpleBackupComponent,
    ]
})

export class SettingsModule { }
