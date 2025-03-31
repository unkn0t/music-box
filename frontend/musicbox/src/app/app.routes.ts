import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  // { path: 'about', component: AboutComponent },
  // { path: 'albums', component: AlbumsComponent },
  // { path: 'albums/new', component: AlbumCreateComponent },
  // { path: 'albums/:id', component: AlbumDetailsComponent },
  // { path: 'albums/:id/photos', component: AlbumPhotosComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
