import {Routes, RouterModule} from '@angular/router';
import { NgModule } from "@angular/core";
import { LoggedInComponent } from '@app/logged-in/logged-in.component';

import { ManageAerumNamesComponent } from './components/manage-aerum-names/manage-aerum-names.component';

export const AENS_ROUTES = [
  {
      path: '',
      component: LoggedInComponent,
      children: [
          {
              path: '',
              component: ManageAerumNamesComponent
          },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(AENS_ROUTES)],
  exports: [RouterModule]
})
export class SwapRoutingModule { }