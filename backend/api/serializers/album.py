from rest_framework import serializers

from api.models.album import Album
from api.serializers.artist import ArtistSerializer


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
