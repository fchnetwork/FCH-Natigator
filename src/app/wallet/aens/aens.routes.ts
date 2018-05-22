import {Routes, RouterModule} from '@angular/router';
import { NgModule } from "@angular/core";

import { AensDashboardComponent } from './components/aens-dashboard/aens-dashboard.component';

export const AENS_ROUTES = [
  {
      path: '',
      component: AensDashboardComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(AENS_ROUTES)],
  exports: [RouterModule]
})
export class AensRoutingModule { }
