import {Component, Inject, inject, OnInit} from '@angular/core';
import {Playlist} from '../playlist';
import {Track} from '../track';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {UserService} from '../user.service';
import {PlaylistService} from '../playlist.service';
import {MatList, MatListItem} from '@angular/material/list';
import {NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-playlist-dialog',
  imports: [
    MatDialogContent,
    MatList,
    MatListItem,
    MatButton,
    MatDialogActions,
    NgIf,
    NgForOf,
    MatDialogTitle
  ],
  templateUrl: './playlist-dialog.component.html',
  styleUrl: './playlist-dialog.component.css'
})
export class PlaylistDialogComponent implements OnInit {
  playlists: Playlist[] = [];
  track: Track;

  private dialogRef = inject(MatDialogRef<PlaylistDialogComponent>);
  private userService = inject(UserService);
  private playlistService = inject(PlaylistService);

  constructor(@Inject(MAT_DIALOG_DATA) data: { track: Track }) {
    this.track = data.track;
  }

  ngOnInit() {
    this.userService.playlists().subscribe(playlists => {
      this.playlists = playlists;
    })
  }

  addTo(playlist: Playlist) {
    this.playlistService.appendTracks(playlist.id, [this.track]).subscribe(() => {
      this.dialogRef.close({ added: true, playlist });
    });
  }

  close() {
    this.dialogRef.close();
  }
}
