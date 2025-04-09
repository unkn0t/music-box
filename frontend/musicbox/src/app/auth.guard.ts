import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.isLoggedIn().subscribe((res) => {
      this.isLoggedIn = res;
    });
  }

  canActivate(): boolean {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }

    return this.isLoggedIn;
  }
}

