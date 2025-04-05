import { HttpInterceptorFn } from '@angular/common/http';
import {AuthService} from './auth.service';
import {inject} from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interceptor triggered for:', req.url);

  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
