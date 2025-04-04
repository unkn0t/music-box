import {Component, Input} from '@angular/core';
import {Album} from '../album';

@Component({
  selector: 'app-album-card',
  imports: [],
  templateUrl: './album-card.component.html',
  styleUrl: './album-card.component.css'
})
export class AlbumCardComponent {
  @Input() album!: Album;

  private backendUrl = 'http://localhost:8000';

  getCover(): string {
    return `${this.backendUrl}${this.album.cover}`;
  }

  getReleaseYear(): number {
    const date = new Date(this.album.release_date);
    return date.getFullYear();
  }
}
