import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";

import { CreateTokenComponent } from "./components/create-token/create-token.component";

const FACTORY_ROUTES: Routes = [{
  path: '',
  children: [
    {
      path: '',
      component: CreateTokenComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(FACTORY_ROUTES)],
  exports: [RouterModule]
})
export class FactoryRoutingModule { }
