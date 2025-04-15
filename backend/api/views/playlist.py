from http import HTTPMethod

from django.db import transaction
from django.utils import timezone
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from api.models.playlist import Playlist, PlaylistTracks
from api.permissions import IsOwner
from api.serializers.playlist import (
    PlaylistInsertTracksSerializer,
    PlaylistSerializer,
)
from api.serializers.playlist import PlaylistTrackSerializer


class PlaylistViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner)

    @action(detail=True, methods=[HTTPMethod.GET, HTTPMethod.POST])
    def tracks(self, request: Request, pk=None) -> Response:
        playlist = self.get_object()

        if request.method == "GET":
            tracks = playlist.playlist_tracks.order_by("track_number")
            serializer = PlaylistTrackSerializer(tracks, many=True)
            return Response(serializer.data)

        elif request.method == "POST":
            serializer = PlaylistInsertTracksSerializer(data=request.data)

            if not serializer.is_valid():
                return Response(
                    serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )

            position = serializer.data.get("position")
            tracks = serializer.data.get("tracks")
            with transaction.atomic():
                shift = len(tracks)
                tracks_after_position = PlaylistTracks.objects.filter(
                    playlist=playlist, track_number__gt=position
                )

                for item in tracks_after_position.order_by("-track_number"):
                    item.track_number += shift
                    item.save()

                new_playlist_tracks = []
                for i, tid in enumerate(tracks):
                    new_track_number = position + i + 1
                    new_playlist_tracks.append(
                        PlaylistTracks(
                            playlist=playlist,
                            track_id=tid,
                            track_number=new_track_number,
                        )
                    )
                PlaylistTracks.objects.bulk_create(new_playlist_tracks)

                playlist.updated_at = timezone.now()
                playlist.save()

            return Response(
                {"message": "Tracks inserted successfully"},
                status=status.HTTP_201_CREATED,
            )
