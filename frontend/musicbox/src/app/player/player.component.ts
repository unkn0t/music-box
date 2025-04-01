import {Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, Input, AfterViewInit} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [NgIf,CommonModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements AfterViewInit, OnChanges {
  @Input() song: any;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  @ViewChild('timeSlider') timeSlider!: ElementRef<HTMLInputElement>;
  @ViewChild('volumeSlider') volumeSlider!: ElementRef<HTMLInputElement>;

  isPlaying: boolean = false;
  isMuted: boolean = false;
  isLooping: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 0.7;

  ngAfterViewInit(): void {
    this.updateSliderBackground(this.volumeSlider.nativeElement, this.volume * 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['song'] && this.audioPlayer && this.song) {
      this.audioPlayer.nativeElement.src = this.song.src;
      this.audioPlayer.nativeElement.load();
      this.playAudio();
    }
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
    this.audioPlayer.nativeElement.play();
    this.isPlaying = true;
  }

  pauseAudio(): void {
    this.audioPlayer.nativeElement.pause();
    this.isPlaying = false;
  }

  updateCurrentTime(): void {
    this.currentTime = this.audioPlayer.nativeElement.currentTime;
    this.updateSliderBackground(this.timeSlider.nativeElement, this.currentTime / this.duration * 100);
  }

  setDuration(): void {
    this.duration = this.audioPlayer.nativeElement.duration;
  }

  seekAudio(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newTime = parseFloat(target.value);
    this.audioPlayer.nativeElement.currentTime = newTime;
    this.currentTime = newTime;
    this.updateSliderBackground(target, this.currentTime / this.duration * 100);
  }

  changeVolume(event: any) {
    this.volume = event.target.value;
    this.audioPlayer.nativeElement.volume = this.volume;
    this.updateSliderBackground(event.target as HTMLInputElement, this.volume * 100);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audioPlayer.nativeElement.muted = this.isMuted;
  }

  toggleLoop() {
    this.isLooping = !this.isLooping;
    this.audioPlayer.nativeElement.loop = this.isLooping;
  }

  seekForward() {
    this.audioPlayer.nativeElement.currentTime += 10;
  }

  seekBackward() {
    this.audioPlayer.nativeElement.currentTime -= 10;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
