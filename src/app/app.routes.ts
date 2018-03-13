
import { LoginComponent } from './account/login/login.component'
import { RegistrationComponent } from './account/registration/registration.component'
import { Error404Component } from './shared/components/error404/error404.component'
import { LandingPageComponent } from './account/landing-page/landing-page.component'

export const ROUTES = [
  {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  },
  {
      path: 'landing',
      component: LandingPageComponent
  },    
  {
      path: 'login',
      component: LoginComponent
  },
  {
      path: 'create',
      component: RegistrationComponent
  },
  {
    path: 'explorer',
    loadChildren: './explorer/explorer.module#ExplorerModule'
  },
  {
    path: 'not-found',
    component: Error404Component,
  },
  { 
    path: '**',
    redirectTo: '/not-found'
  }
]
