from django.http import Http404
from django.contrib.auth.models import User
from rest_framework import generics, mixins, status, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Album, Artist, Playlist, Track
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
    def get_object(self, pk):
        try:
            return Album.objects.get(pk=pk)
        except Album.DoesNotExist:
            raise Http404

    def get(self, request, album_id, format=None):
        album = self.get_object(album_id)
        serializer = AlbumSerializer(album)
        return Response(serializer.data)


@api_view(["GET"])
def album_list_tracks(request, album_id):
    tracks = Track.objects.filter(album__id=album_id)
    serializer = TrackSerializer(tracks, many=True)
    return Response(serializer.data)


class PlaylistDetails(mixins.RetrieveModelMixin, generics.GenericAPIView):
    queryset = Playlist.objects.all()
    serialiser = PlaylistSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


@api_view(["GET"])
def playlist_list_tracks(request, playlist_id):
    tracks = Playlist.objects.get(pk=playlist_id).tracks
    serializer = TrackSerializer(tracks, many=True)
    return Response(serializer.data)
