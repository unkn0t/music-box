from django.urls import path

from . import views

urlpatterns = [
    # Artist
    path("artists/", views.artist_list),
    path("artists/<int:artist_id>/", views.artist_details),
    path("artists/<int:artist_id>/albums/", views.artist_list_albums),
    path("artists/<int:artist_id>/tracks/", views.artist_list_tracks),
    # Album
    path("albums/<int:album_id>/", views.AlbumDetails.as_view()),
    path("albums/<int:album_id>/tracks/", views.album_list_tracks),
    # Playlist
    path("playlists/<int:playlist_id>/", views.PlaylistDetails.as_view()),
    path("playlists/<int:playlist_id>/tracks/", views.playlist_list_tracks),
    # User
    path("users/<int:user_id>/playlists/", views.UserListPlaylists.as_view()),
]
