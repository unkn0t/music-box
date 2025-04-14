import os
import uuid

from django.utils.deconstruct import deconstructible


@deconstructible
class UploadToPath:
    def __init__(self, field_name):
        self.field_name = field_name

    def __call__(self, instance, filename):
        model_name = instance._meta.model_name
        ext = filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        if instance.pk:
            path = os.path.join(
                model_name, str(instance.pk), self.field_name, filename
            )
        else:
            path = os.path.join("temp", model_name, self.field_name, filename)
        return path
