from google.auth.transport import requests
from google.oauth2 import id_token
from api_auth.schemas.user import GoogleProfile, TokenSchema, AccessTokensObject
from api_auth.models.user import UserGoogleProfle
from django.contrib.auth import get_user_model
from ninja_jwt.tokens import RefreshToken
from hashlib import sha256

def generate_password(str:str) -> str:
    return sha256(bytes(str, encoding="raw_unicode_escape"), usedforsecurity=True).hexdigest()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return AccessTokensObject(
        refresh=str(refresh), 
        access=str(refresh.access_token)
    )

def get_google_profile(access_token: str) -> GoogleProfile:
    # Verify and decode the access token
    id_info = id_token.verify_oauth2_token(
        access_token, 
        requests.Request(), 
        None, 
        3
    )

    # Extract user profile information
    profile = {
        'user_id': id_info['sub'],
        'name': id_info.get('name', ''),
        'email': id_info.get('email', ''),
        'picture': id_info.get('picture', ''),
    }

    return profile


# TODO: need to optimize the whole flow, its just a bit too slow
def finalize_google_action(
        google_profile: UserGoogleProfle,
        created: bool
) -> TokenSchema | None:
    user = None
    if created:
        names = google_profile.name.split(" ")
        user = get_user_model().objects.create_user(
                username=google_profile.email,
                email=google_profile.email,
                google_profile=google_profile,
                password=generate_password(google_profile.user_id),
                last_name=names[-1],
                first_name=" ".join(names[0:-1])
        )
    else:
        user = get_user_model().objects.only("id").get(email=google_profile.email)
    
    if user is not None:
        return get_tokens_for_user(user)
    return None


def get_or_create_google_profile_object(google_object: GoogleProfile) -> tuple[UserGoogleProfle, bool]:
    return UserGoogleProfle.objects.get_or_create(
            user_id=google_object["user_id"],
            picture=google_object["picture"],
            name=google_object["name"],
            email=google_object["email"]
        )
