import { Component } from '@angular/core';

import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-home',
  imports: [
    PlayerComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
