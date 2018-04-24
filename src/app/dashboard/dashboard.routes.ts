import { CurrentUserDisplayComponent } from "./current-user-display/current-user-display.component";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { DashboardHomeComponent } from "./dashboard-home/dashboard-home.component";
import { LoggedInComponent } from "@app/logged-in/logged-in.component";

export const DASHBOARD_ROUTES = [
    {
        path: '',
        component: LoggedInComponent,
        children: [
            {
                path: '',
                component: DashboardHomeComponent
            },
            {
                path: 'currentUserDisplay', 
                component: CurrentUserDisplayComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(DASHBOARD_ROUTES)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }