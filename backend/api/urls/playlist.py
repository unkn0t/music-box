from django.urls import path

from api.views.playlist import PlaylistDetails, PlaylistListTracks

urlpatterns = [
    path("<uuid:playlist_id>/", PlaylistDetails.as_view()),
    path(
        "<uuid:playlist_id>/tracks/",
        PlaylistListTracks.as_view(),
    ),
]
