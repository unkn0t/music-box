import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {Track} from './track';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private currentTrackSource = new Subject<Track | undefined>();
  currentTrack$ = this.currentTrackSource.asObservable();

  private currentTrack: Track | undefined;
  private trackQueue: Track[] = [];
  private trackHistory: Track[] = [];

  constructor() {
    this.currentTrackSource.subscribe(current => {
      this.currentTrack = current;
    });
  }

  // adds Track to the start of queue and plays it
  playTrack(track: Track) {
    this.moveCurrentToHistory();
    this.currentTrackSource.next(track);
  }

  // adds many Tracks to the start of queue and plays them
  playTracks(tracks: Track[]) {
    if (tracks.length > 0) {
      this.moveCurrentToHistory();
      this.trackQueue = tracks.concat(this.trackQueue);
      this.currentTrackSource.next(this.trackQueue.shift() ?? tracks[0]);
    }
  }

  // adds Track to the end of queue
  addTrackToQueue(track: Track) {
    this.trackQueue.push(track);
  }

  // adds many Tracks to the end of queue
  addTracksToQueue(tracks: Track[]) {
    this.trackQueue = this.trackQueue.concat(tracks);
  }

  // adds current track to history, sets current track as queue.first()
  next() {
    const nextTrack = this.trackQueue.shift();
    if (nextTrack) {
      this.moveCurrentToHistory();
      this.currentTrackSource.next(nextTrack);
    }
  }

  // adds current track to start of queue, sets current track as history.last()
  prev() {
    const prevTrack = this.trackHistory.pop();
    if (prevTrack) {
      if (this.currentTrack) {
        this.trackQueue.unshift(this.currentTrack);
      }
      this.currentTrackSource.next(prevTrack);
    }
  }

  hasNext(): boolean {
    return this.trackQueue.length > 0;
  }

  hasPrev(): boolean {
    return this.trackHistory.length > 0;
  }

  private moveCurrentToHistory() {
    if (this.currentTrack) {
      this.trackHistory.push(this.currentTrack);
      console.log(this.trackHistory);
    }
  }
}
