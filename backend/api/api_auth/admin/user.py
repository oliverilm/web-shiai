from django.contrib import admin
from api_auth.models import AppUser, UserGoogleProfle
# Register your models here.

DEFAULT_LIST_PER_PAGE = 20

class HelperAdmin(admin.ModelAdmin):
    list_per_page = DEFAULT_LIST_PER_PAGE
    
# -------------------------------------------

class AppUserModelAdmin(HelperAdmin):
    list_display = ["email", "first_name", "last_name", "is_staff", "is_superuser"]
    search_fields = ["email", "username", "first_name", "last_name"]

admin.site.register(AppUser, AppUserModelAdmin)

# -------------------------------------------

class UserGoogleProfleModelAdmin(HelperAdmin):
    list_display = ["email", "name", "user_id", "picture"]
    search_fields = ["email", "name", "user_id"]

admin.site.register(UserGoogleProfle, UserGoogleProfleModelAdmin)

# -------------------------------------------
