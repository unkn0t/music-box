import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {Track} from './track';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private selectedTrackSource = new Subject<Track>();
  selectedTrack$ = this.selectedTrackSource.asObservable();

  selectTrack(track: Track) {
    this.selectedTrackSource.next(track);
  }
}
