import uuid
import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from app.main import app
from app.repositories.user_repo import user_repository
from app.api.auth import _hash_token
from app.core.database import get_connection

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

def test_auth_logout():
    # Login as demo user
    resp = client.post("/api/auth/demo-login")
    assert resp.status_code == 200
    token = resp.json()["access_token"]

    # Verify accessible with token
    me_resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200

    # Logout
    logout_resp = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert logout_resp.status_code == 200

    # Subsequent access should fail with 401
    me_after_logout = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_after_logout.status_code == 401

def test_auth_expired_session():
    # Create an expired session directly in the database
    user = user_repository.get_by_email("demo@niyamveda.gov.in")
    assert user is not None

    fake_token = f"nv-expired-{uuid.uuid4().hex}"
    fake_token_hash = _hash_token(fake_token)
    past_time = datetime.now(timezone.utc) - timedelta(hours=2)

    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (%s, %s, %s)",
                (fake_token_hash, user["id"], past_time)
            )

    # Calling /me with expired token should yield 401
    resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {fake_token}"})
    assert resp.status_code == 401
    assert "expired" in resp.json()["detail"].lower()
