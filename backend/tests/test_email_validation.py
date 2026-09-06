import pytest
from pydantic import ValidationError
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.auth import UserRegister, UserLogin


client = TestClient(app)


# ============================================================================
# Helpers
# ============================================================================

def make_register(email: str) -> UserRegister:
    return UserRegister(
        email=email,
        password="validpassword123",
        full_name="Test User",
        company_name="Test Labs",
    )


def make_login(email: str) -> UserLogin:
    return UserLogin(
        email=email,
        password="validpassword123",
    )


# ============================================================================
# Schema-level validation
# ============================================================================

@pytest.mark.parametrize(
    "email",
    [
        "test@example.com",
        "user.name@example.com",
        "user-name@example.com",
        "user_name@example.com",
        "user+tag@example.com",
        "manufacturer@company.co.in",
        "User.Test@Example.COM",
        "  User.Test@Example.COM  ",
    ],
)
def test_valid_email_addresses_are_accepted(email):
    user = make_register(email)

    assert user.email == user.email.strip().lower()


@pytest.mark.parametrize(
    "email",
    [
        "test..user@gmail.com",
        ".test@gmail.com",
        "test.@gmail.com",
        "..test@gmail.com",
        "test...user@gmail.com",
    ],
)
def test_invalid_local_part_dot_structure_is_rejected(email):
    with pytest.raises(ValidationError):
        make_register(email)


@pytest.mark.parametrize(
    "email",
    [
        "invalid-email",
        "user@no-tld",
        "user@.domain.com",
        "user@domain..com",
        "user@domain.c",
        "@domain.com",
        "user@",
        "user space@gmail.com",
        "user@@gmail.com",
        "user@gmail@com",
        "user@-domain.com",
        "user@domain-.com",
        "user@gmail.com.",
    ],
)
def test_invalid_domain_or_email_structure_is_rejected(email):
    with pytest.raises(ValidationError):
        make_register(email)


# ============================================================================
# Normalization
# ============================================================================

def test_registration_email_is_normalized():
    user = make_register(
        "   Unique.Alpha.User@Example.COM   "
    )

    assert user.email == "unique.alpha.user@example.com"


def test_login_email_is_normalized():
    user = make_login(
        "   Unique.Alpha.User@Example.COM   "
    )

    assert user.email == "unique.alpha.user@example.com"


# ============================================================================
# Explicit mandatory regression cases
# ============================================================================

def test_consecutive_dots_are_rejected():
    with pytest.raises(ValidationError):
        make_register("test..user@gmail.com")


def test_leading_dot_is_rejected():
    with pytest.raises(ValidationError):
        make_register(".test@gmail.com")


def test_trailing_dot_is_rejected():
    with pytest.raises(ValidationError):
        make_register("test.@gmail.com")


# ============================================================================
# Mailbox existence is NOT verified
# ============================================================================

def test_validation_does_not_verify_mailbox_existence():
    """
    This project performs syntactic/structural email validation only.

    It does not attempt DNS, SMTP, or mailbox verification.
    """

    user = make_register(
        "nonexistent-mailbox@example.com"
    )

    assert user.email == "nonexistent-mailbox@example.com"


# ============================================================================
# API-level duplicate/normalization test
# ============================================================================

def test_duplicate_email_with_different_case_and_spacing_is_rejected():
    """
    Registration should treat differently-cased/spaced versions of the same
    email as the same account.

    This test uses a unique address to avoid colliding with unrelated tests.
    """

    email = "NiyamVeda.Email.Test.2026@Example.COM"
    normalized_email = "niyamveda.email.test.2026@example.com"

    first_payload = {
        "email": f"  {email}  ",
        "password": "securepassword123",
        "full_name": "Alpha Tester",
        "company_name": "Alpha Innovations",
    }

    first_response = client.post(
        "/api/auth/register",
        json=first_payload,
    )

    # If this test is run repeatedly against a persistent test DB,
    # the account may already exist. In that case we can still test
    # the duplicate behavior below.
    if first_response.status_code == 400:
        detail = first_response.json().get("detail", "")

        assert "already exists" in detail.lower()
    else:
        assert first_response.status_code == 200, (
            f"Initial registration failed: "
            f"{first_response.status_code} {first_response.text}"
        )

        response_data = first_response.json()

        assert response_data["user"]["email"] == normalized_email

    duplicate_payload = {
        "email": "NIYAMVEDA.EMAIL.TEST.2026@example.com",
        "password": "anotherpassword123",
        "full_name": "Duplicate Tester",
        "company_name": "Alpha Innovations",
    }

    duplicate_response = client.post(
        "/api/auth/register",
        json=duplicate_payload,
    )

    assert duplicate_response.status_code == 400

    detail = duplicate_response.json().get("detail", "")

    assert "already exists" in detail.lower()


# ============================================================================
# Login email validation — mandatory regression cases (schema level)
# ============================================================================

@pytest.mark.parametrize(
    "email",
    [
        "wish@123",          # numeric-only TLD (not alphabetic)
        "test",              # no @
        "test@",             # empty domain
        "test@gmail",        # missing TLD (only 1 domain label)
        "@gmail.com",        # empty local part
        "user@",             # empty domain
        "user@.com",         # domain starts with dot
        "user name@gmail.com",  # space in local part
        "test..user@gmail.com", # consecutive dots in local part
        ".test@gmail.com",   # local part starts with dot
        "test.@gmail.com",   # local part ends with dot
        "user@gmail..com",   # consecutive dots in domain
    ],
)
def test_login_invalid_email_is_rejected_by_schema(email):
    """
    UserLogin schema must reject the same malformed emails as UserRegister.
    The backend must not attempt authentication for any of these.
    """
    with pytest.raises(ValidationError):
        make_login(email)


@pytest.mark.parametrize(
    "email",
    [
        "user@gmail.com",
        "test.user@gmail.com",
        "user+test@gmail.com",
        "user@example.co.in",
        "user123@outlook.com",
    ],
)
def test_login_valid_email_is_accepted_by_schema(email):
    """Valid emails must be accepted by the UserLogin schema."""
    obj = make_login(email)
    assert obj.email == email.strip().lower()


# ============================================================================
# Login endpoint API-level rejection of invalid email
# ============================================================================

@pytest.mark.parametrize(
    "email",
    [
        "wish@123",
        "test",
        "test@",
        "test@gmail",
        "@gmail.com",
        "user@",
        "user@.com",
        "user name@gmail.com",
        "test..user@gmail.com",
        ".test@gmail.com",
        "test.@gmail.com",
    ],
)
def test_login_endpoint_rejects_invalid_email(email):
    """
    The /api/auth/login endpoint must return 422 Unprocessable Entity
    for structurally invalid emails without attempting authentication.
    """
    resp = client.post(
        "/api/auth/login",
        json={"email": email, "password": "anypassword"},
    )
    assert resp.status_code == 422, (
        f"Expected 422 for email={email!r}, got {resp.status_code}: {resp.text}"
    )


# ============================================================================
# Login normalization
# ============================================================================

def test_login_email_normalization_whitespace_and_case():
    """Login normalizes email consistently with registration."""
    obj = make_login("  User.Test@Example.COM  ")
    assert obj.email == "user.test@example.com"