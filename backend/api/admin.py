from django.contrib import admin
from .models import Artist, Album, Track, Playlist, PlaylistTracks

admin.site.register(Artist)
admin.site.register(Album)
admin.site.register(Track)
admin.site.register(Playlist)
admin.site.register(PlaylistTracks)
