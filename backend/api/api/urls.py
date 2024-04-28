"""
URL configuration for api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from ninja import Swagger
from ninja.errors import ValidationError as NinjaValidationError
from ninja_extra import NinjaExtraAPI
from ninja_jwt.controller import AsyncNinjaJWTDefaultController
from django.conf import settings
from django.conf.urls.static import static
from http import HTTPStatus
from api.utils.exceptions import ApiError, CustomApiException

from django.core.exceptions import (
    FieldError,
    ObjectDoesNotExist,
    PermissionDenied,
    ValidationError,
)
from ninja.errors import ValidationError as NinjaValidationError
from api_auth.views import router as auth_router
from application.views import router as app_router 

api = NinjaExtraAPI(docs=Swagger(), version="authentication_v1")
api.register_controllers(AsyncNinjaJWTDefaultController)

# default authentication routes
api.add_router("/auth", auth_router, tags=["auth"])
api.add_router("/api", app_router, tags=["application"])


# TODO: move those handlers out of here
@api.exception_handler(ObjectDoesNotExist)
def handle_object_does_not_exist(request, exc):
    return api.create_response(
        request,
        {"message": ApiError.ObjectDoesNotExist, "detail": str(exc)},
        status=HTTPStatus.NOT_FOUND,
    )   


@api.exception_handler(PermissionDenied)
def handle_permission_error(request, exc: PermissionDenied):
    return api.create_response(
        request,
        {
            "message": ApiError.PermissionDenied,
            "detail": "You don't have the permission to access this resource.",
        },
        status=HTTPStatus.FORBIDDEN,
    )


@api.exception_handler(NinjaValidationError)
def handle_ninja_validation_error(request, exc: NinjaValidationError):
    mapped_msg = {error["loc"][-1]: error["msg"] for error in exc.errors}
    return api.create_response(
        request,
        data={"message": ApiError.NinjaValidationError, "detail": mapped_msg},
        status=HTTPStatus.BAD_REQUEST,
    )


@api.exception_handler(ValidationError)
def handle_validation_error(request, exc: ValidationError):
    status = HTTPStatus.BAD_REQUEST
    for field, errors in exc.error_dict.items():
        for error in errors:
            if error.code in ["unique", "unique_together"]:
                status = HTTPStatus.CONFLICT
    return api.create_response(
        request,
        data={"message": ApiError.ValidationError, "detail": exc.message_dict},
        status=status,
    )

@api.exception_handler(FieldError)
def handle_field_error(request, exc: FieldError):
    return api.create_response(
        request,
        data={"message": ApiError.FieldError, "detail": str(exc)},
        status=HTTPStatus.BAD_REQUEST,
    )

@api.exception_handler(CustomApiException)
def handle_generic_error(request, exc: CustomApiException):
    return api.create_response(
        request,
        data={"messages": exc.args, "detail": "Error"}, # TODO: fix this
        status=HTTPStatus.BAD_REQUEST,
    )

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", api.urls),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
