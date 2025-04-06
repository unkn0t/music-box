import {Component, inject, OnInit} from '@angular/core';
import {AlbumService} from '../album.service';
import {ActivatedRoute} from '@angular/router';
import {Track} from '../track';
import {Album} from '../album';
import {TrackListComponent} from '../track-list/track-list.component';

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
    const id = BigInt(this.route.snapshot.params['id']);

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

  getDuration(): string {
    let total_duration = 0;
    for (const track of this.tracks) {
      total_duration += track.duration_ms;
    }
    return this.formatTime(Math.floor(total_duration / 60000));
  }

  formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours} hr ${mins < 10 ? '0' : ''}${mins} min`;
  }
}
