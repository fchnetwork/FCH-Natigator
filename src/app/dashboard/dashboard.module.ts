import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { AppUIModule } from '../app.ui.module';
import { CurrentUserDisplayComponent } from './current-user-display/current-user-display.component';
import { RouterModule } from '@angular/router';
import { DashboardRoutingModule } from './dashboard.routes';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    DashboardRoutingModule,
    CommonModule,
    AppUIModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent,
    CurrentUserDisplayComponent
  ],
  exports: [
    DashboardComponent
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
