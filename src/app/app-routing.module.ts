import { NgModule } from '@angular/core';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

const redirectUnauthorizedToLogin = redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = redirectLoggedInTo(['home']);

export const routes: Routes = [
  { path: '', component: LoginComponent, ...canActivate(redirectLoggedInToHome) },
  { path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInToHome) },
  { path: 'home', component: HomeComponent, ...canActivate(redirectUnauthorizedToLogin) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
