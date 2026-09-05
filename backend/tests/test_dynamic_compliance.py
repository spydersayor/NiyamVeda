import io
import pytest
import fitz
from fastapi.testclient import TestClient
from app.main import app
from app.services.analysis_service import orchestrator
from app.services.simulation_service import simulation_service
from app.schemas.models import ProductCreate, SimulationRequest

client = TestClient(app)

# ─── 1. Multi-Product Differentiation Test ───────────────────────────────────

def test_multi_product_differentiation():
    # Product A: Smart Alkaline Water Purifier
    purifier_payload = {
        "product_name": "PureFlow Smart Alkaline Water Purifier",
        "category": "Household Electrical Appliances (Water Filters)",
        "intended_use": "Domestic kitchen water filtration and mineral ionization",
        "material_composition": "Polycarbonate casing, activated carbon block, RO membrane",
        "technical_characteristics": "230V AC, 50Hz, 48W, 8L storage capacity, RO filtration",
        "operating_voltage": "230V AC, 50Hz",
        "power_consumption": "48W",
        "water_storage_capacity": "8 Liters",
        "has_uv_module": False
    }

    # Product B: ThermoSmart Electric Kettle
    kettle_payload = {
        "product_name": "ThermoSmart Rapid Boil Electric Kettle",
        "category": "Household Electrical Appliances (Liquid Heaters)",
        "intended_use": "Domestic boiling and heating of potable water",
        "material_composition": "SS304 Stainless Steel body, Polypropylene handle and lid",
        "technical_characteristics": "230V AC, 50Hz, 1200W, 1.7L capacity, dual thermal cut-out dry-boil protector",
        "operating_voltage": "230V AC, 50Hz",
        "power_consumption": "1200W",
        "water_storage_capacity": "1.7 Liters",
        "has_uv_module": False
    }

    # Product C: Stainless Steel Kitchen Utensils (Non-electrical)
    utensil_payload = {
        "product_name": "Heritage Tri-Ply Stainless Steel Cooking Pot",
        "category": "Non-Electrical Cookware and Kitchen Utensils",
        "intended_use": "Food cooking and culinary preparation",
        "material_composition": "SS304 Food-Grade Austenitic Stainless Steel",
        "technical_characteristics": "Non-electrical unpowered cooking utensil, 3L capacity",
        "operating_voltage": "None (Non-electrical)",
        "power_consumption": "0W",
        "water_storage_capacity": "3 Liters",
        "has_uv_module": False
    }

    resp_a = client.post("/api/analyze", json=purifier_payload)
    assert resp_a.status_code == 200
    res_a = resp_a.json()

    resp_b = client.post("/api/analyze", json=kettle_payload)
    assert resp_b.status_code == 200
    res_b = resp_b.json()

    resp_c = client.post("/api/analyze", json=utensil_payload)
    assert resp_c.status_code == 200
    res_c = resp_c.json()

    # Extract standard identifiers
    std_ids_a = [s["standard_identifier"] for s in res_a["standards"]]
    std_ids_b = [s["standard_identifier"] for s in res_b["standards"]]
    std_ids_c = [s["standard_identifier"] for s in res_c["standards"]]

    # Assertions for Product A (Water Purifier):
    # Should include RO (IS 16240), Drinking Water (IS 10500), General Electrical (IS 302-1), Polycarbonate (IS 13428 / IS 15444)
    assert any("16240" in s for s in std_ids_a), f"Expected IS 16240 in {std_ids_a}"
    assert any("10500" in s for s in std_ids_a), f"Expected IS 10500 in {std_ids_a}"
    assert any("302" in s for s in std_ids_a), f"Expected IS 302 in {std_ids_a}"
    # Must NOT include liquid heating (IS 302-2-15) or Cookware (IS 14756)
    assert not any("302 (Part 2/Sec 15)" in s for s in std_ids_a)
    assert not any("14756" in s for s in std_ids_a)

    # Assertions for Product B (Electric Kettle):
    # Should include Liquid Heating (IS 302-2-15), General Electrical (IS 302-1), Food Contact SS (IS 6911)
    assert any("302 (Part 2/Sec 15)" in s or "302" in s for s in std_ids_b), f"Expected IS 302 in {std_ids_b}"
    assert any("6911" in s for s in std_ids_b), f"Expected IS 6911 in {std_ids_b}"
    # Must NOT include Water Purifier RO (IS 16240) or Potable Effluent (IS 10500)
    assert not any("16240" in s for s in std_ids_b), f"Kettle should not have IS 16240: {std_ids_b}"
    assert not any("10500" in s for s in std_ids_b), f"Kettle should not have IS 10500: {std_ids_b}"

    # Assertions for Product C (Non-Electrical Stainless Steel Utensils):
    # Should include SS Specification (IS 6911) and Utensils (IS 14756)
    assert any("6911" in s for s in std_ids_c), f"Expected IS 6911 in {std_ids_c}"
    assert any("14756" in s for s in std_ids_c), f"Expected IS 14756 in {std_ids_c}"
    # Must NOT include any electrical standards (IS 302-1, IS 302-2-15, MeitY CRS)
    assert not any("302" in s for s in std_ids_c), f"Non-electrical utensil must not have IS 302: {std_ids_c}"
    assert not any("16240" in s for s in std_ids_c), f"Non-electrical utensil must not have IS 16240: {std_ids_c}"
    assert not any("CRS" in s or "MEITY" in s for s in std_ids_c), f"Non-electrical utensil must not have CRS: {std_ids_c}"

    # Verify metrics differentiate
    assert res_a["key_requirements_count"] != res_c["key_requirements_count"]
    assert res_a["relevant_standards_count"] != res_c["relevant_standards_count"]


