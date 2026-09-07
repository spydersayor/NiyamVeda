import json
import logging
import re
from contextlib import contextmanager
from typing import Generator, Optional, Set
import psycopg2
from psycopg2.pool import ThreadedConnectionPool
from psycopg2.extras import RealDictCursor
from app.core.config import settings

logger = logging.getLogger(__name__)

def generate_safe_username(email: str, existing_usernames: Set[str]) -> str:
    """
    Derives a valid username matching ^[A-Za-z0-9_]{3,30}$ from an email address,
    guaranteeing case-insensitive uniqueness against existing_usernames.
    """
    local = email.split("@")[0].strip() if email else "user"
    # Allow only A-Z, a-z, 0-9, underscore
    sanitized = re.sub(r"[^A-Za-z0-9_]", "_", local)
    # Collapse consecutive underscores
    sanitized = re.sub(r"_+", "_", sanitized).strip("_")
    if not sanitized or len(sanitized) < 3:
        sanitized = f"user_{sanitized}" if sanitized else "user_default"
        if len(sanitized) < 3:
            sanitized = (sanitized + "123")[:30]

    # Base candidate truncated to max 25 chars to leave room for collision suffixes (total <= 30)
    base = sanitized[:25]
    candidate = base
    suffix = 1
    while candidate.lower() in existing_usernames or len(candidate) < 3:
        suffix_str = f"_{suffix}"
        max_base_len = 30 - len(suffix_str)
        candidate = f"{base[:max_base_len]}{suffix_str}"
        suffix += 1

    existing_usernames.add(candidate.lower())
    return candidate

def _migrate_usernames_safely(cur) -> None:
    """
    Backfills usernames for existing users that have no username or an empty username.
    Guarantees no duplicate usernames (case-insensitively), preserves existing records,
    and ensures generated usernames conform to ^[A-Za-z0-9_]{3,30}$.
    """
    cur.execute("SELECT id, email, username FROM users;")
    rows = cur.fetchall()
    existing_usernames: Set[str] = {
        r[2].lower() for r in rows if len(r) > 2 and r[2] and isinstance(r[2], str) and r[2].strip()
    }
    for row in rows:
        uid = row[0]
        uemail = row[1] if len(row) > 1 else "user@example.com"
        u_username = row[2] if len(row) > 2 else None
        if not u_username or not str(u_username).strip():
            new_u = generate_safe_username(uemail or "user@example.com", existing_usernames)
            cur.execute("UPDATE users SET username = %s WHERE id = %s;", (new_u, uid))
            logger.info(f"Safely migrated user {uid} ({uemail}) with username '{new_u}'")

_pool: Optional[ThreadedConnectionPool] = None

def get_pool() -> ThreadedConnectionPool:
    global _pool
    if _pool is None or _pool.closed:
        # Standardize postgres:// to postgresql:// for psycopg2 if needed
        db_url = settings.DATABASE_URL
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
        
        logger.info(f"Initializing PostgreSQL connection pool against: {db_url.split('@')[-1] if '@' in db_url else 'local'}")
        _pool = ThreadedConnectionPool(minconn=1, maxconn=20, dsn=db_url)
    return _pool

def close_pool() -> None:
    global _pool
    if _pool is not None and not _pool.closed:
        _pool.closeall()
        _pool = None
        logger.info("PostgreSQL connection pool closed.")

@contextmanager
def get_connection() -> Generator[psycopg2.extensions.connection, None, None]:
    """
    Context manager that checks out a connection from the pool,
    commits on successful exit, rolls back on exceptions,
    and returns the connection back to the pool.
    """
    pool = get_pool()
    conn = pool.getconn()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        pool.putconn(conn)

def init_db() -> None:
    """
    Initializes PostgreSQL database schema for NiyamVeda:
    users, sessions, products, and analysis_results.
    """
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                # 1. Try vector extension (optional for pgvector if installed)
                try:
                    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
                except Exception as ext_err:
                    conn.rollback()
                    logger.warning(f"pgvector extension could not be enabled (optional for mock embeddings): {ext_err}")

                # 2. Users table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS users (
                        id VARCHAR(64) PRIMARY KEY,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        password_hash TEXT NOT NULL,
                        salt TEXT NOT NULL,
                        full_name VARCHAR(255) NOT NULL,
                        username VARCHAR(30),
                        company_name VARCHAR(255) NOT NULL,
                        role VARCHAR(64) NOT NULL DEFAULT 'MSME_MANUFACTURER',
                        created_at TEXT NOT NULL
                    );
                    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
                    ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(30);
                """)

                # Safe existing-user migration for username backfill
                _migrate_usernames_safely(cur)

                # Case-insensitive unique index on LOWER(username)
                cur.execute("""
                    CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_lower ON users (LOWER(username));
                """)

                # 3. Sessions table (server-side token persistence)
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS sessions (
                        token_hash VARCHAR(128) PRIMARY KEY,
                        user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    );
                    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
                """)

                # 4. Products table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS products (
                        id VARCHAR(64) PRIMARY KEY,
                        project_name VARCHAR(255) NOT NULL,
                        product_name VARCHAR(255) NOT NULL,
                        category VARCHAR(255) NOT NULL,
                        intended_use TEXT,
                        material_composition TEXT,
                        technical_characteristics TEXT,
                        operating_voltage VARCHAR(100),
                        power_consumption VARCHAR(100),
                        water_storage_capacity VARCHAR(100),
                        has_uv_module BOOLEAN DEFAULT FALSE,
                        manufacturing_origin VARCHAR(100) DEFAULT 'India',
                        target_market VARCHAR(100) DEFAULT 'Domestic',
                        status VARCHAR(50) DEFAULT 'DRAFT',
                        facts JSONB DEFAULT '[]'::jsonb,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    );
                """)

                # 5. Analysis results table
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS analysis_results (
                        id VARCHAR(64) PRIMARY KEY,
                        product_id VARCHAR(64),
                        evidence_confidence VARCHAR(50) NOT NULL,
                        safe_abstention_activated BOOLEAN DEFAULT FALSE,
                        abstention_reason TEXT,
                        summary TEXT,
                        result_data JSONB,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    );
                    CREATE INDEX IF NOT EXISTS idx_analysis_product_id ON analysis_results(product_id);
                """)

        # Auto-seed users and demo products
        from app.repositories.user_repo import user_repository
        user_repository._seed_default_users()

        from app.repositories.product_repo import product_repo
        product_repo._seed_demo_data()

        logger.info("Database schema initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database schema: {e}")
        raise
