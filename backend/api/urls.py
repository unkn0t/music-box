from rest_framework.routers import DefaultRouter

from api.views.album import AlbumViewSet
from api.views.artist import ArtistViewSet
from api.views.playlist import PlaylistViewSet
from api.views.user import CurrentUserViewSet, UserViewSet

router = DefaultRouter()
router.register("artists", ArtistViewSet, basename="artist")
router.register("albums", AlbumViewSet, basename="album")
router.register("users", UserViewSet, basename="user")
router.register("me", CurrentUserViewSet, basename="me")
router.register("playlists", PlaylistViewSet, basename="playlist")
urlpatterns = router.urls
