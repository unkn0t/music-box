import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import {BehaviorSubject, map, Observable, throwError} from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';
  public currentToken$ = new BehaviorSubject(this.getAccessToken());

  private http = inject(HttpClient);
  private router = inject(Router);

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<{ access: string, refresh: string }>(`${this.apiUrl}/login/`, credentials).pipe(
      tap((res) => {
        this.setTokens(res.access, res.refresh);
        this.currentToken$.next(this.getAccessToken());
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available.'));
    }

    return this.http.post(`${this.apiUrl}/refresh/`, { refresh: refreshToken }).pipe(
      tap((res: any) => {
        this.setTokens(res.access, res.refresh);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout/`, {refresh: this.getRefreshToken()}).subscribe(
      () => {
        this.router.navigate(['/login']);
      });

    this.removeTokens();
  }

  isLoggedIn(): Observable<boolean> {
    return this.currentToken$.pipe(
      map(token => token !== null)
    );
  }

  getAccessToken(): string | null {
    const token = localStorage.getItem(this.accessTokenKey);
    if (!token) {
      return null;
    }

    return this.isTokenExpired(token) ? null : token;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey)
  }

  removeTokens() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true; // If decoding fails, assume token is expired
    }
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }
}

