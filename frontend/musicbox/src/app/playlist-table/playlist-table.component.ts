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

  private playlistService = inject(PlaylistService);
  private userService = inject(UserService);
  private router = inject(Router);

  constructor() {
    this.playlistService.listCurrent().subscribe((data) => {
      this.playlists = data;
    });
  }

  createPlaylist() {
    this.userService.current().subscribe(user => {
      let playlist: Playlist = {
        id: '',
        name: `Playlist #${this.playlists.length}`,
        cover: '',
        tracks: [],
        owner: user.username,
      };

      this.playlistService.create(playlist).subscribe(playlist => {
        this.router.navigate(['/playlists', playlist.id]);
      })
    });
  }
}
