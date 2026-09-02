import uuid
from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional
from app.schemas.auth import UserRegister, UserLogin, UserResponse, AuthTokenResponse
from app.repositories.user_repo import user_repository

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# In-memory simple token map for MVP sessions (maps token -> user_id)
# Tokens persist during process run; DB persists permanently in SQLite.
ACTIVE_SESSIONS = {}

def get_current_user(authorization: Optional[str] = Header(None)) -> UserResponse:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication token required")
    token = authorization.split(" ")[1]
    user_id = ACTIVE_SESSIONS.get(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired session token")
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
    ACTIVE_SESSIONS[token] = user.id

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
    ACTIVE_SESSIONS[token] = user.id

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
    ACTIVE_SESSIONS[token] = user.id

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
        ACTIVE_SESSIONS.pop(token, None)
    return {"message": "Successfully logged out"}
