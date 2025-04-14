import os

from django.core.files.storage import default_storage
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from api.models.album import Album
from api.models.artist import Artist
from api.models.playlist import Playlist
from api.models.track import Track


@receiver(post_save, sender=[Artist, Album, Track, Playlist])
def move_uploaded_files(sender, instance, created, **kwargs):
    if created:
        updates = []  # Track fields that need to be updated
        # Loop through all fields in the model
        for field in instance._meta.fields:
            # Check if the field is a FileField or ImageField
            if isinstance(field, models.FileField):
                file = getattr(instance, field.name)
                # Skip if no file is attached
                if not file:
                    continue
                # Check if the file is in the temporary directory
                if file.name.startswith("temp/"):
                    old_path = file.name
                    model_name = instance._meta.model_name
                    filename = os.path.basename(old_path)
                    # Build the new path
                    new_path = os.path.join(
                        model_name,
                        str(instance.pk),
                        field.name,  # Use the field's name
                        filename,
                    )
                    # Move the file using Django's storage API
                    if default_storage.exists(old_path):
                        with default_storage.open(old_path, "rb") as old_file:
                            saved_path = default_storage.save(
                                new_path, old_file
                            )
                        default_storage.delete(old_path)
                        # Update the field's path
                        setattr(instance, field.name, saved_path)
                        updates.append(field.name)
        # Save the instance once to update all modified fields
        if updates:
            instance.save(update_fields=updates)
