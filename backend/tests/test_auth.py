import pytest
from app.repositories.user_repo import user_repository
from app.schemas.auth import UserRegister, UserLogin
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_demo_user_seeded():
    user = user_repository.get_by_email("demo@niyamveda.gov.in")
    assert user is not None
    assert user["full_name"] == "Rajesh Kumar Sharma"
    assert user["company_name"] == "Apex PureWater Innovations Pvt. Ltd."

def test_auth_demo_login_endpoint():
    resp = client.post("/api/auth/demo-login")
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == "demo@niyamveda.gov.in"

def test_auth_register_and_login():
    import uuid
    rand_email = f"test_{uuid.uuid4().hex[:6]}@example.com"
    reg_resp = client.post("/api/auth/register", json={
        "email": rand_email,
        "password": "mypassword123",
        "full_name": "Test User",
        "company_name": "Test Devices Ltd."
    })
    assert reg_resp.status_code == 200
    token = reg_resp.json()["access_token"]
    assert token.startswith("nv-token-")

    # Login with same credentials
    login_resp = client.post("/api/auth/login", json={
        "email": rand_email,
        "password": "mypassword123"
    })
    assert login_resp.status_code == 200
    assert login_resp.json()["user"]["email"] == rand_email

    # Verify /api/auth/me
    me_resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["full_name"] == "Test User"
