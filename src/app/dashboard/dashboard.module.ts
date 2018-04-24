import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUIModule } from '../app.ui.module';
import { CurrentUserDisplayComponent } from './current-user-display/current-user-display.component';
import { RouterModule } from '@angular/router';
import { DashboardRoutingModule } from './dashboard.routes';
import { SharedModule } from '../shared/shared.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { AccountOverviewComponent } from '@app/dashboard/components/account-overview/account-overview.component';
import { TokenListComponent } from '@app/dashboard/components/token-list/token-list.component';
import { AddTokenComponent } from '@app/dashboard/components/add-token/add-token.component';
import { TokenService } from '@app/dashboard/services/token.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
