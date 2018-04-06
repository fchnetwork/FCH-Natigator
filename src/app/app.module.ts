import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, PreloadAllModules} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Entry Components
import { AppComponent } from './app.component';
import { LoginComponent } from './account/login/login.component';
import { RegistrationComponent } from './account/registration/registration.component';
// import { RegistrationDialog } from './account/registration/registration.dialog';
import { LandingPageComponent } from './account/landing-page/landing-page.component';
import { AvatarSelectComponent } from './account/components/avatar-select/avatar-select.component'
import { BasicModalComponent } from './shared/components/modals/basic-modal/basic-modal.component';
import { BackupConfirmationComponent } from './account/backup-confirmation/backup-confirmation.component';
import { BackupDisclamerComponent } from './account/backup-disclamer/backup-disclamer.component';
import { BackupCreateComponent } from './account/backup-create/backup-create.component';
import { BackupConfirmComponent } from './account/backup-confirm/backup-confirm.component';
import { AccessRecoveryComponent } from './account/access-recovery/access-recovery.component';

// Services 
import { AuthenticationService } from './account/services/authentication-service/authentication.service'
import { ClipboardService } from './account/services/clipboard-service/clipboard.service';
import { TransactionServiceService } from './account/services/transaction-service/transaction-service.service';
import { ModalService } from './shared/services/modal.service';


// Directives
import { ClipboardDirective } from './account/directives/clipboard-directive/clipboard.directive';

// Routes and Global CSS
import { ROUTES } from './app.routes'
import './app.global.scss'

// Module imports
import { AppUIModule } from './appUIModule.module';
// import { MaterialModule } from './shared/app.material.module';
import { SharedModule } from './shared/shared.module'
import { ExplorerModule } from './explorer/explorer.module'



import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CreateTransactionComponent } from './account/create-transaction/create-transaction.component'

// The translate loader needs to know where to load i18n files
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

import { CanActivateViaAuthGuard } from './app.guard';

import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';

import { TransactionSignModalComponent } from './account/components/transaction-sign-modal/transaction-sign-modal.component';

const modalComponents = [BasicModalComponent]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    LandingPageComponent,
    AvatarSelectComponent,
    ClipboardDirective,
    // RegistrationDialog,
    CreateTransactionComponent,
    modalComponents,
    TransactionSignModalComponent,
    BackupConfirmationComponent,
    BackupDisclamerComponent,
    BackupCreateComponent,
    BackupConfirmComponent,
    AccessRecoveryComponent
  ], 
  entryComponents: [
    modalComponents,
    TransactionSignModalComponent
   // RegistrationDialog
  ],   
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
   // MaterialModule,       
    BrowserAnimationsModule,
    BootstrapModalModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),    
    ToastModule.forRoot(),
    ExplorerModule.forRoot(),
    SharedModule.forRoot(),
    RouterModule.forRoot( ROUTES, 
      { 
        useHash: true,
        preloadingStrategy: PreloadAllModules
      }),
      AppUIModule,
    ModalModule.forRoot(),
    BootstrapModalModule   
  ],
  providers: [
    AuthenticationService,
    ClipboardService,
    ModalService,
    TransactionServiceService,
    CanActivateViaAuthGuard,
    ModalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
