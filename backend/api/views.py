from django.contrib.auth.models import User
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Album, Artist, Playlist, Track
from .permissions import IsOwner
from .serializers import (
    AlbumSerializer,
    ArtistSerializer,
    PlaylistSerializer,
    TrackSerializer,
)


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
    tracks = Track.objects.filter(album__id=album_id)
    serializer = TrackSerializer(tracks, many=True)
    return Response(serializer.data)


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


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated, IsOwner])
def playlist_list_tracks(request, playlist_id):
    tracks = Playlist.objects.get(pk=playlist_id).tracks
    serializer = TrackSerializer(tracks, many=True)
    return Response(serializer.data)
