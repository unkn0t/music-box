from rest_framework import serializers
from .models import Artist, Album, Track, Playlist
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ["id", "username", "email"]


class ArtistSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Artist
        fields = ["id", "name", "photo"]


class AlbumSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    artists = ArtistSerializer(many=True)

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
    id = serializers.ReadOnlyField()
    duration_ms = serializers.ReadOnlyField()
    artists = ArtistSerializer(many=True)

    class Meta:
        model = Track
        fields = ["id", "name", "duration_ms", "album", "artists", "audio"]


class PlaylistSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Playlist
        fields = ["id", "name", "cover", "tracks", "owner"]
