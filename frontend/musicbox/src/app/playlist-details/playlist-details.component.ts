import {Component, inject, OnInit} from '@angular/core';
import {PlaylistTrack, Track} from '../track';
import {PlaylistService} from '../playlist.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Playlist} from '../playlist';
import {TrackListComponent} from '../track-list/track-list.component';
import Swal from 'sweetalert2';
import {PlayerService} from '../player.service';
import {TimeFormatter} from '../time-formatter';

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

  tracks: PlaylistTrack[] = [];

  private playlistService = inject(PlaylistService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private playerService = inject(PlayerService);

  ngOnInit(): void {
    const id: string = this.route.snapshot.params['id'];

    this.playlistService.getById(id).subscribe(data => {
      this.playlist = data;
    });

    this.playlistService.listTracksOf(id).subscribe(data => {
      this.tracks = data;
    });
  }

  getTracks(): Track[] {
    return this.tracks.map(ptrack => ptrack.track);
  }

  addToQueue() {
    this.playerService.playTracks(this.getTracks());
  }

  getAboutDuration(): string {
    let total_duration = 0;
    for (const track of this.tracks) {
      total_duration += track.track.duration_ms;
    }
    return TimeFormatter.formatAbout(total_duration);
  }

  showUpdate() {
    Swal.fire({
      title: "Edit details",
      showCancelButton: true,
      confirmButtonText: "Save",
      html: `
        <input type="text" id="swal-playlist-name" class="swal2-input" value="${this.playlist?.name}">
        <input type="file" id="swal-cover-file" accept="image/*" style="display: block; margin: 1em auto;">
      `,
      didOpen: () => {
        // Manually blur the first input to remove focus
        (document.getElementById('swal-playlist-name') as HTMLInputElement)?.blur();
      },
      focusConfirm: false,
      preConfirm: () => {
        const playlistName = (document.getElementById('swal-playlist-name') as HTMLInputElement)?.value.trim();
        const fileInput = document.getElementById('swal-cover-file') as HTMLInputElement;
        const file = fileInput?.files?.[0];

        if (!playlistName) {
          Swal.showValidationMessage('Playlist name is required');
          return false;
        }

        if (file && !file.type.startsWith('image/')) {
          Swal.showValidationMessage('The selected file is not an image');
          return false;
        }

        return { playlistName, file };
      },
      customClass: {
        popup: 'dark-mode-popup',  // Custom CSS class
        title: 'dark-mode-title',
        confirmButton: 'dark-mode-confirm',
        cancelButton: 'dark-mode-cancel'
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { playlistName, file } = result.value;
        console.log('Playlist Name:', playlistName);
        console.log('Cover Image File:', file);
        this.updateItem(playlistName, file);
      }
    });
  }

  confirmDelete() {
    Swal.fire({
      title: "Delete from Your Library?",
      text: `This will delete ${this.playlist?.name} from Your Library.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
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

  updateItem(name: string, cover: File) {
    if (this.playlist) {
      this.playlistService.update(this.playlist.id, name, cover).subscribe(playlist => {
        this.playlist = playlist;
      });
    }
  }

  deleteItem() {
    if (this.playlist) {
      this.playlistService.delete(this.playlist.id).subscribe(() => {
        this.router.navigate(['/home']);
      })
    }
  }
}
