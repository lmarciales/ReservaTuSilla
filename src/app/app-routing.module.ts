import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationComponent } from './components/main/administration/administration.component';
import { HomeComponent } from './components/main/home/home.component';
import { LoginComponent } from './components/main/login/login.component';
import { LayoutComponent } from './components/shared/layout/layout.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['dashboard']);

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    children: [],
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome }
  },
  {
    path: 'login',
    component: LoginComponent,
    children: [],
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToHome }
  },
  {
    path: 'dashboard',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
      },
      {
        path: 'administration',
        component: AdministrationComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
      },
      { path: '',
        redirectTo: 'home',
        pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
