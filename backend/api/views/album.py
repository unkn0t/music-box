from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models.album import Album
from api.serializers.album import AlbumSerializer
from api.serializers.track import TrackSerializer


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
