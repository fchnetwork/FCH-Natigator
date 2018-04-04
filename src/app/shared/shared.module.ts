import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Error404Component } from './components/error404/error404.component'

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { I18nComponent } from './components/i18n/i18n.component'

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ModalService } from './services/modal.service';
import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { BasicModalComponent } from './components/modals/basic-modal/basic-modal.component';
import { DividerComponent } from './components/divider/divider.component';

// The translate loader needs to know where to load i18n files
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}


@NgModule({
  entryComponents: [
    BasicModalComponent
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    BootstrapModalModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),    
  ],
  declarations: [
    I18nComponent,
    Error404Component,
    DividerComponent
  ],
  providers: [
    ModalService
  ],
  exports:[
    I18nComponent,
    DividerComponent
  ]
})

export class SharedModule { }