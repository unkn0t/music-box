import {Component, inject, Input} from '@angular/core';
import {Track} from '../track';
import {NgForOf} from '@angular/common';
import {PlayerService} from '../player.service';

@Component({
  selector: 'app-track-list',
  imports: [
    NgForOf
  ],
  templateUrl: './track-list.component.html',
  styleUrl: './track-list.component.css'
})
export class TrackListComponent {
  @Input() tracks: Track[] = [];

  private playerService = inject(PlayerService);

  selectTrack(track: Track) {
    this.playerService.selectTrack(track);
  }

  getArtistsNames(track: Track): string {
    return track.artists.map((artist) => artist.name).join(',');
  }

  getDuration(track: Track): string {
    const secs = this.getDurationInSecs(track);
    return this.formatTime(secs);
  }

  getDurationInSecs(track: Track): number {
    return Math.trunc(track.duration_ms / 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
