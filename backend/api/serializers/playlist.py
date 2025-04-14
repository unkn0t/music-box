from rest_framework import serializers

from api.models.playlist import Playlist


class PlaylistSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Playlist
        fields = ["id", "name", "cover", "tracks", "owner"]
