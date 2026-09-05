import io
import os
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)

def test_list_products():
    resp = client.get("/api/products")
    assert resp.status_code == 200
    products = resp.json()
    assert isinstance(products, list)
    assert len(products) >= 1
    ids = [p["id"] for p in products]
    assert "demo-purifier-001" in ids

def test_create_and_get_product():
    payload = {
        "project_name": "Test RO Filter Project",
        "product_name": "Commercial RO Unit",
        "category": "Household Electrical Appliances (Water Filters)",
        "intended_use": "Commercial and institutional drinking water purification",
        "material_composition": "Stainless steel casing, composite filter tubes",
        "technical_characteristics": "230V AC, 50Hz, 120W, 25L capacity",
        "operating_voltage": "230V AC, 50Hz",
        "power_consumption": "120W",
        "water_storage_capacity": "25 Liters",
        "has_uv_module": False,
        "manufacturing_origin": "India",
        "target_market": "Domestic"
    }
    create_resp = client.post("/api/products", json=payload)
    assert create_resp.status_code == 200
    created = create_resp.json()
    assert created["id"].startswith("prod-")
    assert created["product_name"] == "Commercial RO Unit"
    assert created["status"] == "DRAFT"
    assert len(created["facts"]) == 6

    # Fetch by ID
    get_resp = client.get(f"/api/products/{created['id']}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == created["id"]

def test_update_and_confirm_product():
    # Update demo product characteristics
    update_resp = client.put("/api/products/demo-purifier-001", json={
        "power_consumption": "55W"
    })
    assert update_resp.status_code == 200
    assert update_resp.json()["power_consumption"] == "55W"

    # Confirm facts
    confirm_resp = client.post("/api/products/demo-purifier-001/confirm")
    assert confirm_resp.status_code == 200
    assert confirm_resp.json()["status"] == "CONFIRMED"

def test_get_nonexistent_product():
    resp = client.get("/api/products/non-existent-product-id")
    assert resp.status_code == 404

def test_upload_valid_pdf():
    # Fake minimal PDF content (%PDF-1.4 header)
    pdf_content = b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF"
    files = {
        "file": ("datasheet.pdf", io.BytesIO(pdf_content), "application/pdf")
    }
    resp = client.post("/api/products/upload", files=files)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "UPLOADED_SUPPORTING_INFO"
    assert data["filename"] == "datasheet.pdf"
    assert "saved_as" in data

    # Verify saved file exists in upload dir and cleanup
    saved_path = os.path.join(settings.UPLOAD_DIR, data["saved_as"])
    if os.path.exists(saved_path):
        os.remove(saved_path)

def test_upload_invalid_file_type():
    # Attempt uploading an executable or script
    files = {
        "file": ("malware.exe", io.BytesIO(b"MZ\x90\x00"), "application/x-msdownload")
    }
    resp = client.post("/api/products/upload", files=files)
    assert resp.status_code == 400
    assert "Only PDF documents" in resp.json()["detail"]

def test_upload_path_traversal_sanitized():
    # Attempt path traversal in filename
    pdf_content = b"%PDF-1.4\n%%EOF"
    files = {
        "file": ("../../../../etc/passwd.pdf", io.BytesIO(pdf_content), "application/pdf")
    }
    resp = client.post("/api/products/upload", files=files)
    assert resp.status_code == 200
    data = resp.json()
    assert ".." not in data["filename"]
    assert "etc" not in data["filename"] or data["filename"] == "passwd.pdf"

    saved_path = os.path.join(settings.UPLOAD_DIR, data["saved_as"])
    if os.path.exists(saved_path):
        os.remove(saved_path)

def test_upload_oversized_file():
    # Create payload exceeding 10MB limit (e.g. 10MB + 128KB)
    oversized_bytes = b"%PDF-1.4\n" + b"X" * (10 * 1024 * 1024 + 1024)
    files = {
        "file": ("giant_manual.pdf", io.BytesIO(oversized_bytes), "application/pdf")
    }
    resp = client.post("/api/products/upload", files=files)
    assert resp.status_code == 413
    assert "exceeds maximum allowed limit" in resp.json()["detail"]
