import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<{ access: string, refresh: string }>(`${this.apiUrl}/login/`, credentials).pipe(
      tap((response) => {
        localStorage.setItem(this.accessTokenKey, response.access);
        localStorage.setItem(this.refreshTokenKey, response.refresh);
        this.isAuthenticated.next(true);
      })
    );
  }

  logout(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getAccessToken()}`
    });

    this.http.post(`${this.apiUrl}/logout/`, { refresh: this.getRefreshToken() }, { headers }).subscribe(
      () => {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        this.isAuthenticated.next(false);
        this.router.navigate(['/login']).then((result) => {
          if (!result) console.log("Navigation to login failed!")
          else console.log("Navigation to login succeed!")
        });
      });
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey)
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.accessTokenKey);
  }
}

