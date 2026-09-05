# NiyamVeda — Deployment Audit & Fix Walkthrough

All issues identified during the deployment audit have been resolved and verified with automated test suites. The architecture is now fully configured for production deployment across Vercel (frontend) and Render (FastAPI backend + managed PostgreSQL).

---

## Changes Made

### 1. Database & Persistence Layer (`PostgreSQL + psycopg2`)
- **[NEW] [`backend/app/core/database.py`](file:///c:/Users/Spyder/Desktop/NiyamVeda/backend/app/core/database.py)**: Centralized `ThreadedConnectionPool` with a context manager `get_connection()` for safe checkouts, commits, and rollbacks. Implemented `init_db()` creating `users`, `sessions`, `products`, and `analysis_results` tables with indexes.
- **[MODIFY] [`backend/app/repositories/user_repo.py`](file:///c:/Users/Spyder/Desktop/NiyamVeda/backend/app/repositories/user_repo.py)**: Replaced `sqlite3` and `niyamveda_users.db` with PostgreSQL queries. Maintained `pbkdf2_hmac(sha256, 100000)` and salt mechanism for credential compatibility and idempotent demo user seeding.
- **[MODIFY] [`backend/app/repositories/product_repo.py`](file:///c:/Users/Spyder/Desktop/NiyamVeda/backend/app/repositories/product_repo.py)**: Replaced in-memory dictionary with PostgreSQL persistence. Stored `facts` as JSONB/JSON, and automatically seeded `demo-purifier-001`.
- **[MODIFY] [`backend/app/api/auth.py`](file:///c:/Users/Spyder/Desktop/NiyamVeda/backend/app/api/auth.py)**: Replaced in-memory session dictionary with the `sessions` table. Implemented SHA-256 token hashing, 24-hour expiration enforcement, and proper session invalidation on logout.
- **[MODIFY] [`backend/app/api/analysis.py`](file:///c:/Users/Spyder/Desktop/NiyamVeda/backend/app/api/analysis.py)**: Replaced in-memory analysis store with PostgreSQL `analysis_results` table. Restricted demo fallback strictly to explicit demo identifiers (`demo-purifier-001`, `demo-analysis-001`), returning 404 for arbitrary invalid IDs as requested.

### 2. Security Hardening & Endpoint Improvements
- **[MODIFY] [`backend/app/api/products.py`](file:///c:/Users/Spyder/Desktop/NiyamVeda/backend/app/api/products.py)**:
  - Added filename sanitization stripping path traversal sequences (`..`, null bytes, illegal characters).
  - Added unique UUID prefixing (`uuid4().hex[:12]_...`).
  - Added MIME type and extension validation (PDF only).
  - Enforced a 10MB streaming size limit before writing files to disk.
  - Ensured `/confirm` updates persist to PostgreSQL.
- **[MODIFY] [`backend/app/main.py`](file:///c:/Users/Spyder/Desktop/NiyamVeda/backend/app/main.py)**:
  - Updated `/health` endpoint to return dynamic ISO 8601 UTC timestamps.
  - Added FastAPI `lifespan` context manager initializing database tables on startup and closing connection pools cleanly on shutdown.
- **[MODIFY] [`backend/app/rag/gemini_provider.py`](file:///c:/Users/Spyder/Desktop/NiyamVeda/backend/app/rag/gemini_provider.py)**:
  - Added safe logging for missing API keys and HTTP errors without exposing keys or raw prompts in stack traces.

### 3. Requirements, Deployment & Config
- **[MODIFY] [`backend/requirements.txt`](file:///c:/Users/Spyder/Desktop/NiyamVeda/backend/requirements.txt)**: Added `psycopg2-binary>=2.9.9` and removed unused `sqlalchemy`.
- **[NEW] [`backend/.env.example`](file:///c:/Users/Spyder/Desktop/NiyamVeda/backend/.env.example)**: Added backend-specific configuration template.
- **[MODIFY] [`vercel.json`](file:///c:/Users/Spyder/Desktop/NiyamVeda/vercel.json)**: Updated root configuration from invalid multi-service to clean Next.js frontend targeting `frontend/`.
- **[MODIFY] [`.gitignore`](file:///c:/Users/Spyder/Desktop/NiyamVeda/.gitignore)**: Added generic `*.db`, `*.sqlite`, `*.sqlite3`, and `uploads/` rules.
- **[MODIFY] [`README.md`](file:///c:/Users/Spyder/Desktop/NiyamVeda/README.md)**: Documented the complete Render backend + PostgreSQL and Vercel frontend deployment workflows.

---

## Verification Results

### 1. Backend Automated Test Suite (`pytest`)
All 26 unit and integration tests passed against PostgreSQL:

```bash
platform win32 -- Python 3.13.7, pytest-9.0.3
collecting ... collected 26 items

tests/test_analysis.py::test_analyze_product_by_id PASSED                [  3%]
tests/test_analysis.py::test_analyze_product_direct PASSED               [  7%]
tests/test_analysis.py::test_get_analysis_result_demo_fallback PASSED    [ 11%]
tests/test_analysis.py::test_get_analysis_result_invalid_id_returns_404 PASSED [ 15%]
tests/test_analysis.py::test_analyze_nonexistent_product_returns_404 PASSED [ 19%]
tests/test_analysis.py::test_gemini_provider_fallback_on_error PASSED    [ 23%]
tests/test_auth.py::test_demo_user_seeded PASSED                         [ 26%]
tests/test_auth.py::test_auth_demo_login_endpoint PASSED                 [ 30%]
tests/test_auth.py::test_auth_register_and_login PASSED                  [ 34%]
tests/test_auth.py::test_auth_logout PASSED                              [ 38%]
tests/test_auth.py::test_auth_expired_session PASSED                     [ 42%]
tests/test_core.py::test_demo_product_seeded PASSED                      [ 46%]
tests/test_core.py::test_deterministic_rule_engine PASSED                [ 50%]
tests/test_core.py::test_orchestrator_analysis PASSED                    [ 53%]
tests/test_core.py::test_simulation_service PASSED                       [ 57%]
tests/test_health.py::test_health_dynamic_timestamp PASSED               [ 61%]
tests/test_health.py::test_root_info PASSED                              [ 65%]
tests/test_health.py::test_cors_headers PASSED                           [ 69%]
tests/test_products.py::test_list_products PASSED                        [ 73%]
tests/test_products.py::test_create_and_get_product PASSED               [ 76%]
tests/test_products.py::test_update_and_confirm_product PASSED           [ 80%]
tests/test_products.py::test_get_nonexistent_product PASSED              [ 84%]
tests/test_products.py::test_upload_valid_pdf PASSED                     [ 88%]
tests/test_products.py::test_upload_invalid_file_type PASSED             [ 92%]
tests/test_products.py::test_upload_path_traversal_sanitized PASSED      [ 96%]
tests/test_products.py::test_upload_oversized_file PASSED                [100%]

======================== 26 passed, 1 warning in 1.20s ========================
```

### 2. Frontend Production Build (`next build`)
The Next.js 14 frontend compiled with zero errors across all static and dynamic route trees:

```bash
Route (app)                              Size     First Load JS
┌ ○ /                                    8.64 kB         103 kB
├ ○ /_not-found                          872 B          87.9 kB
├ ○ /auth                                4.07 kB         105 kB
├ ○ /icon.svg                            0 B                0 B
├ ƒ /product/[id]/abstention             3.97 kB        98.4 kB
├ ƒ /product/[id]/analysis               5.39 kB         106 kB
├ ƒ /product/[id]/confirm                2.04 kB         103 kB
├ ƒ /product/[id]/requirements           3.83 kB         105 kB
├ ƒ /product/[id]/risks                  3.76 kB         105 kB
├ ƒ /product/[id]/rule-inspector         3.84 kB        98.2 kB
├ ƒ /product/[id]/simulation             4.32 kB         105 kB
├ ƒ /product/[id]/sources                3.77 kB        98.2 kB
├ ƒ /product/[id]/standards              4.74 kB         106 kB
├ ƒ /product/[id]/why-rule               3.63 kB          98 kB
├ ○ /product/new                         4.59 kB        98.1 kB
└ ○ /sources                             2.22 kB         103 kB
+ First Load JS shared by all            87 kB
```
