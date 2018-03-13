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
import { RegistrationDialog } from './account/registration/registration.dialog';
import { LandingPageComponent } from './account/landing-page/landing-page.component';
import { AvatarSelectComponent } from './account/components/avatar-select/avatar-select.component'

// Services 
import { AuthenticationService } from './account/services/authentication-service/authentication.service'
import { ClipboardService } from './account/services/clipboard-service/clipboard.service';

// Directives
import { ClipboardDirective } from './account/directives/clipboard-directive/clipboard.directive';

// Routes and Global CSS
import { ROUTES } from './app.routes'
import './app.global.scss'

// Module imports
import { MaterialModule } from './shared/app.material.module';
import { SharedModule } from './shared/shared.module'
import { ExplorerModule } from './explorer/explorer.module'

// other libraries
import { FlexLayoutModule } from '@angular/flex-layout';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// The translate loader needs to know where to load i18n files
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    LandingPageComponent,
    AvatarSelectComponent,
    ClipboardDirective,
    RegistrationDialog
  ], 
  entryComponents: [
    RegistrationDialog
  ],   
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule, 
    MaterialModule,       
    BrowserAnimationsModule,
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
  ],
  providers: [
    AuthenticationService,
    ClipboardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
