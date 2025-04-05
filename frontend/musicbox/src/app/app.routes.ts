import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import {AuthGuard} from './auth.guard';
import {LoginComponent} from './login/login.component';
import {AlbumTableComponent} from './album-table/album-table.component';
import {AlbumDetailsComponent} from './album-details/album-details.component';
import {PlaylistDetailsComponent} from './playlist-details/playlist-details.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { showHeader: false, showPlayer: false } },
  { path: 'home', component: HomeComponent },
  { path: 'artists/:id', component: AlbumTableComponent },
  { path: 'albums/:id', component: AlbumDetailsComponent },
  { path: 'playlists/:id', component: PlaylistDetailsComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home' }
];
