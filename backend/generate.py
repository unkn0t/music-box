import os
import sys
import json
from django.contrib.auth import get_user_model

# Set up Django settings (adjust "your_project.settings" accordingly)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "musicbox.settings")

import django

django.setup()

from api.models import Artist, Album, Track, Playlist  # noqa: E402


User = get_user_model()

BASE_PATH = os.getcwd()
print(BASE_PATH)


def create_artists(artists_data):
    artist_mapping = {}
    for item in artists_data:
        name = item["name"]
        photo_path = item.get("photo")
        artist = Artist.objects.create(name=name, photo=photo_path)
        artist_mapping[name] = artist
    return artist_mapping


def create_albums(albums_data, artist_mapping):
    album_mapping = {}
    for item in albums_data:
        name = item["name"]
        album_type = item["album_type"]
        cover_path = item.get("cover")
        release_date = item["release_date"]
        date_precision = item["release_date_precision"]
        album = Album.objects.create(
            name=name,
            album_type=album_type,
            cover=cover_path,
            release_date=release_date,
            release_date_precision=date_precision,
        )
        # Set album artists by looking up names in the mapping
        album_artists = [
            artist_mapping.get(artist_name)
            for artist_name in item.get("artists", [])
        ]
        album.artists.set(
            [artist for artist in album_artists if artist is not None]
        )
        album_mapping[name] = album
    return album_mapping


def create_tracks(tracks_data, album_mapping, artist_mapping):
    track_mapping = {}
    for item in tracks_data:
        name = item["name"]
        album_name = item["album"]
        audio_path = item.get("audio")
        album = album_mapping.get(album_name)
        if not album:
            print(
                f"Album '{album_name}' not found for track '{name}'. Skipping."
            )
            continue
        track = Track.objects.create(name=name, album=album, audio=audio_path)
        track_artists = [
            artist_mapping.get(artist_name)
            for artist_name in item.get("artists", [])
        ]
        track.artists.set(
            [artist for artist in track_artists if artist is not None]
        )
        track_mapping[name] = track
    return track_mapping


def create_playlists(playlists_data, track_mapping):
    for item in playlists_data:
        name = item["name"]
        cover_path = item.get("cover")
        track_names = item.get("tracks", [])
        owner_username = item.get("owner")
        try:
            owner = User.objects.get(username=owner_username)
        except User.DoesNotExist:
            print(
                f"User '{owner_username}' not found for playlist '{name}'. Skipping."
            )
            continue
        playlist = Playlist.objects.create(
            name=name, cover=cover_path, owner=owner
        )
        playlist_tracks = [
            track_mapping.get(track_name) for track_name in track_names
        ]
        playlist.tracks.set(
            [track for track in playlist_tracks if track is not None]
        )
        print(f"Created playlist: {playlist}")


def main(json_file_path):
    if not os.path.exists(json_file_path):
        print(f"File not found: {json_file_path}")
        sys.exit(1)

    with open(json_file_path, "r") as f:
        data = json.load(f)

    artists_data = data.get("artists", [])
    albums_data = data.get("albums", [])
    tracks_data = data.get("tracks", [])
    playlists_data = data.get("playlists", [])

    # Create objects in order
    artist_mapping = create_artists(artists_data)
    album_mapping = create_albums(albums_data, artist_mapping)
    track_mapping = create_tracks(tracks_data, album_mapping, artist_mapping)
    create_playlists(playlists_data, track_mapping)

    print("Data import complete.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python generate.py path/to/data.json")
        sys.exit(1)
    json_file = sys.argv[1]
    main(json_file)
