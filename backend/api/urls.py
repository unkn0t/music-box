from django.urls import path

from . import views

urlpatterns = [
    # Artist
    path("artists/", views.artist_list),
    path("artists/<uuid:artist_id>/", views.artist_details),
    path("artists/<uuid:artist_id>/albums/", views.artist_list_albums),
    path("artists/<uuid:artist_id>/tracks/", views.artist_list_tracks),
    # Album
    path("albums/<uuid:album_id>/", views.AlbumDetails.as_view()),
    path("albums/<uuid:album_id>/tracks/", views.album_list_tracks),
    # Playlist
    path("me/playlists/", views.PlaylistList.as_view()),
    path("playlists/<uuid:playlist_id>/", views.PlaylistDetails.as_view()),
    path("playlists/<uuid:playlist_id>/tracks/", views.playlist_list_tracks),
    # User
    path("me/", views.UserDetails.as_view()),
    path("users/<int:user_id>/playlists/", views.UserListPlaylists.as_view()),
]
