import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;

  constructor() { }

  ngOnInit(): void { }

  playAudio(): void {
    this.audioPlayer.nativeElement.play();
    this.isPlaying = true;
  }

  pauseAudio(): void {
    this.audioPlayer.nativeElement.pause();
    this.isPlaying = false;
  }

  // Called on timeupdate event
  updateCurrentTime(): void {
    this.currentTime = this.audioPlayer.nativeElement.currentTime;
  }

  // When metadata loads, update duration
  setDuration(): void {
    this.duration = this.audioPlayer.nativeElement.duration;
  }

  // Seek the audio track based on slider value
  seekAudio(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newTime = parseFloat(target.value);
    this.audioPlayer.nativeElement.currentTime = newTime;
    this.currentTime = newTime;
  }

  // Helper to format seconds into minutes:seconds
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
