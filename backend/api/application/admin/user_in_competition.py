from django.contrib.admin import ModelAdmin

from application.models import UserInCompetition
from django.contrib.admin import site


class UserInCompetitionModelAdmin(ModelAdmin):
    pass
    
site.register(UserInCompetition, UserInCompetitionModelAdmin)
