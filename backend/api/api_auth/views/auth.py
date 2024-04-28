from ninja_jwt.authentication import JWTAuth
from ninja import Router
from django.db.utils import IntegrityError
from django.contrib.auth import get_user_model

from api.utils.messages import UtilMessage, UtilMessageSchema
from api_auth.utils.google import get_google_profile, finalize_google_action, get_or_create_google_profile_object, get_tokens_for_user
from api.utils.exceptions import UserAlreadyExistsError
from api.utils.exceptions import CustomApiException
from api_auth.schemas.user import UserIn, UserOut
from api_auth.schemas.user import AccessToken, TokenSchema
from api_auth.models.user import AppUser
from api_auth.models.user import  AppUser

router = Router()

@router.post("/", response=UserOut)
def register_user(request, user_in: UserIn):
    try:
        return get_user_model().objects.create_user(
            username=user_in.email, 
            email=user_in.email, 
            password=user_in.password
        )
    except IntegrityError as error:
        raise UserAlreadyExistsError(error)


@router.get("/me", auth=JWTAuth(), response=UserOut)
def get_current_user(request):
    """
    Get the current authenticated user.
    """
    user = request.user

    if user.is_authenticated:
        return user
    else:
        raise CustomApiException("Authentication credentials were not provided.")
    


# register a new user with google.
@router.post("/google", response=TokenSchema)
def google_auth(request, access_token_in: AccessToken):
    try:
        google_profile = get_google_profile(access_token_in.access_token)
        
        if google_profile is None:
            raise CustomApiException("Unable to fetch the google profile.")
        
        # 1. check if google_profile with this google_profile.user_id exists

        try:
            user = get_user_model().objects.only(
                "google_profile", 
                "google_profile__user_id"
            ).select_related(
                "google_profile"
            ).get(google_profile__user_id=google_profile["user_id"])
            if user is not None: # TODO: do this later
                return get_tokens_for_user(user)
        except Exception as e:
            return finalize_google_action(
                *get_or_create_google_profile_object(google_profile)
            ) 
    except Exception as e:
        raise CustomApiException(e.args)


# create a link between the authenticated user and google. 
# so the user can log in with their google account instead of password and email
@router.post("/google-link", response=UtilMessageSchema, auth=JWTAuth())
def google_link(request, access_token_in: AccessToken):
    user: AppUser = request.user 

    if user.google_profile is not None:
        raise CustomApiException("Google provider already linked.")
    
    fetched_google_profile = get_google_profile(access_token_in.access_token)

    if fetched_google_profile is None:
        raise CustomApiException("Google profile not available.")
    
    # TODO: need to check first, if a google_profile with this data exists.
    created_google_profile, created = get_or_create_google_profile_object(fetched_google_profile)

    if not created:
        raise CustomApiException("Google profile already exists")

    
    user.google_profile = created_google_profile
    user.save() 
    return UtilMessage(message="Google profile linked!")
    

# delete user google link
@router.post("/google-unlink", response=UtilMessageSchema, auth=JWTAuth())
def google_unlink(request):
    user: AppUser = request.user

    if user.google_profile is None:
        raise CustomApiException("Profile not linked")
    
    user.google_profile.delete()

    return UtilMessage(message="Google profile unlinked")