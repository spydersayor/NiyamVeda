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

    @staticmethod
    def _normalize_email(email: str) -> str:
        """
        Return the canonical representation used by the database.

        Email addresses are normalized for consistency, but this does
        not verify whether the mailbox or domain actually exists.
        """
        return str(email).strip().lower()

    def _hash_password(self, password: str, salt: str) -> str:
        """
        Hash a password using PBKDF2-HMAC-SHA256 with a per-user salt.
        """
        return hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            100000,
        ).hex()

    def _seed_default_users(self):
        """
        Create the default demo MSME account if it does not exist.
        """
        demo_email = "demo@niyamveda.gov.in"

        existing = self.get_by_email(demo_email)

        if not existing:
            self.create_user(
                UserRegister(
                    email=demo_email,
                    password="password123",
                    full_name="Rajesh Kumar Sharma",
                    company_name="Apex PureWater Innovations Pvt. Ltd.",
                    role="MSME_MANUFACTURER",
                )
            )

    def create_user(self, data: UserRegister) -> UserResponse:
        """
        Create a new user using the normalized email supplied by the
        validated UserRegister schema.
        """

        normalized_email = self._normalize_email(data.email)

        user_id = f"usr-{uuid.uuid4().hex[:10]}"

        # Generate a unique random salt for every user.
        salt = uuid.uuid4().hex

        password_hash = self._hash_password(
            data.password,
            salt,
        )

        created_at = (
            datetime.now(timezone.utc)
            .isoformat()
            .replace("+00:00", "Z")
        )

        company_name = (
            data.company_name
            or "MSME Manufacturing Ltd."
        )

        role = (
            data.role
            or "MSME_MANUFACTURER"
        )

        with get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    """
                    INSERT INTO users (
                        id,
                        email,
                        password_hash,
                        salt,
                        full_name,
                        company_name,
                        role,
                        created_at
                    )
                    VALUES (
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s
                    )
                    ON CONFLICT (email) DO NOTHING
                    """,
                    (
                        user_id,
                        normalized_email,
                        password_hash,
                        salt,
                        data.full_name,
                        company_name,
                        role,
                        created_at,
                    ),
                )

        return UserResponse(
            id=user_id,
            email=normalized_email,
            full_name=data.full_name,
            company_name=company_name,
            role=role,
            created_at=created_at,
        )

    def get_by_email(
        self,
        email: str,
    ) -> Optional[Dict[str, Any]]:
        """
        Retrieve a user using the canonical normalized email.
        """

        normalized_email = self._normalize_email(email)

        with get_connection() as conn:
            with conn.cursor(
                cursor_factory=RealDictCursor
            ) as cursor:
                cursor.execute(
                    """
                    SELECT *
                    FROM users
                    WHERE email = %s
                    """,
                    (normalized_email,),
                )

                row = cursor.fetchone()

                if row:
                    return dict(row)

        return None

    def get_by_id(
        self,
        user_id: str,
    ) -> Optional[UserResponse]:
        """
        Retrieve a user by their unique user ID.
        """

        with get_connection() as conn:
            with conn.cursor(
                cursor_factory=RealDictCursor
            ) as cursor:
                cursor.execute(
                    """
                    SELECT *
                    FROM users
                    WHERE id = %s
                    """,
                    (user_id,),
                )

                row = cursor.fetchone()

                if row:
                    data = dict(row)

                    return UserResponse(
                        id=data["id"],
                        email=data["email"],
                        full_name=data["full_name"],
                        company_name=data["company_name"],
                        role=data["role"],
                        created_at=str(data["created_at"]),
                    )

        return None

    def verify_password(
        self,
        email: str,
        password: str,
    ) -> Optional[UserResponse]:
        """
        Verify a user's password using the stored salt and password hash.
        """

        normalized_email = self._normalize_email(email)

        user_row = self.get_by_email(normalized_email)

        if not user_row:
            return None

        expected_hash = user_row["password_hash"]
        salt = user_row["salt"]

        calculated_hash = self._hash_password(
            password,
            salt,
        )

        if not hmac.compare_digest(
            expected_hash,
            calculated_hash,
        ):
            return None

        return UserResponse(
            id=user_row["id"],
            email=user_row["email"],
            full_name=user_row["full_name"],
            company_name=user_row["company_name"],
            role=user_row["role"],
            created_at=str(user_row["created_at"]),
        )


user_repository = UserRepository()