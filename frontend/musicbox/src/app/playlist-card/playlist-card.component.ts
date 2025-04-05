import {Component, inject, Input} from '@angular/core';
import {Playlist} from '../playlist';
import {Router} from '@angular/router';

@Component({
  selector: 'app-playlist-card',
  imports: [],
  templateUrl: './playlist-card.component.html',
  styleUrl: './playlist-card.component.css'
})
export class PlaylistCardComponent {
  @Input() playlist!: Playlist;

  private backendUrl = 'http://localhost:8000';
  private router = inject(Router);

  getCover(): string {
    return `${this.backendUrl}${this.playlist.cover}`;
  }

  goToTracks() {
    this.router.navigate(['/playlists', this.playlist.id]).then((res) =>
      res ? console.log("navigate to tracks") : console.log(`Could not go to playlist tracks.`)
    );
  }
}
