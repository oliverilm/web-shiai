from django.contrib.admin import ModelAdmin

from application.models import Competition
from django.contrib.admin import site


class CompetitionModelAdmin(ModelAdmin):
    list_display = ["id", "name", "owner", "is_active"]
    search_fields = ["name", "owner", "is_active"]
    sortable_by = ["name", "is_active"]
    
site.register(Competition, CompetitionModelAdmin)
