from rest_framework import serializers

from api.serializers.track import TrackSerializer
from api.models.playlist import Playlist, PlaylistTracks
from api.models.track import Track


class PlaylistTrackSerializer(serializers.ModelSerializer):
    track = TrackSerializer()

    class Meta:
        model = PlaylistTracks
        fields = ["track", "added_at"]


class PlaylistSerializer(serializers.ModelSerializer):
    tracks = PlaylistTrackSerializer(
        source="playlist_tracks", many=True, read_only=True
    )
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Playlist
        fields = ["id", "name", "cover", "tracks", "owner"]


class PlaylistInsertTracksSerializer(serializers.Serializer):
    position = (
        serializers.IntegerField()
    )  # TODO: Check that position is positive and less than current track count
    tracks = serializers.PrimaryKeyRelatedField(
        queryset=Track.objects.all(), many=True, allow_empty=False
    )
