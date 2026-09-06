import uuid
import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from app.main import app
from app.repositories.user_repo import user_repository
from app.api.auth import _hash_token
from app.core.database import get_connection

client = TestClient(app)

# ============================================================================
# Existing tests — must continue to pass
# ============================================================================

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


# ============================================================================
# SECURITY REGRESSION: Non-existent user must NEVER be logged in as demo
# ============================================================================

def test_nonexistent_user_login_returns_401():
    """
    An email address that has never been registered must produce a 401.
    The backend must NOT return a successful response or demo user data.
    """
    resp = client.post("/api/auth/login", json={
        "email": f"ghost_{uuid.uuid4().hex[:8]}@nowhere.example.com",
        "password": "anypassword123",
    })
    assert resp.status_code == 401, (
        f"Expected 401 for non-existent user, got {resp.status_code}: {resp.text}"
    )


def test_nonexistent_user_does_not_receive_session():
    """
    No session must be returned when a non-existent user attempts login.
    The response body must not contain an access_token.
    """
    resp = client.post("/api/auth/login", json={
        "email": f"ghost_{uuid.uuid4().hex[:8]}@nowhere.example.com",
        "password": "anypassword123",
    })
    assert resp.status_code == 401
    data = resp.json()
    assert "access_token" not in data, (
        "Backend must not return an access_token for a non-existent user"
    )


def test_nonexistent_user_does_not_receive_demo_user_data():
    """
    The error response for a non-existent user must never contain
    demo account identifiers.
    """
    resp = client.post("/api/auth/login", json={
        "email": f"ghost_{uuid.uuid4().hex[:8]}@nowhere.example.com",
        "password": "anypassword123",
    })
    assert resp.status_code == 401
    body = resp.text
    assert "demo@niyamveda.gov.in" not in body
    assert "usr-demo-001" not in body
    assert "nv-token-demo-fallback" not in body


def test_wrong_password_returns_401():
    """
    An existing user who supplies the wrong password must receive 401.
    No session must be created.
    """
    rand_email = f"wrongpass_{uuid.uuid4().hex[:6]}@example.com"
    reg = client.post("/api/auth/register", json={
        "email": rand_email,
        "password": "correctpassword",
        "full_name": "WrongPass Tester",
        "company_name": "Test Labs",
    })
    assert reg.status_code == 200

    resp = client.post("/api/auth/login", json={
        "email": rand_email,
        "password": "wrongpassword",
    })
    assert resp.status_code == 401, (
        f"Expected 401 for wrong password, got {resp.status_code}: {resp.text}"
    )
    data = resp.json()
    assert "access_token" not in data


def test_wrong_password_does_not_fallback_to_demo():
    """
    Wrong password for an existing user must not return demo user data.
    """
    rand_email = f"wrongpass2_{uuid.uuid4().hex[:6]}@example.com"
    client.post("/api/auth/register", json={
        "email": rand_email,
        "password": "correctpassword",
        "full_name": "WrongPass Tester 2",
        "company_name": "Test Labs",
    })

    resp = client.post("/api/auth/login", json={
        "email": rand_email,
        "password": "incorrectpassword",
    })
    assert resp.status_code == 401
    body = resp.text
    assert "demo@niyamveda.gov.in" not in body
    assert "nv-token-demo-fallback" not in body


def test_correct_credentials_login_as_that_user_not_demo():
    """
    A registered user with correct credentials must be authenticated as
    themselves, not as the demo account.
    """
    rand_email = f"realuser_{uuid.uuid4().hex[:6]}@example.com"
    client.post("/api/auth/register", json={
        "email": rand_email,
        "password": "myrealpassword",
        "full_name": "Real User",
        "company_name": "Real Corp",
    })

    resp = client.post("/api/auth/login", json={
        "email": rand_email,
        "password": "myrealpassword",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["user"]["email"] == rand_email
    assert data["user"]["email"] != "demo@niyamveda.gov.in"
    assert data["user"]["id"] != "usr-demo-001"
    assert data["access_token"] != "nv-token-demo-fallback"
    assert data["access_token"].startswith("nv-token-")


def test_demo_login_still_works():
    """
    The explicit demo login endpoint must continue to return the demo account.
    """
    resp = client.post("/api/auth/demo-login")
    assert resp.status_code == 200
    data = resp.json()
    assert data["user"]["email"] == "demo@niyamveda.gov.in"
    assert "access_token" in data
    assert data["access_token"] != "nv-token-demo-fallback"
    assert data["access_token"].startswith("nv-token-")


def test_fake_demo_fallback_token_does_not_grant_access():
    """
    The hardcoded 'nv-token-demo-fallback' value that used to be returned
    by the frontend catch() must not be accepted as a valid session token.
    """
    me = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer nv-token-demo-fallback"},
    )
    assert me.status_code == 401


def test_logout_invalidates_session_and_me_returns_401():
    """
    After logout the session token must no longer grant access to /me.
    """
    resp = client.post("/api/auth/demo-login")
    assert resp.status_code == 200
    token = resp.json()["access_token"]

    client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token}"})

    me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 401
