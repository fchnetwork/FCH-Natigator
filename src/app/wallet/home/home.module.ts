import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { CurrentUserDisplayComponent } from './current-user-display/current-user-display.component';
import { RouterModule } from '@angular/router'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { AppUIModule } from '@app/app.ui.module'; 
import { CoreModule } from '@app/core/core.module'; 
import { AddTokenComponent } from '@app/wallet/home/components/add-token/add-token.component';
import { HomeRoutingModule } from '@app/wallet/home/home.routes';
import { SharedModule } from '@app/shared/shared.module';
import { HomeComponent } from '@app/wallet/home/home.component';
import { AccountOverviewComponent } from '@app/wallet/home/components/account-overview/account-overview.component';
import { TokenListComponent } from '@app/wallet/home/components/token-list/token-list.component';

@NgModule({
  entryComponents: [
    AddTokenComponent,
  ],
  imports: [
    HomeRoutingModule,
    CommonModule,
    AppUIModule,
    SharedModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CurrentUserDisplayComponent,
    HomeComponent,
    AccountOverviewComponent,
    TokenListComponent,
    AddTokenComponent,
  ],
  exports: [
    AccountOverviewComponent,
    TokenListComponent,
    AddTokenComponent,
  ]
})
export class HomeModule { }
