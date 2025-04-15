from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request

from api.models.artist import Artist
from api.serializers.album import AlbumSerializer
from api.serializers.artist import ArtistSerializer
from api.serializers.track import TrackSerializer


class ArtistViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer

    @action(detail=True)
    def albums(self, request: Request, pk=None) -> Response:
        artist = self.get_object()
        serializer = AlbumSerializer(artist.albums, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def tracks(self, request: Request, pk=None) -> Response:
        artist = self.get_object()
        serializer = TrackSerializer(artist.tracks, many=True)
        return Response(serializer.data)
