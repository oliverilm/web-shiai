from django.contrib.admin import ModelAdmin

from application.models import CompetitionRole
from django.contrib.admin import site


class CompetitionRoleModelAdmin(ModelAdmin):
    pass

site.register(CompetitionRole, CompetitionRoleModelAdmin)
