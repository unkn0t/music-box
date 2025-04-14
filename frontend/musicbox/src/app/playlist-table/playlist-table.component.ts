import {Component, inject} from '@angular/core';
import {Playlist} from '../playlist';
import {PlaylistService} from '../playlist.service';
import {PlaylistCardComponent} from '../playlist-card/playlist-card.component';
import {NgForOf} from '@angular/common';
import {Router} from '@angular/router';
import {UserService} from '../user.service';

@Component({
  selector: 'app-playlist-table',
  imports: [
    PlaylistCardComponent,
    NgForOf
  ],
  templateUrl: './playlist-table.component.html',
  styleUrl: './playlist-table.component.css'
})
export class PlaylistTableComponent {
  playlists: Playlist[] = [];

  private userService = inject(UserService);
  private router = inject(Router);

  constructor() {
    this.userService.playlists().subscribe((data) => {
      this.playlists = data;
    });
  }

  createPlaylist() {
    this.userService.current().subscribe(user => {
      this.userService.createPlaylist(`Playlist #${this.playlists.length}`).subscribe(playlist => {
        this.router.navigate(['/playlists', playlist.id]);
      })
    });
  }
}
