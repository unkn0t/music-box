import {Component, inject, OnInit} from '@angular/core';
import {ArtistTableComponent} from '../artist-table/artist-table.component';
import {PlaylistTableComponent} from '../playlist-table/playlist-table.component';
import {AuthService} from '../auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ArtistTableComponent, PlaylistTableComponent, NgIf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;

  authService = inject(AuthService);

  ngOnInit() {
    this.authService.isLoggedIn().subscribe(state => {
      this.isLoggedIn = state;
    });
  }
}
