import {Component, inject, Input} from '@angular/core';
import {Album} from '../album';
import {Router} from '@angular/router';

@Component({
  selector: 'app-album-card',
  imports: [],
  templateUrl: './album-card.component.html',
  styleUrl: './album-card.component.css'
})
export class AlbumCardComponent {
  @Input() album!: Album;

  private backendUrl = 'http://localhost:8000';
  private router = inject(Router);

  getCover(): string {
    return `${this.backendUrl}${this.album.cover}`;
  }

  getReleaseYear(): number {
    const date = new Date(this.album.release_date);
    return date.getFullYear();
  }

  goToTracks() {
    this.router.navigate(['/albums', this.album.id]).then((res) =>
      res ? console.log("navigate to tracks") : console.log(`Could not go to album tracks.`)
    );
  }
}
