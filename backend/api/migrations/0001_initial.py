# Generated by Django 5.2 on 2025-04-08 08:28

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Artist",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("name", models.CharField(max_length=512)),
                ("photo", models.ImageField(upload_to="assets/artists/photos/")),
            ],
        ),
        migrations.CreateModel(
            name="Album",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("name", models.CharField(max_length=512)),
                (
                    "album_type",
                    models.CharField(
                        choices=[("album", "Album"), ("single", "Single")],
                        max_length=10,
                    ),
                ),
                ("cover", models.ImageField(upload_to="assets/albums/covers/")),
                ("release_date", models.DateField()),
                (
                    "release_date_precision",
                    models.CharField(
                        choices=[("year", "Year"), ("month", "Month"), ("day", "Day")],
                        max_length=5,
                    ),
                ),
                ("artists", models.ManyToManyField(to="api.artist")),
            ],
        ),
        migrations.CreateModel(
            name="Playlist",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("name", models.CharField(max_length=256)),
                (
                    "cover",
                    models.ImageField(
                        blank=True, null=True, upload_to="assets/playlists/cover/"
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="playlists",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Track",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("name", models.CharField(max_length=256)),
                ("track_number", models.PositiveIntegerField()),
                (
                    "duration_ms",
                    models.PositiveIntegerField(blank=True, editable=False),
                ),
                ("audio", models.FileField(upload_to="assets/songs/audios/")),
                (
                    "album",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.album"
                    ),
                ),
                ("artists", models.ManyToManyField(to="api.artist")),
            ],
        ),
        migrations.CreateModel(
            name="PlaylistTracks",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("track_number", models.PositiveIntegerField()),
                ("date_added", models.DateField(auto_now_add=True)),
                (
                    "playlist",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.playlist"
                    ),
                ),
                (
                    "track",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="api.track"
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="playlist",
            name="tracks",
            field=models.ManyToManyField(through="api.PlaylistTracks", to="api.track"),
        ),
        migrations.AddConstraint(
            model_name="track",
            constraint=models.UniqueConstraint(
                fields=("album", "track_number"), name="unique_track_order"
            ),
        ),
        migrations.AddConstraint(
            model_name="playlisttracks",
            constraint=models.UniqueConstraint(
                fields=("playlist", "track_number"), name="unique_playlist_track_order"
            ),
        ),
    ]
