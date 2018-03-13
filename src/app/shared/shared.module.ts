import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Error404Component } from './components/error404/error404.component'

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { I18nComponent } from './components/i18n/i18n.component'

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// The translate loader needs to know where to load i18n files
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}


@NgModule({
  imports: [
    CommonModule,
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
    Error404Component
  ],
  exports:[
    I18nComponent
  ]
})

export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
      ]
    };
  }
}