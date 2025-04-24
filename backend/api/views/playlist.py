from http import HTTPMethod

from django.db import transaction
from django.db.models import F
from django.utils import timezone
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from api.models.playlist import Playlist, PlaylistTracks
from api.permissions import IsOwner
from api.serializers.playlist import (
    PlaylistInsertTracksSerializer,
    PlaylistRemoveTracksSerializer,
    PlaylistSerializer,
    PlaylistTrackSerializer,
)


class PlaylistViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner)

    @action(
        detail=True,
        methods=[HTTPMethod.GET, HTTPMethod.POST, HTTPMethod.DELETE],
    )
    def tracks(self, request: Request, pk=None) -> Response:
        playlist = self.get_object()

        if request.method == "GET":
            tracks = playlist.playlist_tracks.order_by("track_number")
            serializer = PlaylistTrackSerializer(tracks, many=True)
            return Response(serializer.data)

        elif request.method == "DELETE":
            serializer = PlaylistRemoveTracksSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            positions = sorted(serializer.validated_data["positions"])
            with transaction.atomic():
                for pos in positions:
                    PlaylistTracks.objects.filter(
                        playlist=playlist, track_number=pos
                    ).delete()

                    PlaylistTracks.objects.filter(
                        playlist=playlist,
                        track_number__gt=pos,
                    ).update(track_number=F("track_number") - 1)

            return Response(status=status.HTTP_204_NO_CONTENT)

        elif request.method == "POST":
            serializer = PlaylistInsertTracksSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            position = serializer.validated_data["position"]
            tracks = serializer.validated_data["tracks"]
            with transaction.atomic():
                shift = len(tracks)
                tracks_after_position = PlaylistTracks.objects.filter(
                    playlist=playlist, track_number__gt=position
                )

                for item in tracks_after_position.order_by("-track_number"):
                    item.track_number += shift
                    item.save()

                new_playlist_tracks = []
                for i, track in enumerate(tracks):
                    new_track_number = position + i + 1
                    new_playlist_tracks.append(
                        PlaylistTracks(
                            playlist=playlist,
                            track_id=track.id,
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
