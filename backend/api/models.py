from django.db import models
from django.contrib.auth.models import User

from mutagen.mp3 import MP3


class Artist(models.Model):
    name = models.CharField(max_length=512)
    photo = models.ImageField(upload_to="assets/artists/photos/")

    def __str__(self):
        return f"{self.name}({self.id})"


class Album(models.Model):
    class AlbumType(models.TextChoices):
        ALBUM = "album"
        SINGLE = "single"

    class DatePrecision(models.TextChoices):
        YEAR = "year"
        MONTH = "month"
        DAY = "day"

    name = models.CharField(max_length=512)
    album_type = models.CharField(max_length=10, choices=AlbumType)
    cover = models.ImageField(upload_to="assets/albums/covers/")
    release_date = models.DateField()
    release_date_precision = models.CharField(
        max_length=5, choices=DatePrecision
    )
    artists = models.ManyToManyField(Artist)

    def __str__(self):
        return f"{self.name}({self.id})"


class Track(models.Model):
    name = models.CharField(max_length=256)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    duration_ms = models.PositiveIntegerField(
        editable=False, null=True, blank=True
    )
    artists = models.ManyToManyField(Artist)
    audio = models.FileField(upload_to="assets/songs/audios/")

    def __str__(self):
        return f"{self.name}({self.id})"

    def save(self, *args, **kwargs):
        if self.audio and not self.duration_ms:
            try:
                audio = MP3(self.audio)
                self.duration_ms = int(audio.info.length * 1000)
            except Exception as e:
                print(f"Error reading MP3 file: {e}")
                self.duration_ms = 0  # Fallback if there's an issue

        super().save(*args, **kwargs)


class Playlist(models.Model):
    name = models.CharField(max_length=256)
    cover = models.ImageField(
        upload_to="assets/playlists/cover/", blank=True, null=True
    )
    tracks = models.ManyToManyField(Track)
    owner = models.ForeignKey(
        User, related_name="playlists", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}({self.id})"
