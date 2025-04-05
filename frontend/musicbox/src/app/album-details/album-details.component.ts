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
}
