import uuid
import hashlib
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from psycopg2.extras import RealDictCursor
from app.core.database import get_connection
from app.schemas.auth import UserRegister, UserLogin, UserResponse, AuthTokenResponse
from app.repositories.user_repo import user_repository

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()

def _create_session(user_id: str, token: str) -> None:
    token_hash = _hash_token(token)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO sessions (token_hash, user_id, expires_at, created_at)
                VALUES (%s, %s, %s, NOW())
                ON CONFLICT (token_hash) DO UPDATE SET expires_at = EXCLUDED.expires_at
                """,
                (token_hash, user_id, expires_at)
            )

def get_current_user(authorization: Optional[str] = Header(None)) -> UserResponse:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication token required")
    token = authorization.split(" ")[1]
    token_hash = _hash_token(token)
    
    with get_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                "SELECT user_id, expires_at FROM sessions WHERE token_hash = %s",
                (token_hash,)
            )
            row = cur.fetchone()
            if not row:
                raise HTTPException(status_code=401, detail="Invalid or expired session token")
            
            expires_at = row["expires_at"]
            if expires_at and expires_at < datetime.now(timezone.utc):
                # Clean up expired session
                cur.execute("DELETE FROM sessions WHERE token_hash = %s", (token_hash,))
                raise HTTPException(status_code=401, detail="Session expired, please log in again")
            
            user_id = row["user_id"]

    user = user_repository.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.post("/register", response_model=AuthTokenResponse)
def register(data: UserRegister):
    existing = user_repository.get_by_email(data.email)
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    
    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    user = user_repository.create_user(data)
    token = f"nv-token-{uuid.uuid4().hex}"
    _create_session(user.id, token)

    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=user
    )

@router.post("/login", response_model=AuthTokenResponse)
def login(data: UserLogin):
    user = user_repository.verify_password(data.email, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = f"nv-token-{uuid.uuid4().hex}"
    _create_session(user.id, token)

    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=user
    )

@router.post("/demo-login", response_model=AuthTokenResponse)
def demo_login():
    """
    Instant 1-click login for examiners and judges as an authenticated MSME manufacturer.
    """
    demo_email = "demo@niyamveda.gov.in"
    user = user_repository.verify_password(demo_email, "password123")
    if not user:
        # Fallback ensure created
        user = user_repository.create_user(
            UserRegister(
                email=demo_email,
                password="password123",
                full_name="Rajesh Kumar Sharma",
                company_name="Apex PureWater Innovations Pvt. Ltd.",
                role="MSME_MANUFACTURER"
            )
        )
    
    token = f"nv-token-demo-{uuid.uuid4().hex[:8]}"
    _create_session(user.id, token)

    return AuthTokenResponse(
        access_token=token,
        token_type="bearer",
        user=user
    )

@router.get("/me", response_model=UserResponse)
def get_me(user: UserResponse = Depends(get_current_user)):
    return user

@router.post("/logout")
def logout(authorization: Optional[str] = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        token_hash = _hash_token(token)
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM sessions WHERE token_hash = %s", (token_hash,))
    return {"message": "Successfully logged out"}
