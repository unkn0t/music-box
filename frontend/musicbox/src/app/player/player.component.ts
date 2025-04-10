import {Component, ViewChild, ElementRef, AfterViewInit, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TimeFormatter} from '../time-formatter';
import {PlayerService} from '../player.service';
import {Track} from '../track';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, AfterViewInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  @ViewChild('timeSlider') timeSlider!: ElementRef<HTMLInputElement>;
  @ViewChild('volumeSlider') volumeSlider!: ElementRef<HTMLInputElement>;

  track: Track | undefined;
  isPlaying: boolean = false;
  isMuted: boolean = false;
  isLooping: boolean = false;
  currentTimeMillis: number = 0;
  durationMillis: number = 0;
  volume: number = 0.6;

  private backendUrl = 'http://localhost:8000';
  private playerService = inject(PlayerService);

  ngOnInit() {
    this.playerService.currentTrack$.subscribe(current => {
      this.loadTrack(current);
    });
  }

  private loadTrack(track: Track | undefined) {
    if (track) {
      this.audioPlayer.nativeElement.src = `${this.backendUrl}${track.audio}`;
      this.track = track;
      this.durationMillis = track.duration_ms;
      this.audioPlayer.nativeElement.load();
      this.audioPlayer.nativeElement.onloadedmetadata = (event) => {
        console.log(this.audioPlayer.nativeElement.duration)
      };
      this.playAudio();
    } else {
      this.pauseAudio();
    }
  }

  ngAfterViewInit(): void {
    this.audioPlayer.nativeElement.volume = this.logarithmicVolume(this.volume);
    this.updateSliderBackground(this.volumeSlider.nativeElement, this.volume * 100);
  }

  hasPrev(): boolean {
    return this.playerService.hasPrev();
  }

  hasNext(): boolean {
    return this.playerService.hasNext();
  }

  getDurationInSecs(): number {
    return Math.ceil(this.durationMillis / 1000);
  }

  getCurrentTimeInSecs(): number {
    return Math.ceil(this.currentTimeMillis / 1000);
  }

  toggleAudio(): void {
    if (this.isPlaying) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }

  updateSliderBackground(slider: HTMLInputElement, value: number): void {
    slider.style.background = `linear-gradient(to right, #ff0000 0%, #ff0000 ${value}%, #d3d3d3 ${value}%, #d3d3d3 100%)`;
  }

  playAudio(): void {
    this.audioPlayer.nativeElement.play().then(() => {
      this.isPlaying = true;
    }).catch(err => console.log(err));
  }

  pauseAudio(): void {
    this.audioPlayer.nativeElement.pause();
    this.isPlaying = false;
  }

  updateCurrentTime(): void {
    this.currentTimeMillis = Math.ceil(this.audioPlayer.nativeElement.currentTime * 1000);
    this.updateSliderBackground(this.timeSlider.nativeElement, this.currentTimeMillis / this.durationMillis * 100);
  }

  seekAudio(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newTime = parseFloat(target.value);
    this.audioPlayer.nativeElement.currentTime = newTime;
    this.currentTimeMillis = Math.ceil(newTime * 1000);
    this.updateSliderBackground(target, this.currentTimeMillis / this.durationMillis * 100);
  }

  changeVolume(event: any) {
    this.volume = event.target.value;
    this.audioPlayer.nativeElement.volume = this.logarithmicVolume(this.volume);
    this.updateSliderBackground(event.target as HTMLInputElement, this.volume * 100);
  }

  logarithmicVolume(volume: number): number {
    return (Math.pow(10, volume) - 1) / 9;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audioPlayer.nativeElement.muted = this.isMuted;
  }

  toggleLoop() {
    this.isLooping = !this.isLooping;
    this.audioPlayer.nativeElement.loop = this.isLooping;
  }

  playNext() {
    this.playerService.next();
  }

  playPrev() {
    this.playerService.prev();
  }

  getCurrentTime(): string {
    return TimeFormatter.format(this.currentTimeMillis);
  }

  getDuration(): string {
    return TimeFormatter.format(this.durationMillis);
  }

  protected readonly onended = onended;
}
