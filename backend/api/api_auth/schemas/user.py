from ninja import Schema
from ninja import ModelSchema
from api_auth.models.user import AppUser

class UserOut(ModelSchema):
    class Meta:
        model = AppUser
        exclude = ["password",]

class UserIn(ModelSchema):
    class Meta:
        model = AppUser
        fields = ["email", "password"]



# ------------------------------------------

# google endpoint accepted value
class AccessToken(Schema):
    access_token: str

# google endpoint retuned object
class AccessTokensObject:
    def __init__(self, access, refresh) -> None:
        self.access = access
        self.refresh = refresh
    
# google endpoint retuned object schema
class TokenSchema(Schema):
    access: str
    refresh: str

# response from google
class GoogleProfile(Schema):
    email: str
    picture: str
    user_id: str
    name: str

# ------------------------------------------