# ─── 2. Parameter-Change Test ────────────────────────────────────────────────

def test_parameter_change_determinism():
    base_product = {
        "product_name": "Modular Electrical Device",
        "category": "Household Electrical Appliances",
        "intended_use": "Domestic food warming",
        "material_composition": "Polycarbonate housing",
        "operating_voltage": "230V AC",
        "power_consumption": "100W",
        "water_storage_capacity": "0L",
        "has_uv_module": False
    }

    res_base = client.post("/api/analyze", json=base_product).json()
    base_rules = [r["rule_id"] for r in res_base["evaluated_rules"]]

    # Polycarbonate under mains voltage triggers RULE-BIS-003 (glow-wire flammability)
    assert "RULE-BIS-003" in base_rules

    # Change material to non-polycarbonate: Stainless Steel 304
    modified_product = dict(base_product)
    modified_product["material_composition"] = "Stainless Steel 304"

    res_mod = client.post("/api/analyze", json=modified_product).json()
    mod_rules = [r["rule_id"] for r in res_mod["evaluated_rules"]]

    # Polycarbonate rule must no longer trigger; Stainless steel food contact RULE-BIS-005 must trigger!
    assert "RULE-BIS-003" not in mod_rules
    assert "RULE-BIS-005" in mod_rules


# ─── 3. PDF Technical Datasheet Extraction Test ─────────────────────────────

