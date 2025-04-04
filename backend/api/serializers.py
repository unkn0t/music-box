from rest_framework import serializers
from .models import Artist, Album, Track, Playlist


class ArtistSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source="id")

    class Meta:
        model = Artist
        fields = ["id", "name", "photo"]


class AlbumSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source="id")

    class Meta:
        model = Album
        fields = [
            "id",
            "name",
            "album_type",
            "cover",
            "release_date",
            "release_date_precision",
            "artists",
        ]


class TrackSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source="id")

    class Meta:
        model = Track
        fields = ["id", "name", "album", "artists", "audio"]


class PlaylistSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source="id")
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Playlist
        fields = ["id", "name", "cover", "tracks", "owner"]
