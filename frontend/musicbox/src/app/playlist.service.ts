import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Playlist} from './playlist';
import {Track} from './track';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private apiUrl = 'http://localhost:8000/api';
  private plistUrl = `${this.apiUrl}/playlists`;

  private http = inject(HttpClient);

  getById(id: string): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.plistUrl}/${id}/`);
  }

  update(id: string, name: string, cover: File | undefined): Observable<Playlist> {
    const formData = new FormData();
    formData.append('name', name);
    if (cover) {
      formData.append('cover', cover);
    }
    return this.http.put<Playlist>(`${this.plistUrl}/${id}/`, formData);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.plistUrl}/${id}/`);
  }

  create(playlist: Playlist): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.apiUrl}/me/playlists/`, {
      name: playlist.name,
      tracks: playlist.tracks,
    });
  }

  listCurrent(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/me/playlists/`);
  }

  listTracksOf(id: string): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.plistUrl}/${id}/tracks/`);
  }
}
