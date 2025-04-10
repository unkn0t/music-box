import {Component, inject, OnInit} from '@angular/core';
import {AlbumService} from '../album.service';
import {ActivatedRoute} from '@angular/router';
import {Track} from '../track';
import {Album} from '../album';
import {TrackListComponent} from '../track-list/track-list.component';
import {TimeFormatter} from '../time-formatter';

@Component({
  selector: 'app-album-details',
  imports: [
    TrackListComponent
  ],
  templateUrl: './album-details.component.html',
  styleUrl: './album-details.component.css'
})
export class AlbumDetailsComponent implements OnInit {
  album: Album | undefined;

  tracks: Track[] = [];

  private backendUrl = 'http://localhost:8000';
  private albumService = inject(AlbumService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id: string = this.route.snapshot.params['id'];

    this.albumService.getById(id).subscribe(data => {
      this.album = data;
    });

    this.albumService.listTracksOf(id).subscribe(data => {
      this.tracks = data;
    });
  }

  getType(): string {
    if (!this.album) return "";
    const type = this.album.album_type;
    return type[0].toUpperCase() + type.slice(1);
  }

  getCover(): string {
    return `${this.backendUrl}${this.album?.cover}`;
  }

  getReleaseYear(): number {
    if (!this.album) return 0;
    const date = new Date(this.album.release_date);
    return date.getFullYear();
  }

  getArtistsNames(): string | undefined {
    return this.album?.artists.map((artist) => artist.name).join(',');
  }

  getAboutDuration(): string {
    let totalDuration = 0;
    for (const track of this.tracks) {
      totalDuration += track.duration_ms;
    }
    return TimeFormatter.formatAbout(totalDuration);
  }
}
