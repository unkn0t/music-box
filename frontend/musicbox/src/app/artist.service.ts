import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Artist} from './artist';
import {Observable} from 'rxjs';
import {Album} from './album';
import {Track} from './track';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private apiUrl = 'http://localhost:8000/api/artists';

  private http = inject(HttpClient);

  listAll(): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.apiUrl}/`);
  }

  getById(id: string): Observable<Artist> {
    return this.http.get<Artist>(`${this.apiUrl}/${id}/`)
  }

  listAlbumsOf(id: string): Observable<Album[]> {
    return this.http.get<Album[]>(`${this.apiUrl}/${id}/albums/`);
  }

  listTracksOf(id: string): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.apiUrl}/${id}/tracks/`);
  }
}
