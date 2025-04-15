import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Playlist} from './playlist';
import {PlaylistTrack} from './track';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private apiUrl = 'http://localhost:8000/api/playlists';

  private http = inject(HttpClient);

  getById(id: string): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.apiUrl}/${id}/`);
  }

  update(id: string, name: string, cover: File | undefined): Observable<Playlist> {
    const formData = new FormData();
    formData.append('name', name);
    if (cover) {
      formData.append('cover', cover);
    }
    return this.http.put<Playlist>(`${this.apiUrl}/${id}/`, formData);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}/`);
  }

  listTracksOf(id: string): Observable<PlaylistTrack[]> {
    return this.http.get<PlaylistTrack[]>(`${this.apiUrl}/${id}/tracks/`);
  }
}
