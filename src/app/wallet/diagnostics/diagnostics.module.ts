import { CommonModule } from "@angular/common";
import { NgModule, ModuleWithProviders } from "@angular/core"; 
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "@shared/shared.module";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader"; 
import { AuthenticationService } from "@account/services/authentication-service/authentication.service"; 
import { ModalService } from "@shared/services/modal.service";  

import { D3Service } from 'd3-ng2-service'; // <-- import the D3 Service, the type alias for the d3 variable and the Selection interface
import { AppUIModule } from "@app/app.ui.module";
import { OverviewComponent } from "@app/wallet/diagnostics/overview/overview.component";
import { TestPageComponent } from "@app/wallet/diagnostics/test-page/test-page.component";
import { CanActivateViaAuthGuard } from "@app/app.guard";
import { AerumStatsService } from "@app/wallet/diagnostics/services/aerum-stats/aerum-stats.service";
import { AerumStatsWebsocketsService } from "@app/wallet/diagnostics/services/aerum-stats-websockets/aerum-stats-websockets.service";


export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
    entryComponents: [],
    imports: [
        FormsModule,
        AppUIModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
    ],
    declarations: [
        OverviewComponent,
        TestPageComponent
],
    providers: [
        AuthenticationService,
        ModalService,
        CanActivateViaAuthGuard,
        AerumStatsService,
        AerumStatsWebsocketsService,
        D3Service,
    ]
})

export class DiagnosticsModule {
    static forRoot(): ModuleWithProviders {
      return {
        ngModule: DiagnosticsModule,
        providers: [
            AerumStatsService,
            AerumStatsWebsocketsService
        ]
      };
    }
  }
  