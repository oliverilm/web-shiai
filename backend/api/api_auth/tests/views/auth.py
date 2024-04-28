from django.test import TestCase
from ninja.testing import TestClient
from api_auth.views.auth import no_auth_router
from api.utils.exceptions import UserAlreadyExistsError, GenericError

test_user = {
    "email": "testers@testers.com",
    "password": "string123"
}

class AuthenticationTests(TestCase):
    def test_user_create_success(self):
        client = TestClient(no_auth_router)

        response = client.post("/", json=test_user)
        self.assertEqual(response.status_code, 200)

    
    def test_user_unique_constraint(self):
        client = TestClient(no_auth_router)

        client.post("/", json=test_user)

        response = client.post("/", json=test_user)
        self.assertEqual(response.status_code, UserAlreadyExistsError.status_code)
        self.assertEqual(response.json()["detail"], "UNIQUE constraint failed: application_appuser.email")

    def test_user_field_error(self):
        client = TestClient(no_auth_router)

        response = client.post("/", json={"email": test_user["email"]})

        self.assertEqual(response.status_code, GenericError.status_code)
        self.assertEqual(response.json()["detail"], [{'type': 'missing', 'loc': ['body', 'user_in', 'password'], 'msg': 'Field required'}])


    def test_obtain_token(self):
        pass

    def test_refresh_token(self):
        pass

    def test_token_verify(self):
        pass