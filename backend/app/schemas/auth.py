from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    company_name: Optional[str] = "MSME Manufacturing Ltd."
    role: Optional[str] = "MSME_MANUFACTURER"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    company_name: str
    role: str
    created_at: str

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
