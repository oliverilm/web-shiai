from ninja import Router

router = Router()

@router.get("/test")
def test_endpoint(request):
    raise Exception("AAAAAA incorrect")