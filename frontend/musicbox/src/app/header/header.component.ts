import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import {NgIf} from '@angular/common';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    NgIf,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  isLoggedIn = false;

  constructor(private authService: AuthService) {
    this.authService.isLoggedIn().subscribe(status => this.isLoggedIn = status);
  }

  logout() {
    this.authService.logout();
  }
}

