from django.db import models
from .utils import BaseModel
from django.conf import settings

class CompetitionRole(BaseModel):
    name = models.CharField(max_length=255)
    occupant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)