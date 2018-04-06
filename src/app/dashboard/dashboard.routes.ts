import { DashboardComponent } from "./dashboard.component";
import { CurrentUserDisplayComponent } from "./current-user-display/current-user-display.component";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

export const DASHBOARD_ROUTES = [
    {
        path: '',
        compoonent: DashboardComponent,
        children: [
            {
                path: '', 
                component: CurrentUserDisplayComponent
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(DASHBOARD_ROUTES)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }