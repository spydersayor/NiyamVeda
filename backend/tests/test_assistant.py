import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.rules.source_registry_data import SOURCE_REGISTRY

client = TestClient(app)

FORBIDDEN_PHRASES = [
    "certification guaranteed",
    "officially compliant",
    "officially approved by bis",
    "we certify",
    "you are certified"
]

def assert_no_false_guarantees(text: str):
    lower = text.lower()
    for phrase in FORBIDDEN_PHRASES:
        assert phrase not in lower, f"Response contains forbidden assurance '{phrase}': {text}"

def test_assistant_electric_kettle():
    res = client.post("/api/assistant/chat", json={
        "message": "What BIS standards apply to an electric kettle?",
        "language": "en"
    })
    assert res.status_code == 200
    data = res.json()
    assert "IS 302" in data["response"]
    assert "Dry-Boil" in data["response"] or "dry boil" in data["response"].lower()
    assert len(data["citations"]) > 0
    # Verify citations match actual registered sources
    for cit in data["citations"]:
        assert cit["source_id"] in SOURCE_REGISTRY
    assert_no_false_guarantees(data["response"])

def test_assistant_ro_purifier():
    res = client.post("/api/assistant/chat", json={
        "message": "What are the requirements for an RO water purifier?",
        "language": "en"
    })
    assert res.status_code == 200
    data = res.json()
    assert "16240" in data["response"]
    assert "TDS" in data["response"]
    assert len(data["citations"]) > 0
    for cit in data["citations"]:
        assert cit["source_id"] in SOURCE_REGISTRY
    assert_no_false_guarantees(data["response"])

def test_assistant_non_electrical_cookware():
    res = client.post("/api/assistant/chat", json={
        "message": "What standards apply to non-electrical stainless steel cookware?",
        "language": "en"
    })
    assert res.status_code == 200
    data = res.json()
    assert "14756" in data["response"] or "6911" in data["response"]
    assert "SS 304" in data["response"] or "304" in data["response"]
    assert len(data["citations"]) > 0
    for cit in data["citations"]:
        assert cit["source_id"] in SOURCE_REGISTRY
    assert_no_false_guarantees(data["response"])

def test_assistant_unknown_product():
    res = client.post("/api/assistant/chat", json={
        "message": "Can you certify an autonomous military drone with laser scanners?",
        "language": "en"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["safe_abstention"] is True
    assert "abstention" in data["response"].lower() or "safe abstention" in data["response"].lower()
    assert data["grounded_in_corpus"] is False
    assert len(data["citations"]) == 0
    assert_no_false_guarantees(data["response"])

def test_assistant_certification_question():
    res = client.post("/api/assistant/chat", json={
        "message": "How do I get CRS registration versus ISI mark certification?",
        "language": "en"
    })
    assert res.status_code == 200
    data = res.json()
    assert "CRS" in data["response"]
    assert "ISI Mark" in data["response"]
    assert_no_false_guarantees(data["response"])

def test_assistant_hallmarking_question():
    res = client.post("/api/assistant/chat", json={
        "message": "How do I get BIS hallmarking for gold jewellery?",
        "language": "en"
    })
    assert res.status_code == 200
    data = res.json()
    # Must explicitly state not indexed, never fabricate hallmarking rules
    assert "not currently indexed" in data["response"].lower() or "not indexed" in data["response"].lower()
    assert data["safe_abstention"] is True
    assert len(data["citations"]) == 0
    assert_no_false_guarantees(data["response"])

def test_assistant_laboratory_question():
    res = client.post("/api/assistant/chat", json={
        "message": "Give me a list of testing labs in Jaipur for BIS certification",
        "language": "en"
    })
    assert res.status_code == 200
    data = res.json()
    # Must clarify local lab rosters not indexed, direct to official NABL / BIS LIMS
    assert "not maintained" in data["response"].lower() or "not indexed" in data["response"].lower() or "lims" in data["response"].lower()
    assert data["safe_abstention"] is True
    assert_no_false_guarantees(data["response"])

def test_assistant_hindi_question():
    res = client.post("/api/assistant/chat", json={
        "message": "इलेक्ट्रिक केतली के लिए कौन से बीआईएस मानक लागू होते हैं?",
        "language": "hi"
    })
    assert res.status_code == 200
    data = res.json()
    # Must respond in Hindi
    assert "IS 302" in data["response"]
    assert "मानक" in data["response"] or "केतली" in data["response"] or "विद्युत" in data["response"]
    assert_no_false_guarantees(data["response"])

def test_assistant_bengali_question():
    res = client.post("/api/assistant/chat", json={
        "message": "আরও ওয়াটার পিউরিফায়ারের জন্য কোন মানদণ্ড প্রযোজ্য?",
        "language": "bn"
    })
    assert res.status_code == 200
    data = res.json()
    # Must respond in Bengali
    assert "16240" in data["response"] or "IS" in data["response"]
    assert "মানদণ্ড" in data["response"] or "জল" in data["response"] or "পিউরিফায়ার" in data["response"]
    assert_no_false_guarantees(data["response"])

def test_assistant_product_context_question():
    res = client.post("/api/assistant/chat", json={
        "message": "What requirements apply to this active product?",
        "product_id": "demo-purifier-001",
        "language": "en"
    })
    assert res.status_code == 200
    data = res.json()
    assert "Smart Alkaline Water Purifier" in data["response"] or "230V" in data["response"]
    assert len(data["citations"]) > 0
    assert_no_false_guarantees(data["response"])
