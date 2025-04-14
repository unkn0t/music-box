from rest_framework import serializers

from api.models.artist import Artist


class ArtistSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Artist
        fields = ["id", "name", "photo"]
