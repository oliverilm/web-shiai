from typing import Iterable
from .utils import BaseModel
from django.db import models
from django.conf import settings
import uuid


class Competition(BaseModel):
    id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4)
    name = models.CharField(max_length=255)

    password = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=False)