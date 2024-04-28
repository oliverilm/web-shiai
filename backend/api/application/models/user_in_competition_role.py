from django.db import models;
from .utils import BaseModel
from django.contrib.auth import get_user_model
class UserInCompetitionRole(BaseModel):
    user = models.ForeignKey(get_user_model(), on_delete=models.SET_NULL, null=True, blank=True, default=None)
    role = models.CharField(max_length=255)
    competition = models.ForeignKey("Competition", on_delete=models.CASCADE)

