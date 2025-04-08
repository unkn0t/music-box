import os
import uuid

from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.files.storage import default_storage
from mutagen.mp3 import MP3

from django.utils.deconstruct import deconstructible


@deconstructible
class UploadToPath:
    def __init__(self, field_name):
        self.field_name = field_name

    def __call__(self, instance, filename):
        model_name = instance._meta.model_name
        ext = filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        if instance.pk:
            path = os.path.join(
                model_name, str(instance.pk), self.field_name, filename
            )
        else:
            path = os.path.join("temp", model_name, self.field_name, filename)
        return path


class Artist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=512)
    photo = models.ImageField(upload_to=UploadToPath("photo"))

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

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=512)
    album_type = models.CharField(max_length=10, choices=AlbumType)
    cover = models.ImageField(upload_to=UploadToPath("cover"))
    release_date = models.DateField()
    release_date_precision = models.CharField(
        max_length=5, choices=DatePrecision
    )
    artists = models.ManyToManyField(Artist)

    def __str__(self):
        return f"{self.name}({self.id})"


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
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    track_number = models.PositiveIntegerField()
    date_added = models.DateField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["playlist", "track_number"],
                name="unique_playlist_track_order",
            )
        ]


@receiver(post_save, sender=[Artist, Album, Track, Playlist])
def move_uploaded_files(sender, instance, created, **kwargs):
    if created:
        updates = []  # Track fields that need to be updated
        # Loop through all fields in the model
        for field in instance._meta.fields:
            # Check if the field is a FileField or ImageField
            if isinstance(field, models.FileField):
                file = getattr(instance, field.name)
                # Skip if no file is attached
                if not file:
                    continue
                # Check if the file is in the temporary directory
                if file.name.startswith("temp/"):
                    old_path = file.name
                    model_name = instance._meta.model_name
                    filename = os.path.basename(old_path)
                    # Build the new path
                    new_path = os.path.join(
                        model_name,
                        str(instance.pk),
                        field.name,  # Use the field's name
                        filename,
                    )
                    # Move the file using Django's storage API
                    if default_storage.exists(old_path):
                        with default_storage.open(old_path, "rb") as old_file:
                            saved_path = default_storage.save(
                                new_path, old_file
                            )
                        default_storage.delete(old_path)
                        # Update the field's path
                        setattr(instance, field.name, saved_path)
                        updates.append(field.name)
        # Save the instance once to update all modified fields
        if updates:
            instance.save(update_fields=updates)
