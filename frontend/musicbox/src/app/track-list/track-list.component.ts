import {Component, inject, Input} from '@angular/core';
import {Track} from '../track';
import {NgForOf} from '@angular/common';
import {PlayerService} from '../player.service';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TimeFormatter} from '../time-formatter';
import {MatDialog} from '@angular/material/dialog';
import {PlaylistDialogComponent} from '../playlist-dialog/playlist-dialog.component';

@Component({
  selector: 'app-track-list',
  imports: [
    NgForOf,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './track-list.component.html',
  styleUrl: './track-list.component.css'
})
export class TrackListComponent {
  @Input() tracks: Track[] = [];

  private playerService = inject(PlayerService);
  private dialog = inject(MatDialog);

  selectTrack(track: Track) {
    this.playerService.playTrack(track);
  }

  getArtistsNames(track: Track): string {
    return track.artists.map((artist) => artist.name).join(',');
  }

  getDuration(track: Track): string {
    return TimeFormatter.format(track.duration_ms);
  }

  openPlaylistDialog(track: Track) {
    const dialogRef = this.dialog.open(PlaylistDialogComponent, {
      width: '400px',
      data: { track: track },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.added) {
        // e.g. show confirmation: “Added to ‘My Favorites’”
        console.log('Track added to', result.playlist.name);
      }
    });
  }
}
