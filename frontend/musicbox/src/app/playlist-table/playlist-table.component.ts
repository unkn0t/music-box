import {Component, inject} from '@angular/core';
import {Playlist} from '../playlist';
import {PlaylistService} from '../playlist.service';
import {PlaylistCardComponent} from '../playlist-card/playlist-card.component';
import {NgForOf} from '@angular/common';

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

  constructor() {
    this.playlistService.listCurrent().subscribe((data) => {
      this.playlists = data;
    });
  }
}
