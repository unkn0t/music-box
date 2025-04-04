import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {filter, map, mergeMap} from 'rxjs';
import {NgIf} from '@angular/common';
import {PlayerComponent} from './player/player.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NgIf, PlayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'musicbox';

  showHeader = true;
  showPlayer = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap(route => route.data)
      )
      .subscribe((data: Data) => {
        // Default to true if not set
        this.showHeader = data['showHeader'] !== false;
        this.showPlayer = data['showPlayer'] !== false;
      });
  }
}
