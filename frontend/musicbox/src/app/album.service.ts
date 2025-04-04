import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Album} from './album';
import {Track} from './track';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private apiUrl = 'http://localhost:8000/api/albums';

  private http = inject(HttpClient);

  getById(id: bigint): Observable<Album> {
    return this.http.get<Album>(`${this.apiUrl}/${id}/`)
  }

  listTracksOf(id: bigint): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.apiUrl}/${id}/tracks/`);
  }
}
