import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Data, NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {filter, map, mergeMap, Subscription} from 'rxjs';
import {NgIf} from '@angular/common';
import {PlayerComponent} from './player/player.component';
import {Track} from './track';
import {PlayerService} from './player.service';

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

  track: Track | undefined;

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private playerService = inject(PlayerService);

  private playerSub: Subscription;

  constructor() {
    this.playerSub = this.playerService.selectedTrack$.subscribe(track => {
      this.track = track;
    })
  }

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
