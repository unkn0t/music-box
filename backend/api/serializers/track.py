from rest_framework import serializers

from api.models.track import Track
from api.serializers.artist import ArtistSerializer


class TrackSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    duration_ms = serializers.ReadOnlyField()
    artists = ArtistSerializer(many=True)

    class Meta:
        model = Track
        fields = ["id", "name", "duration_ms", "album", "artists", "audio"]
