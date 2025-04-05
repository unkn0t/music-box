import {Component, inject, OnInit} from '@angular/core';
import {Track} from '../track';
import {AlbumService} from '../album.service';
import {ActivatedRoute} from '@angular/router';
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
export class TrackListComponent implements OnInit {
  tracks: Track[] = [];

  private albumService = inject(AlbumService);
  private route = inject(ActivatedRoute);
  private playerService = inject(PlayerService);

  ngOnInit(): void {
    const id = BigInt(this.route.snapshot.params['id']);

    this.albumService.listTracksOf(id).subscribe((data) => {
      this.tracks = data;
    });
  }

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
