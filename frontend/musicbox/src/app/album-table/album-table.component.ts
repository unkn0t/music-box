import {Component, inject, OnInit} from '@angular/core';
import {Album} from '../album';
import {ArtistService} from '../artist.service';
import {ActivatedRoute} from '@angular/router';
import {AlbumCardComponent} from '../album-card/album-card.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-album-table',
  imports: [
    AlbumCardComponent,
    NgForOf
  ],
  templateUrl: './album-table.component.html',
  styleUrl: './album-table.component.css'
})
export class AlbumTableComponent implements OnInit {
  albums: Album[] = [];

  private artistService = inject(ArtistService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const artistId: string = this.route.snapshot.params['id'];

    this.artistService.listAlbumsOf(artistId).subscribe((data) => {
      this.albums = data;
    });
  }
}
