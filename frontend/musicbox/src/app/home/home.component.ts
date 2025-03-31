import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PlayerComponent } from '../player/player.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PlayerComponent, HttpClientModule, NgForOf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  songs: any[] = [];
  selectedSong: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Загружаем список песен из JSON-файла
    this.http.get<any[]>('assets/audio/songs.json').subscribe(data => {
      console.log('Получены песни:', data);
      this.songs = data;
    }, error => {
      console.error('Ошибка загрузки JSON:', error);
    });
  }

  selectSong(song: any): void {
    this.selectedSong = song;
  }
}
