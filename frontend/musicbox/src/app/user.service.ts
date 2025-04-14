import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from './user';
import {Playlist} from './playlist';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/users';

  private http = inject(HttpClient);

  current(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me/`);
  }

  playlists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/me/playlists/`);
  }

  createPlaylist(name: string): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.apiUrl}/me/playlists/`, {
      name: name,
      tracks: [],
    });
  }
}
