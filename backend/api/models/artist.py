import uuid

from django.db import models

from api.models.utils import UploadToPath


class Artist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=512)
    photo = models.ImageField(upload_to=UploadToPath("photo"))

    def __str__(self):
        return f"{self.name}({self.id})"
