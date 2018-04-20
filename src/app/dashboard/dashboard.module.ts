import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { AppUIModule } from '../app.ui.module';
import { CurrentUserDisplayComponent } from './current-user-display/current-user-display.component';
import { RouterModule } from '@angular/router';
import { DashboardRoutingModule } from './dashboard.routes';
import { SharedModule } from '../shared/shared.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { AccountOverviewComponent } from '@app/dashboard/components/account-overview/account-overview.component';

@NgModule({
  imports: [
    DashboardRoutingModule,
    CommonModule,
    AppUIModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    CurrentUserDisplayComponent,
    DashboardHomeComponent,
    AccountOverviewComponent,
],
  exports: [
    DashboardComponent,
    AccountOverviewComponent,
  ]
})
export class DashboardModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DashboardModule,
      providers: [
      ]
    };
  }
}
