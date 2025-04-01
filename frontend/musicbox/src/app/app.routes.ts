import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import {AuthGuard} from './auth.guard';
import {LoginComponent} from './login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { showHeader: false } },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'home' }
];
