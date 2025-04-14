from django.urls import path

from api.views.album import AlbumDetails, album_list_tracks

urlpatterns = [
    path("<uuid:album_id>/", AlbumDetails.as_view()),
    path("<uuid:album_id>/tracks/", album_list_tracks),
]
