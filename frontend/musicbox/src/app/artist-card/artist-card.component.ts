import {Component, inject, Input} from '@angular/core';
import {Artist} from '../artist';
import {Router} from '@angular/router';

@Component({
  selector: 'app-artist-card',
  imports: [],
  templateUrl: './artist-card.component.html',
  styleUrl: './artist-card.component.css'
})
export class ArtistCardComponent {
  @Input() artist!: Artist;

  private router = inject(Router);

  goToAlbums() {
    this.router.navigate(['/artists', this.artist.id]).then((res) =>
      res ? console.log("navigate to albums") : console.log(`Could not go to artist albums.`)
    );
  }
}
