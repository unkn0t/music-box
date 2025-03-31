import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [NgIf,CommonModule],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnChanges {
  @Input() song: any;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  isPlaying: boolean = false;
  isMuted: boolean = false;
  isLooping: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 0.7;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    // При изменении выбранного трека обновляем источник аудио
    if (changes['song'] && this.audioPlayer && this.song) {
      this.audioPlayer.nativeElement.src = this.song.src;
      this.audioPlayer.nativeElement.load();
      // Можно автоматически запускать воспроизведение или оставить по кнопке
      // this.playAudio();
    }
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
  }

  setDuration(): void {
    this.duration = this.audioPlayer.nativeElement.duration;
  }

  seekAudio(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newTime = parseFloat(target.value);
    this.audioPlayer.nativeElement.currentTime = newTime;
    this.currentTime = newTime;
  }

  changeVolume(event: any) {
    this.volume = event.target.value;
    this.audioPlayer.nativeElement.volume = this.volume;
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
