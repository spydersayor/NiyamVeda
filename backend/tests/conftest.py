import os
import pytest
import logging
from app.core.config import settings

logger = logging.getLogger("test_conftest")

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """
    Session-scoped autouse fixture that initializes PostgreSQL schema.
    Uses TEST_DATABASE_URL if defined, falling back to DATABASE_URL.
    If PostgreSQL is unreachable, logs a clear warning without crashing
    pure logic test modules.
    """
    test_db_url = os.environ.get("TEST_DATABASE_URL")
    if test_db_url:
        settings.DATABASE_URL = test_db_url

    try:
        from app.core.database import init_db
        init_db()
        logger.info(f"Test database initialized successfully against {settings.DATABASE_URL}")
    except Exception as e:
        logger.warning(
            f"PostgreSQL not reachable for integration tests ({e}). "
            "Pure logic tests (rule engine, simulation, vector search) will still pass."
        )
