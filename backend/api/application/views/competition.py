from ninja import Router
from ninja_jwt.authentication import  AsyncJWTAuth,JWTAuth

from application.models import Competition, UserInCompetition, UserInCompetitionRole
from ninja import Schema, ModelSchema
from django.contrib.auth.hashers import make_password, check_password
from api.utils.messages import UtilMessageSchema, UtilMessage
from pydantic import UUID4
from api.utils.exceptions import CustomApiException
from django.db.models import OuterRef, Exists
from asgiref.sync import sync_to_async
router = Router()

class CompetitionInSchema(Schema):
    password: str
    name: str

class CompetitionWithJoinStatusSchema(Schema):
    id: UUID4
    name: str
    is_joined: bool

class CompetitionOutSchema(Schema):
    id: UUID4
    name: str
    is_owner: bool


@router.post("/create-competition", response=CompetitionOutSchema, auth=AsyncJWTAuth())
async def create_competition(request, competition_in: CompetitionInSchema):
    competition = await Competition.objects.acreate(
        name=competition_in.name,
        password=make_password(competition_in.password),
        owner=request.user
    )
    competition.is_owner = True

    await UserInCompetition.objects.acreate(
        competition=competition,
        user=request.user
    )

    return competition

    

# TODO: add filtering for competition list
@router.get("/competitions", response=list[CompetitionWithJoinStatusSchema], auth=JWTAuth())
def competition_list(request):
    user_subquery = UserInCompetition.objects.filter(
        competition=OuterRef('pk'), 
        user=request.user
    )

    return Competition.objects.annotate(
        is_joined=Exists(user_subquery)
    )


class JoinCompetitionInSchema(Schema):
    password: str
    competition: str


@router.post("/competition-join", response=UtilMessageSchema, auth=AsyncJWTAuth())
async def join_competition(request, data: JoinCompetitionInSchema):
    try:
        competition = await Competition.objects.only("id", "password").aget(id=data.competition)
        # perhaps log the attempt and limit user from trying infinetly
        if not check_password(data.password, competition.password):
            raise Exception("Invalid password provided")
        
        await UserInCompetition.objects.acreate(
            competition=competition,
            user=request.user
        )

        return UtilMessage("Success!")
    except Exception as e:
        # log exception somewhere
        raise CustomApiException(e.args)
    
@router.get("/{id}", response=CompetitionOutSchema, auth=AsyncJWTAuth())
async def getCompetition(request, id: UUID4):
    competition = (await UserInCompetition.objects.prefetch_related("competition").aget(competition__pk=id, user=request.user)).competition

    competition.is_owner = competition.owner_id == request.user.pk
    return competition


class UserRoleInCompetitionSchema(Schema):
    role: str
    competition: str

class UserRoleOutCompetitionSchema(Schema):
    id: UUID4
    role: str
    user: int | None

@router.post("/{id}/roles", response=UserRoleOutCompetitionSchema, auth=AsyncJWTAuth())
async def create_role_in_competition(request, data_in: UserRoleInCompetitionSchema):
    competition = await sync_to_async(Competition.objects.only("owner_id").get)(id=data_in.competition)

    if competition.owner_id != request.user.pk:
        raise CustomApiException("No permissions to add roles to the competition")
    
    return await UserInCompetitionRole.objects.acreate(
        competition=competition,
        role=data_in.role,
        user=None
    )

@router.get("/{id}/roles", response=list[UserRoleOutCompetitionSchema] | None, auth=JWTAuth())
def get_competition_roles(request, id: UUID4):
    try:
        c = UserInCompetitionRole.objects.filter(competition__id=id)
        print(c)
        return c
    except Exception as e:
        return None
    
# TODO: add join role
# TODO: add leave role
