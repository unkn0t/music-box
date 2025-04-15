from http import HTTPMethod

from django.contrib.auth.models import User
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response

from api.serializers.playlist import PlaylistSerializer
from api.serializers.user import UserSerializer


class CurrentUserViewSet(viewsets.ViewSet):
    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request: Request) -> Response:
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=[HTTPMethod.GET, HTTPMethod.POST])
    def playlists(self, request: Request) -> Response:
        owner = request.user

        if request.method == "GET":
            serializer = PlaylistSerializer(owner.playlists, many=True)
            return Response(serializer.data)

        elif request.method == "POST":
            serializer = PlaylistSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(owner=owner)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    @action(detail=True)
    def playlists(self, request: Request, pk=None) -> Response:
        user = self.get_object()
        serializer = PlaylistSerializer(user.playlists, many=True)
        return Response(serializer.data)
