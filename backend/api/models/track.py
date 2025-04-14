import uuid

from django.db import models
from mutagen.mp3 import MP3

from api.models.album import Album
from api.models.artist import Artist
from api.models.utils import UploadToPath


class Track(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=256)
    album = models.ForeignKey(
        Album, related_name="tracks", on_delete=models.CASCADE
    )
    track_number = models.PositiveIntegerField()
    duration_ms = models.PositiveIntegerField(editable=False, blank=True)
    artists = models.ManyToManyField(Artist)
    audio = models.FileField(upload_to=UploadToPath("audio"))

    def __str__(self):
        return f"{self.name}({self.id})"

    def save(self, *args, **kwargs):
        try:
            audio = MP3(self.audio)
            self.duration_ms = int(audio.info.length * 1000)
            super().save(*args, **kwargs)
        except Exception as e:
            print(f"Error reading MP3 file: {e}")

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["album", "track_number"], name="unique_track_order"
            )
        ]
