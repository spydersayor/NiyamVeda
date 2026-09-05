import uuid
import hashlib
import hmac
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from psycopg2.extras import RealDictCursor
from app.core.database import get_connection
from app.schemas.auth import UserRegister, UserResponse

class UserRepository:
    def __init__(self):
        pass

    def _hash_password(self, password: str, salt: str) -> str:
        return hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        ).hex()

    def _seed_default_users(self):
        # Default demo MSME account for testing and evaluation
        demo_email = "demo@niyamveda.gov.in"
        existing = self.get_by_email(demo_email)
        if not existing:
            self.create_user(
                UserRegister(
                    email=demo_email,
                    password="password123",
                    full_name="Rajesh Kumar Sharma",
                    company_name="Apex PureWater Innovations Pvt. Ltd.",
                    role="MSME_MANUFACTURER"
                )
            )

    def create_user(self, data: UserRegister) -> UserResponse:
        user_id = f"usr-{uuid.uuid4().hex[:10]}"
        salt = uuid.uuid4().hex
        password_hash = self._hash_password(data.password, salt)
        created_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO users (id, email, password_hash, salt, full_name, company_name, role, created_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (email) DO NOTHING
                    """,
                    (
                        user_id,
                        data.email.lower().strip(),
                        password_hash,
                        salt,
                        data.full_name,
                        data.company_name or "MSME Manufacturing Ltd.",
                        data.role or "MSME_MANUFACTURER",
                        created_at
                    )
                )

        return UserResponse(
            id=user_id,
            email=data.email.lower().strip(),
            full_name=data.full_name,
            company_name=data.company_name or "MSME Manufacturing Ltd.",
            role=data.role or "MSME_MANUFACTURER",
            created_at=created_at
        )

    def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        with get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("SELECT * FROM users WHERE email = %s", (email.lower().strip(),))
                row = cursor.fetchone()
                if row:
                    return dict(row)
        return None

    def get_by_id(self, user_id: str) -> Optional[UserResponse]:
        with get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
                row = cursor.fetchone()
                if row:
                    d = dict(row)
                    return UserResponse(
                        id=d["id"],
                        email=d["email"],
                        full_name=d["full_name"],
                        company_name=d["company_name"],
                        role=d["role"],
                        created_at=str(d["created_at"])
                    )
        return None

    def verify_password(self, email: str, password: str) -> Optional[UserResponse]:
        user_row = self.get_by_email(email)
        if not user_row:
            return None
        
        expected_hash = user_row["password_hash"]
        salt = user_row["salt"]
        calculated_hash = self._hash_password(password, salt)

        if hmac.compare_digest(expected_hash, calculated_hash):
            return UserResponse(
                id=user_row["id"],
                email=user_row["email"],
                full_name=user_row["full_name"],
                company_name=user_row["company_name"],
                role=user_row["role"],
                created_at=str(user_row["created_at"])
            )
        return None

user_repository = UserRepository()
