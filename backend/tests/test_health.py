from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_dynamic_timestamp():
    now_utc = datetime.now(timezone.utc)
    resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data

    # Parse dynamic timestamp
    ts_str = data["timestamp"]
    parsed_ts = datetime.fromisoformat(ts_str.replace("Z", "+00:00"))

    # Verify not the old hardcoded timestamp '2026-09-02T20:50:00Z'
    # And verify it was generated within the last 60 seconds
    diff = abs((now_utc - parsed_ts).total_seconds())
    assert diff < 60, f"Health timestamp {ts_str} differs from current UTC {now_utc} by {diff}s"

def test_root_info():
    resp = client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["project"] == "NIYAMVEDA"
    assert data["problem_statement"] == "SIH26107"
    assert data["status"] == "OPERATIONAL"

def test_cors_headers():
    # CORS preflight from allowed origin
    headers = {
        "Origin": "http://localhost:3000",
        "Access-Control-Request-Method": "GET"
    }
    resp = client.options("/health", headers=headers)
    assert resp.status_code == 200
    assert resp.headers.get("access-control-allow-origin") == "http://localhost:3000"

    # CORS preflight from allowed Vercel preview domain
    vercel_headers = {
        "Origin": "https://niyamveda-preview-app.vercel.app",
        "Access-Control-Request-Method": "POST"
    }
    v_resp = client.options("/api/products", headers=vercel_headers)
    assert v_resp.status_code == 200
    assert v_resp.headers.get("access-control-allow-origin") == "https://niyamveda-preview-app.vercel.app"
