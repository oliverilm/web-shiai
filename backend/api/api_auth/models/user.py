from django.contrib.auth.models import AbstractUser
from django.db import models

class UserGoogleProfle(models.Model):
    email = models.EmailField(unique=True)
    picture = models.URLField()
    user_id = models.CharField(unique=True, max_length=255)
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.email

class AppUser(AbstractUser):
    email = models.EmailField(unique=True)
    google_profile = models.OneToOneField(
        UserGoogleProfle, 
        null=True, 
        blank=True, 
        on_delete=models.SET_NULL
    )

    # add user related fields here