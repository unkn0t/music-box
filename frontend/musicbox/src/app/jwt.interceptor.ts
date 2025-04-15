import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import {AuthService} from './auth.service';
import {inject} from '@angular/core';
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from 'rxjs';

const API_URLS = ['/api/auth/logout', '/api/me', '/api/playlists', '/api/users']

let isRefreshing = false;
let tokenSubject = new BehaviorSubject<string | null>(null);

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  if (!API_URLS.some(url => req.url.includes(url))) {
    return next(req);
  }
  console.log('Interceptor triggered for:', req.url);

  const authService = inject(AuthService);
  let accessToken = authService.getAccessToken();

  if (accessToken) {
    req = addToken(req, accessToken);
  } else {
    let refreshToken = authService.getRefreshToken();
    if (refreshToken) {
      return handle401Error(req, next, authService);
    }
  }

  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    tokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((res: any) => {
        isRefreshing = false;
        tokenSubject.next(res.access);
        // Retry the failed request with the new token
        return next(addToken(request, res.access));
      }),
      catchError(error => {
        isRefreshing = false;
        authService.removeTokens();
        return throwError(() => error);
      })
    );
  } else {
    // If refresh is already in progress, wait until new token is available
    return tokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next(addToken(request, token!)))
    );
  }
}
