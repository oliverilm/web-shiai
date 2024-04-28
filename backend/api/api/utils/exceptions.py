from ninja_extra import status

from ninja_extra.exceptions import (
    APIException,
)

"""
Available exception types are:

ValidationError
ParseError
AuthenticationFailed
NotAuthenticated
PermissionDenied
NotFound
MethodNotAllowed
NotAcceptable
UnsupportedMediaType
Throttled

"""

class ApiError:
    ObjectDoesNotExiste="ObjectDoesNotExist"
    PermissionDenied="PermissionDenied"
    NinjaValidationError="NinjaValidationError"
    ValidationError="ValidationError"
    FieldError="FieldError"
    UserAlreadyExistsError="UserAlreadyExistsError"

class UserAlreadyExistsError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = ("A server error occurred.")
    default_code = "error"

class GenericError(APIException):
    message = "GenericError"
    detail = "Something went wrong"
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY


class CustomApiException(Exception):
    pass