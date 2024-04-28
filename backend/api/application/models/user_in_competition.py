from django.db import models
from .utils import BaseModel
from django.conf import settings
from application.models import Competition

class UserInCompetition(BaseModel):
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        # make sure that the same user can not infinetly join the same competition
        unique_together = ('competition', 'user')