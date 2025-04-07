import {Component, inject, OnInit} from '@angular/core';
import {Track} from '../track';
import {PlaylistService} from '../playlist.service';
import {ActivatedRoute} from '@angular/router';
import {Playlist} from '../playlist';
import {TrackListComponent} from '../track-list/track-list.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-playlist-details',
  imports: [
    TrackListComponent
  ],
  templateUrl: './playlist-details.component.html',
  styleUrl: './playlist-details.component.css'
})
export class PlaylistDetailsComponent implements OnInit {
  playlist: Playlist | undefined;

  tracks: Track[] = [];

  private backendUrl = 'http://localhost:8000';
  private playlistService = inject(PlaylistService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = BigInt(this.route.snapshot.params['id']);

    this.playlistService.getById(id).subscribe(data => {
      this.playlist = data;
    });

    this.playlistService.listTracksOf(id).subscribe(data => {
      this.tracks = data;
    });
  }

  getCover(): string {
    return `${this.backendUrl}${this.playlist?.cover}`;
  }

  getDuration(): string {
    let total_duration = 0;
    for (const track of this.tracks) {
      total_duration += track.duration_ms;
    }
    return this.formatTime(Math.floor(total_duration / 60000));
  }

  confirmDelete() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: 'dark-mode-popup',  // Custom CSS class
        title: 'dark-mode-title',
        confirmButton: 'dark-mode-confirm',
        cancelButton: 'dark-mode-cancel'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteItem();
        Swal.fire({
          title: "Deleted!",
          text: `Playlist ${this.playlist?.name} has been deleted.`,
          icon: "success",
          customClass: {
            popup: 'dark-mode-popup',
            title: 'dark-mode-title',
            confirmButton: 'dark-mode-confirm',
          }
      });
      }
    });
  }

  deleteItem() {
    if (this.playlist)
      this.playlistService.delete(this.playlist.id);
  }

  formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours} hr ${mins < 10 ? '0' : ''}${mins} min`;
  }
}
