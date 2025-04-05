import {Component, inject, OnInit} from '@angular/core';
import {Track} from '../track';
import {PlaylistService} from '../playlist.service';
import {ActivatedRoute} from '@angular/router';
import {Playlist} from '../playlist';
import {TrackListComponent} from '../track-list/track-list.component';

@Component({
  selector: 'app-playlist-details',
  imports: [
    TrackListComponent
  ],
  templateUrl: './playlist-details.component.html',
  styleUrl: './playlist-details.component.css'
})
export class PlaylistDetailsComponent implements OnInit {
  playlist: Playlist | undefined;

  tracks: Track[] = [];

  private playlistService = inject(PlaylistService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = BigInt(this.route.snapshot.params['id']);

    this.playlistService.getById(id).subscribe(data => {
      this.playlist = data;
    });

    this.playlistService.listTracksOf(id).subscribe(data => {
      this.tracks = data;
    });
  }
}
