from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import viewsets

from api.models.album import Album
from api.serializers.album import AlbumSerializer
from api.serializers.track import TrackSerializer


class AlbumViewSet(viewsets.ViewSet):

    def retrieve(self, request: Request, pk=None) -> Response:
        queryset = Album.objects.all()
        album = get_object_or_404(queryset, pk=pk)
        serializer = AlbumSerializer(album)
        return Response(serializer.data)

    @action(detail=True)
    def tracks(self, request: Request, pk=None) -> Response:
        queryset = Album.objects.all()
        album = get_object_or_404(queryset, pk=pk)
        tracks = album.tracks.order_by("track_number")
        serializer = TrackSerializer(tracks, many=True)
        return Response(serializer.data)
