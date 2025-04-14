from django.urls import path

from api.views.playlist import PlaylistList
from api.views.user import UserDetails, UserListPlaylists

urlpatterns = [
    path("me/playlists/", PlaylistList.as_view()),
    path("me/", UserDetails.as_view()),
    path("<int:user_id>/playlists/", UserListPlaylists.as_view()),
]
