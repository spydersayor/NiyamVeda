import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.rag.gemini_provider import GeminiProvider

client = TestClient(app)

def test_analyze_product_by_id():
    resp = client.post("/api/analyze/demo-purifier-001")
    assert resp.status_code == 200
    data = resp.json()
    assert "analysis_id" in data
    assert data["relevant_standards_count"] >= 3
    assert data["evidence_confidence"] in ("High", "Medium", "Low", "Insufficient Evidence", "HIGH", "MEDIUM", "LOW")
    assert "safe_abstention" in data

    # Retrieve by analysis_id
    analysis_id = data["analysis_id"]
    get_resp = client.get(f"/api/analyze/result/{analysis_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["analysis_id"] == analysis_id

def test_analyze_product_direct():
    payload = {
        "product_name": "Direct Test Filter",
        "category": "Household Electrical Appliances (Water Filters)",
        "intended_use": "Domestic use",
        "material_composition": "Food-grade polymer",
        "operating_voltage": "230V AC",
        "power_consumption": "35W",
        "water_storage_capacity": "5L",
        "has_uv_module": False
    }
    resp = client.post("/api/analyze", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "analysis_id" in data
    assert data["relevant_standards_count"] >= 1

def test_get_analysis_result_demo_fallback():
    # Explicit demo identifier should return valid result
    resp = client.get("/api/analyze/result/demo-purifier-001")
    assert resp.status_code == 200
    assert resp.json()["relevant_standards_count"] >= 3

def test_get_analysis_result_invalid_id_returns_404():
    # Non-existent arbitrary ID must strictly return 404, not demo data!
    resp = client.get("/api/analyze/result/invalid-unknown-uuid-12345")
    assert resp.status_code == 404
    assert "not found" in resp.json()["detail"].lower()

def test_analyze_nonexistent_product_returns_404():
    resp = client.post("/api/analyze/totally-fake-product-id")
    assert resp.status_code == 404

def test_gemini_provider_fallback_on_error():
    provider = GeminiProvider()
    # When api_key is blank, it falls back to mock provider safely
    provider.api_key = ""
    explanation = provider.generate_explanation(
        prompt="Explain compliance for water purifier",
        system_instruction="Explain for MSME",
        retrieved_evidence=[],
        matched_rules=[]
    )
    assert explanation is not None
    assert len(explanation) > 0
