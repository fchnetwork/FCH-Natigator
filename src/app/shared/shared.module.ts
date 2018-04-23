import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Error404Component } from './components/error404/error404.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { I18nComponent } from './components/i18n/i18n.component'; 
import { ModalService } from './services/modal.service';
import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { BasicModalComponent } from './components/modals/basic-modal/basic-modal.component';
import { DividerComponent } from './components/divider/divider.component';
import { TranslatePipe, TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EqualValidator } from './directives/equal-validator.directive';
import { RouteDataService } from './services/route-data.service'; 
import { NotificationService } from './services/notification.service';
import { ClipboardService } from './services/clipboard.service';
import { AccountIdleService } from './services/account-idle.service';
import { SidebarHeaderComponent } from '@app/shared/components/sidebar-header/sidebar-header.component';
import { TransactionTimeAgoPipe } from '@shared/pipes/transaction-time-ago.pipe';
import { TransactionTimeStampPipe } from '@shared/pipes/transaction-time-stamp.pipe';
import { HexToTextPipe } from '@shared/pipes/hex-to-text.pipe';
import { SafeResourceUrlPipe } from '@shared/pipes/safeResourceUrl.pipe'
import { GenerateAvatarPipe } from '@app/shared/pipes/generate-avatar.pipe';
import { OrderbyPipe } from '@shared/pipes/orderby.pipe'
import { ConvertToEtherPipe } from '@shared/pipes/convertToEther.pipe'

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../../assets/i18n/', '.json');
}

@NgModule({
  entryComponents: [],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    I18nComponent,
    Error404Component,
    DividerComponent,
    EqualValidator,
    SidebarHeaderComponent,
    TransactionTimeAgoPipe,
    TransactionTimeStampPipe,
    HexToTextPipe,
    SafeResourceUrlPipe,
    GenerateAvatarPipe,
    OrderbyPipe,
    ConvertToEtherPipe,
  ],
  providers: [
    ModalService,
    RouteDataService,
    ClipboardService,
    NotificationService,
    AccountIdleService,
  ],
  exports:[
    I18nComponent,
    DividerComponent,
    TranslateModule,
    EqualValidator,
    SidebarHeaderComponent,
    TransactionTimeAgoPipe,
    TransactionTimeStampPipe,
    HexToTextPipe,
    SafeResourceUrlPipe,
    GenerateAvatarPipe,
    OrderbyPipe,
    ConvertToEtherPipe,
  ]
})

export class SharedModule { 
  /**
   * Creates an instance of SharedModule.
   * @param  {TranslateService} translate 
   * @memberof SharedModule
   */
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('en'); // Set your language here
    }
  }
}