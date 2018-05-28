import { CommonModule } from "@angular/common";
import { NgModule, ModuleWithProviders } from "@angular/core";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastModule } from "ng2-toastr";
import { TranslateModule } from "@ngx-translate/core";
import { TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { ExternalRoutingModule } from "@app/external/external.routes";
import { ExternalTransactionComponent } from "@app/external/external-transaction/external-transaction.component";
import { AppUIModule } from "@app/app.ui.module";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
    entryComponents: [
        ExternalTransactionComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        ExternalRoutingModule,
        AppUIModule,
    ],
    declarations: [
        ExternalTransactionComponent,
    ]
})
export class ExternalModule { }
