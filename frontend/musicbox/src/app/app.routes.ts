import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import {AuthGuard} from './auth.guard';
import {LoginComponent} from './login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];
