import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { CurrentUserDisplayComponent } from './current-user-display/current-user-display.component';
import { RouterModule } from '@angular/router';
import { DashboardRoutingModule } from './dashboard.routes'; 
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTokenComponent } from '@app/wallet/dashboard/components/add-token/add-token.component';
import { AppUIModule } from '@app/app.ui.module';
import { SharedModule } from '@app/shared/shared.module';
import { AccountOverviewComponent } from '@app/wallet/dashboard/components/account-overview/account-overview.component';
import { TokenListComponent } from '@app/wallet/dashboard/components/token-list/token-list.component';
import { TokenService } from '@app/wallet/dashboard/services/token.service';

@NgModule({
  entryComponents: [
    AddTokenComponent,
  ],
  imports: [
    DashboardRoutingModule,
    CommonModule,
    AppUIModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CurrentUserDisplayComponent,
    DashboardHomeComponent,
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
export class DashboardModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DashboardModule,
      providers: [
        TokenService,
      ]
    };
  }
}
