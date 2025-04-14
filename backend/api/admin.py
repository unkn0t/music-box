from django.contrib import admin

from api.models.album import Album
from api.models.artist import Artist
from api.models.playlist import Playlist, PlaylistTracks
from api.models.track import Track

admin.site.register(Artist)
admin.site.register(Album)
admin.site.register(Track)
admin.site.register(Playlist)
admin.site.register(PlaylistTracks)
