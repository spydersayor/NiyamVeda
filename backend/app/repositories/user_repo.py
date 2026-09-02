import os
import sqlite3
import uuid
import hashlib
import hmac
from datetime import datetime
from typing import Optional, Dict, Any
from app.schemas.auth import UserRegister, UserResponse

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "niyamveda_users.db")

class UserRepository:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self._init_db()
        self._seed_default_users()

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    salt TEXT NOT NULL,
                    full_name TEXT NOT NULL,
                    company_name TEXT NOT NULL,
                    role TEXT NOT NULL DEFAULT 'MSME_MANUFACTURER',
                    created_at TEXT NOT NULL
                )
            """)
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
            conn.commit()

    def _hash_password(self, password: str, salt: str) -> str:
        return hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        ).hex()

    def _seed_default_users(self):
        # Default demo MSME account for testing
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
        created_at = datetime.utcnow().isoformat() + "Z"

        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                INSERT INTO users (id, email, password_hash, salt, full_name, company_name, role, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (user_id, data.email.lower().strip(), password_hash, salt, data.full_name, data.company_name or "MSME Manufacturing Ltd.", data.role or "MSME_MANUFACTURER", created_at)
            )
            conn.commit()

        return UserResponse(
            id=user_id,
            email=data.email.lower().strip(),
            full_name=data.full_name,
            company_name=data.company_name or "MSME Manufacturing Ltd.",
            role=data.role or "MSME_MANUFACTURER",
            created_at=created_at
        )

    def get_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE email = ?", (email.lower().strip(),))
            row = cursor.fetchone()
            if row:
                return dict(row)
        return None

    def get_by_id(self, user_id: str) -> Optional[UserResponse]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            if row:
                d = dict(row)
                return UserResponse(
                    id=d["id"],
                    email=d["email"],
                    full_name=d["full_name"],
                    company_name=d["company_name"],
                    role=d["role"],
                    created_at=d["created_at"]
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
                created_at=user_row["created_at"]
            )
        return None

user_repository = UserRepository()
