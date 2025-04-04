import {Component, inject, OnInit} from '@angular/core';
import {Artist} from '../artist';
import {ArtistService} from '../artist.service';
import {NgForOf} from '@angular/common';
import {ArtistCardComponent} from '../artist-card/artist-card.component';

@Component({
  selector: 'app-artist-table',
  imports: [
    NgForOf,
    ArtistCardComponent
  ],
  templateUrl: './artist-table.component.html',
  styleUrl: './artist-table.component.css'
})
export class ArtistTableComponent implements OnInit {
  artists: Artist[] = [];

  private artistService = inject(ArtistService);

  ngOnInit(): void {
    this.artistService.listAll().subscribe((data) => {
      this.artists = data;
    });
  }
}