def test_pdf_upload_influence():
    # Build a synthetic PDF datasheet in memory with PyMuPDF
    doc = fitz.open()
    page = doc.new_page()
    text = (
        "APEX APPLIANCES INDIA PVT LTD\n"
        "TECHNICAL SPECIFICATION SHEET\n"
        "Model: ThermoSmart Kettle 1700\n"
        "Rated Voltage: 230V AC, 50Hz\n"
        "Rated Power: 1200W\n"
        "Capacity: 1.7L\n"
        "Material: SS304 Stainless Steel with Polypropylene lid\n"
        "Application: Domestic boiling and heating liquids with automatic dry-boil thermal cut-out\n"
    )
    page.insert_text((50, 72), text, fontsize=11)
    pdf_bytes = doc.tobytes()
    doc.close()

    # Upload PDF
    resp = client.post(
        "/api/products/upload",
        files={"file": ("kettle_datasheet.pdf", pdf_bytes, "application/pdf")}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "extracted_facts" in data

    extracted = data["extracted_facts"]
    assert "230V" in extracted.get("operating_voltage", "")
    assert "1200W" in extracted.get("power_consumption", "")
    assert "1.7L" in extracted.get("water_storage_capacity", "")
    assert "SS304" in extracted.get("material_composition", "") or "Stainless Steel" in extracted.get("material_composition", "")
    assert extracted.get("has_heating_element") is True

    # Now create product with these extracted facts and verify analysis recognizes them
    prod_create = {
        "product_name": "ThermoSmart Kettle 1700",
        "category": extracted.get("category", "Household Electrical Appliances (Liquid Heaters)"),
        "intended_use": extracted.get("intended_use", "Domestic boiling and heating liquids"),
        "material_composition": extracted.get("material_composition", "SS304 Stainless Steel"),
        "operating_voltage": extracted.get("operating_voltage", "230V AC, 50Hz"),
        "power_consumption": extracted.get("power_consumption", "1200W"),
        "water_storage_capacity": extracted.get("water_storage_capacity", "1.7L"),
        "technical_characteristics": "Extracted from kettle_datasheet.pdf: 1200W, dry-boil thermal cut-out"
    }

    analysis_resp = client.post("/api/analyze", json=prod_create)
    assert analysis_resp.status_code == 200
    res = analysis_resp.json()
    rule_ids = [r["rule_id"] for r in res["evaluated_rules"]]
    assert "RULE-BIS-015" in rule_ids  # Liquid heating dry boil rule triggered!
    assert "RULE-BIS-005" in rule_ids  # SS304 food contact rule triggered!


# ─── 4. Unknown Product Safe Abstention Test ─────────────────────────────────

def test_unknown_product_safe_abstention():
    unknown_payload = {
        "product_name": "QuantumFlux Industrial Orbital Regulator",
        "category": "Quantum Physics & Particle Dynamics",
        "intended_use": "Subatomic tachyon flux stabilization",
        "material_composition": "Dark Matter Alloy and Superconducting Plasma",
        "technical_characteristics": "Operates via non-electromagnetic tachyon wave oscillation",
        "operating_voltage": "N/A Non-standard",
        "power_consumption": "0W (Zero-point)",
        "water_storage_capacity": "0L",
        "has_uv_module": False
    }

    resp = client.post("/api/analyze", json=unknown_payload)
    assert resp.status_code == 200
    data = resp.json()

    # Must safely abstain
    assert data["safe_abstention"]["activated"] is True
    assert data["evidence_confidence"] == "Insufficient Evidence"
    assert data["relevant_standards_count"] == 0
    assert data["key_requirements_count"] == 0
    assert len(data["standards"]) == 0
    assert len(data["requirements"]) == 0
    assert len(data["risks"]) == 0
    assert data["checklist_completion_percent"] == 0
    # Must NOT return water purifier demo standards
    for std in data["standards"]:
        assert "16240" not in std["standard_identifier"]
        assert "10500" not in std["standard_identifier"]


# ─── 5. What-If Parameter Simulation Test ───────────────────────────────────

def test_what_if_simulation_service():
    # Run simulation modifying baseline
    sim_req = SimulationRequest(
        product_id="demo-purifier-001",
        material="Flame-Retardant ABS",
        operating_voltage="110V AC",
        intended_use="Commercial Use",
        target_market="Commercial"
    )

    res = simulation_service.simulate(sim_req)
    assert res.product_id == "demo-purifier-001"
    assert "current_profile" in res.model_dump()
    assert "simulated_profile" in res.model_dump()

    # Commercial use triggers commercial equipment standard IS/IEC 60950-1
    assert any("60950" in s for s in res.standards_diff["added"] or res.simulated_profile["standards"])
    assert len(res.deterministic_provenance) > 0
    assert any("Commercial" in p or "commercial" in p.lower() for p in res.deterministic_provenance)
