import uuid

from django.db import models

from api.models.artist import Artist
from api.models.utils import UploadToPath


class Album(models.Model):
    class AlbumType(models.TextChoices):
        ALBUM = "album"
        SINGLE = "single"

    class DatePrecision(models.TextChoices):
        YEAR = "year"
        MONTH = "month"
        DAY = "day"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=512)
    album_type = models.CharField(max_length=10, choices=AlbumType)
    cover = models.ImageField(upload_to=UploadToPath("cover"))
    release_date = models.DateField()
    release_date_precision = models.CharField(
        max_length=5, choices=DatePrecision
    )
    artists = models.ManyToManyField(Artist)

    def __str__(self):
        return f"{self.name}({self.id})"
