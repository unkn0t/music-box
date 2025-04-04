import { Component } from '@angular/core';
import {ArtistTableComponent} from '../artist-table/artist-table.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ArtistTableComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
}
