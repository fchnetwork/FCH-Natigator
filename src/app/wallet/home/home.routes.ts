import { CurrentUserDisplayComponent } from "./current-user-display/current-user-display.component";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";   
import { HomeComponent } from "@app/wallet/home/home.component";

export const HOME_ROUTES = [
    {
        path: '', 
        component: HomeComponent,
        children: [
            {
                path: 'currentUserDisplay', 
                component: CurrentUserDisplayComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(HOME_ROUTES)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }