from rest_framework import serializers
from .models import Artist, Album, Track, Playlist


class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ["name", "photo"]


class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = [
            "name",
            "album_type",
            "cover",
            "release_date",
            "release_date_precision",
            "artists",
        ]


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ["name", "album", "artists", "audio"]


class PlaylistSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Playlist
        fields = ["name", "cover", "tracks", "owner"]
