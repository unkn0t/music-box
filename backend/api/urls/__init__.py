from django.urls import path, include

urlpatterns = [
    path("artists/", include("api.urls.artist")),
    path("albums/", include("api.urls.album")),
    path("playlists/", include("api.urls.playlist")),
    path("users/", include("api.urls.user")),
]
