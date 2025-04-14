from django.urls import path

from api.views.artist import (
    artist_details,
    artist_list,
    artist_list_albums,
    artist_list_tracks,
)

urlpatterns = [
    path("", artist_list),
    path("<uuid:artist_id>/", artist_details),
    path("<uuid:artist_id>/albums/", artist_list_albums),
    path("<uuid:artist_id>/tracks/", artist_list_tracks),
]
