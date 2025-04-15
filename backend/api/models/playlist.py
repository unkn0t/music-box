import uuid

from django.contrib.auth.models import User
from django.db import models

from api.models.track import Track
from api.models.utils import UploadToPath


class Playlist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=256)
    cover = models.ImageField(
        upload_to=UploadToPath("cover"), blank=True, null=True
    )
    tracks = models.ManyToManyField(Track, through="PlaylistTracks")
    owner = models.ForeignKey(
        User, related_name="playlists", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}({self.id})"


class PlaylistTracks(models.Model):
    playlist = models.ForeignKey(
        Playlist, related_name="playlist_tracks", on_delete=models.CASCADE
    )
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    track_number = models.PositiveIntegerField()
    added_at = models.DateField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["playlist", "track_number"],
                name="unique_playlist_track_order",
            )
        ]
