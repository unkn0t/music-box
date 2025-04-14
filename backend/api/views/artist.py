from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.models.album import Album
from api.models.artist import Artist
from api.models.track import Track
from api.serializers.album import AlbumSerializer
from api.serializers.artist import ArtistSerializer
from api.serializers.track import TrackSerializer


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
