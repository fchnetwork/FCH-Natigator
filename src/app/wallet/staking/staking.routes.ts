import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { StakingComponent } from "@app/wallet/staking/staking.component";

const STAKING_ROUTES: Routes = [{
  path: 'staking',
  children: [
    {
      path: '',
      component: StakingComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(STAKING_ROUTES)],
  exports: [RouterModule]
})
export class StakingRoutingModule { }
