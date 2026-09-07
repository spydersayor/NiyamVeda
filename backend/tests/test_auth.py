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
    assert user["username"] == "rajesh_sharma"

def test_auth_demo_login_endpoint():
    resp = client.post("/api/auth/demo-login")
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == "demo@niyamveda.gov.in"
    assert data["user"]["username"] == "rajesh_sharma"

def test_auth_register_and_login():
    rand_email = f"test_{uuid.uuid4().hex[:6]}@example.com"
    rand_username = f"u_{uuid.uuid4().hex[:8]}"
    reg_resp = client.post("/api/auth/register", json={
        "email": rand_email,
        "password": "mypassword123",
        "full_name": "Test User",
        "username": rand_username,
        "company_name": "Test Devices Ltd."
    })
    assert reg_resp.status_code == 200
    reg_data = reg_resp.json()
    token = reg_data["access_token"]
    assert token.startswith("nv-token-")
    assert reg_data["user"]["username"] == rand_username
    assert reg_data["user"]["full_name"] == "Test User"

    # Login with same credentials
    login_resp = client.post("/api/auth/login", json={
        "email": rand_email,
        "password": "mypassword123"
    })
    assert login_resp.status_code == 200
    assert login_resp.json()["user"]["email"] == rand_email
    assert login_resp.json()["user"]["username"] == rand_username

    # Verify /api/auth/me returns username and full_name
    me_resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["full_name"] == "Test User"
    assert me_resp.json()["username"] == rand_username

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
    rand_u = f"wp_{uuid.uuid4().hex[:6]}"
    reg = client.post("/api/auth/register", json={
        "email": rand_email,
        "password": "correctpassword",
        "full_name": "WrongPass Tester",
        "username": rand_u,
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
    rand_u = f"wp2_{uuid.uuid4().hex[:6]}"
    client.post("/api/auth/register", json={
        "email": rand_email,
        "password": "correctpassword",
        "full_name": "WrongPass Tester 2",
        "username": rand_u,
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
    rand_u = f"real_{uuid.uuid4().hex[:6]}"
    client.post("/api/auth/register", json={
        "email": rand_email,
        "password": "myrealpassword",
        "full_name": "Real User",
        "username": rand_u,
        "company_name": "Real Corp",
    })

    resp = client.post("/api/auth/login", json={
        "email": rand_email,
        "password": "myrealpassword",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["user"]["email"] == rand_email
    assert data["user"]["username"] == rand_u
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
    assert data["user"]["username"] == "rajesh_sharma"
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


# ============================================================================
# FULL NAME VALIDATION TESTS
# ============================================================================

@pytest.mark.parametrize("valid_name", [
    "Rajesh",
    "Rajesh Kumar",
    "Rajesh Kumar Sharma",
    "Rishi Samaddar",
])
def test_valid_full_names_accepted(valid_name):
    from app.schemas.auth import UserRegister
    # 1. Direct schema validation
    u = UserRegister(
        email=f"fn_{uuid.uuid4().hex[:6]}@example.com",
        password="validpassword123",
        full_name=valid_name,
        username=f"u_{uuid.uuid4().hex[:6]}",
        company_name="Testing Ltd."
    )
    assert u.full_name == valid_name

    # 2. Endpoint validation
    rand_email = f"fn_ok_{uuid.uuid4().hex[:6]}@example.com"
    rand_u = f"fn_ok_{uuid.uuid4().hex[:6]}"
    resp = client.post("/api/auth/register", json={
        "email": rand_email,
        "password": "validpassword123",
        "full_name": valid_name,
        "username": rand_u,
        "company_name": "Testing Ltd."
    })
    assert resp.status_code == 200, f"Expected 200 for valid name '{valid_name}', got: {resp.text}"
    assert resp.json()["user"]["full_name"] == valid_name


@pytest.mark.parametrize("invalid_name", [
    "Rajesh123",
    "Rajesh_Kumar",
    "Rajesh-Kumar",
    "Rajesh@Kumar",
    "Rajesh123 Sharma",
    "Rajesh  Kumar",  # multiple spaces
    "Rajesh ",        # trailing space
    " Rajesh",        # leading space
    ".Rajesh",        # leading dot
    "Rajesh.",        # trailing dot
    "Rajesh\tKumar",  # tab
    "Rajesh\nKumar",  # newline
    "Rajesh#Kumar",   # symbol
    "12345",          # numeric only
])
def test_invalid_full_names_rejected(invalid_name):
    rand_email = f"fn_bad_{uuid.uuid4().hex[:6]}@example.com"
    rand_u = f"fn_bad_{uuid.uuid4().hex[:6]}"
    resp = client.post("/api/auth/register", json={
        "email": rand_email,
        "password": "validpassword123",
        "full_name": invalid_name,
        "username": rand_u,
        "company_name": "Testing Ltd."
    })
    assert resp.status_code in (400, 422), f"Expected 400/422 for invalid name '{invalid_name}', got: {resp.status_code}"


# ============================================================================
# USERNAME VALIDATION TESTS
# ============================================================================

@pytest.mark.parametrize("valid_username", [
    "rishi",
    "rishi123",
    "rishi_s",
    "RajeshKumar",
    "rajesh_2026",
    "abc",                           # exactly 3 chars (minimum)
    "a" * 30,                        # exactly 30 chars (maximum)
])
def test_valid_usernames_accepted(valid_username):
    from app.schemas.auth import UserRegister
    # 1. Direct schema validation on exact string
    u = UserRegister(
        email=f"u_{uuid.uuid4().hex[:6]}@example.com",
        password="validpassword123",
        full_name="Valid Name",
        username=valid_username,
        company_name="Testing Ltd."
    )
    assert u.username == valid_username

    # 2. Endpoint validation using unique string derived from test case
    unique_u = f"{valid_username[:20]}_{uuid.uuid4().hex[:6]}"
    rand_email = f"u_ok_{uuid.uuid4().hex[:6]}@example.com"
    resp = client.post("/api/auth/register", json={
        "email": rand_email,
        "password": "validpassword123",
        "full_name": "Valid Name",
        "username": unique_u,
        "company_name": "Testing Ltd."
    })
    assert resp.status_code == 200, f"Expected 200 for valid username '{unique_u}', got: {resp.text}"
    assert resp.json()["user"]["username"] == unique_u


@pytest.mark.parametrize("invalid_username", [
    "rs",                            # < 3 characters
    "rishi kumar",                   # contains space
    "rishi-kumar",                   # contains hyphen
    "rishi@gmail.com",               # contains @ and .
    "rishi.kumar",                   # contains dot
    "rishi!",                        # contains exclamation
    "a" * 31,                        # > 30 characters
    "",                              # empty
    "   ",                           # whitespace
    "rishi#123",                     # contains hash
    "user$name",                     # contains dollar
])
def test_invalid_usernames_rejected(invalid_username):
    rand_email = f"u_bad_{uuid.uuid4().hex[:6]}@example.com"
    resp = client.post("/api/auth/register", json={
        "email": rand_email,
        "password": "validpassword123",
        "full_name": "Valid Name",
        "username": invalid_username,
        "company_name": "Testing Ltd."
    })
    assert resp.status_code in (400, 422), f"Expected 400/422 for invalid username '{invalid_username}', got: {resp.status_code}"


# ============================================================================
# CASE-INSENSITIVE DUPLICATE USERNAME TESTS
# ============================================================================

def test_case_insensitive_duplicate_username():
    """
    Treat:
    Rishi
    rishi
    RISHI
    as the same username.
    """
    base_u = f"Rishi_{uuid.uuid4().hex[:4]}"
    
    # 1. Register first account with Mixed Case
    resp1 = client.post("/api/auth/register", json={
        "email": f"ci_first_{uuid.uuid4().hex[:6]}@example.com",
        "password": "validpassword123",
        "full_name": "First User",
        "username": base_u,
        "company_name": "Testing Ltd."
    })
    assert resp1.status_code == 200, f"Initial registration failed: {resp1.text}"

    # 2. Register second account with lowercase version
    resp2 = client.post("/api/auth/register", json={
        "email": f"ci_second_{uuid.uuid4().hex[:6]}@example.com",
        "password": "validpassword123",
        "full_name": "Second User",
        "username": base_u.lower(),
        "company_name": "Testing Ltd."
    })
    assert resp2.status_code == 400, f"Expected 400 for lowercase duplicate username, got: {resp2.status_code}"
    detail2 = resp2.json().get("detail", "")
    assert "already taken" in detail2.lower()

    # 3. Register third account with UPPERCASE version
    resp3 = client.post("/api/auth/register", json={
        "email": f"ci_third_{uuid.uuid4().hex[:6]}@example.com",
        "password": "validpassword123",
        "full_name": "Third User",
        "username": base_u.upper(),
        "company_name": "Testing Ltd."
    })
    assert resp3.status_code == 400, f"Expected 400 for uppercase duplicate username, got: {resp3.status_code}"
    detail3 = resp3.json().get("detail", "")
    assert "already taken" in detail3.lower()


# ============================================================================
# SAFE EXISTING-USER MIGRATION HELPER TESTS
# ============================================================================

def test_safe_username_migration_rules():
    import re
    from app.core.database import generate_safe_username

    existing: set = set()

    # 1. Very long email local part
    long_email = "verylongemailaddress123456789extraordinarilylong@gmail.com"
    u1 = generate_safe_username(long_email, existing)
    assert 3 <= len(u1) <= 30
    assert re.match(r"^[A-Za-z0-9_]{3,30}$", u1)

    # 2. Email local part containing dots
    dot_email = "john.doe.middle.name@example.com"
    u2 = generate_safe_username(dot_email, existing)
    assert 3 <= len(u2) <= 30
    assert "." not in u2
    assert re.match(r"^[A-Za-z0-9_]{3,30}$", u2)

    # 3. Email local part containing hyphens and symbols
    hyphen_email = "user-with-hyphens+extra@example.com"
    u3 = generate_safe_username(hyphen_email, existing)
    assert 3 <= len(u3) <= 30
    assert "-" not in u3
    assert "+" not in u3
    assert re.match(r"^[A-Za-z0-9_]{3,30}$", u3)

    # 4. Short email local part (< 3 chars)
    short_email = "ab@example.com"
    u4 = generate_safe_username(short_email, existing)
    assert 3 <= len(u4) <= 30
    assert re.match(r"^[A-Za-z0-9_]{3,30}$", u4)

    # 5. Collision between two generated usernames
    c_set: set = set()
    col1 = generate_safe_username("duplicate_user@domain1.com", c_set)
    col2 = generate_safe_username("duplicate_user@domain2.com", c_set)
    col3 = generate_safe_username("DUPLICATE_USER@domain3.com", c_set)

    assert col1.lower() != col2.lower()
    assert col1.lower() != col3.lower()
    assert col2.lower() != col3.lower()
    assert 3 <= len(col1) <= 30
    assert 3 <= len(col2) <= 30
    assert 3 <= len(col3) <= 30
    assert re.match(r"^[A-Za-z0-9_]{3,30}$", col1)
    assert re.match(r"^[A-Za-z0-9_]{3,30}$", col2)
    assert re.match(r"^[A-Za-z0-9_]{3,30}$", col3)
