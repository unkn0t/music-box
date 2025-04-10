from uuid import UUID

from django.contrib.auth.models import User
from django.db import transaction
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Album, Artist, Playlist, PlaylistTracks, Track
from .permissions import IsOwner
from .serializers import (
    AlbumSerializer,
    ArtistSerializer,
    PlaylistSerializer,
    TrackSerializer,
    UserSerializer,
)


class UserDetails(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        try:
            user = User.objects.get(pk=request.user.id)
            serializer = UserSerializer(user)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data)


class UserListPlaylists(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = User.objects.get(pk=user_id)
            serializer = PlaylistSerializer(user.playlists, many=True)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data)


@api_view(["GET"])
def artist_list(request):
    artists = Artist.objects.all()
    serializer = ArtistSerializer(artists, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def artist_details(request, artist_id):
    try:
        artist = Artist.objects.get(pk=artist_id)
        serializer = ArtistSerializer(artist)
    except Artist.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    return Response(serializer.data)


@api_view(["GET"])
def artist_list_albums(request, artist_id):
    albums = Album.objects.filter(artists__id=artist_id)
    serializer = AlbumSerializer(albums, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def artist_list_tracks(request, artist_id):
    tracks = Track.objects.filter(artists__id=artist_id)
    serializer = TrackSerializer(tracks, many=True)
    return Response(serializer.data)


class AlbumDetails(APIView):
    def get(self, request, album_id, format=None):
        try:
            album = Album.objects.get(pk=album_id)
            serializer = AlbumSerializer(album)
        except Album.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data)


@api_view(["GET"])
def album_list_tracks(request, album_id):
    try:
        tracks = Album.objects.get(pk=album_id).tracks.order_by("track_number")
        serializer = TrackSerializer(tracks, many=True)
        return Response(serializer.data)
    except Album.DoesNotExist as e:
        return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


class PlaylistList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        playlists = Playlist.objects.filter(owner=request.user)
        serializer = PlaylistSerializer(playlists, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = PlaylistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )


class PlaylistDetails(APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get(self, request, playlist_id, format=None):
        try:
            playlist = Playlist.objects.get(pk=playlist_id)
            serializer = PlaylistSerializer(playlist)
        except Playlist.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data)

    def put(self, request, playlist_id, format=None):
        try:
            playlist = Playlist.objects.get(pk=playlist_id)
            serializer = PlaylistSerializer(playlist, data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(
                    serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )
        except Playlist.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, playlist_id, format=None):
        try:
            playlist = Playlist.objects.get(pk=playlist_id)
            playlist.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Playlist.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


class PlaylistListTracks(APIView):
    permission_classes = (permissions.IsAuthenticated, IsOwner)

    def get(self, request, playlist_id, format=None):
        try:
            tracks = Playlist.objects.get(pk=playlist_id).tracks.order_by(
                "track_number"
            )
            serializer = TrackSerializer(tracks, many=True)
            return Response(serializer.data)
        except Playlist.DoesNotExist as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, playlist_id, format=None):
        data = request.data
        position = data.get("position")
        track_ids = data.get("track_ids", [])

        # Validate playlist existence
        try:
            playlist = Playlist.objects.get(id=playlist_id)
        except (Playlist.DoesNotExist, ValueError):
            return Response(
                {"error": "Invalid playlist ID"},
                status == status.HTTP_400_BAD_REQUEST,
            )

        # Validate that 'position' is an integer and at least 0
        if not isinstance(position, int) or position < 0:
            return Response(
                {"error": "Invalid position value"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate track_ids format and existence
        try:
            track_ids = [UUID(tid) for tid in track_ids]
        except ValueError:
            return Response(
                {"error": "One or more invalid track UUIDs"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        tracks = Track.objects.filter(id__in=track_ids)
        if tracks.count() != len(track_ids):
            existing_ids = {str(track.id) for track in tracks}
            missing_ids = [
                str(tid) for tid in track_ids if str(tid) not in existing_ids
            ]
            return Response(
                {"error": f"Tracks not found: {missing_ids}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            shift_count = len(track_ids)
            existing_playlist_tracks = PlaylistTracks.objects.filter(
                playlist=playlist, track_number__gt=position
            )

            for item in existing_playlist_tracks.order_by("-track_number"):
                item.track_number += shift_count
                item.save()

            new_playlist_tracks = []
            for i, tid in enumerate(track_ids):
                new_track_number = position + i
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
