import sys
import json
import fitz
from fastapi.testclient import TestClient
from app.main import app

sys.stdout.reconfigure(encoding='utf-8')

client = TestClient(app)

def run_verification():
    print("=== LIVE VERIFICATION RUN ===")
    
    # 1. Product A: Water Purifier
    purifier_payload = {
        "product_name": "Smart Alkaline RO Water Purifier",
        "category": "Household Electrical Appliances (Water Filters)",
        "intended_use": "Residential drinking water purification",
        "material_composition": "Polycarbonate casing, activated carbon block, RO membrane",
        "technical_characteristics": "230V AC, 50Hz, 60W, 8.5L storage, thin-film composite reverse osmosis membrane",
        "operating_voltage": "230V AC, 50Hz",
        "power_consumption": "60W",
        "water_storage_capacity": "8.5 Liters",
        "has_uv_module": False
    }
    res_a = client.post("/api/analyze", json=purifier_payload).json()

    # 2. Product B: Electric Kettle
    kettle_payload = {
        "product_name": "ThermoSmart Electric Kettle 1.7L",
        "category": "Household Electrical Appliances (Liquid Heaters)",
        "intended_use": "Domestic boiling and heating liquids",
        "material_composition": "SS304 Food-Grade Austenitic Stainless Steel body, Polypropylene lid",
        "technical_characteristics": "230V AC, 50Hz, 1200W, 1.7L capacity, dual thermal cut-out dry-boil protector",
        "operating_voltage": "230V AC, 50Hz",
        "power_consumption": "1200W",
        "water_storage_capacity": "1.7 Liters",
        "has_uv_module": False
    }
    res_b = client.post("/api/analyze", json=kettle_payload).json()

    # 3. Product C: Stainless Steel Utensils (Non-electrical)
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
    res_c = client.post("/api/analyze", json=utensil_payload).json()

    # 4. Product D: Unknown Product
    unknown_payload = {
        "product_name": "QuantumFlux Industrial Orbital Regulator",
        "category": "Theoretical Quantum Physics Modules",
        "intended_use": "Sub-atomic vacuum wave phase modulation",
        "material_composition": "Graphene-coated metamaterial alloy",
        "technical_characteristics": "Superconducting zero-resistance field generator",
        "operating_voltage": "Superconducting Phase Flux",
        "power_consumption": "Variable Flux",
        "water_storage_capacity": "0L",
        "has_uv_module": False
    }
    res_d = client.post("/api/analyze", json=unknown_payload).json()

    # Summary table output
    results = [
        ("Product A: Smart Alkaline Purifier", res_a),
        ("Product B: ThermoSmart Electric Kettle", res_b),
        ("Product C: SS Cookware (Non-electrical)", res_c),
        ("Product D: QuantumFlux Regulator (Unknown)", res_d),
    ]

    print("\n" + "="*110)
    print(f"{'Product':<40} | {'Standards':<10} | {'Reqs':<6} | {'Attn':<6} | {'Compl%':<8} | {'Confidence':<22}")
    print("="*110)
    for name, r in results:
        print(f"{name:<40} | {r.get('relevant_standards_count', 0):<10} | {r.get('key_requirements_count', 0):<6} | {r.get('attention_needed_count', 0):<6} | {r.get('checklist_completion_percent', 0)}%{' ':<4} | {r.get('evidence_confidence', ''):<22}")
    print("="*110)

    print("\nSTANDARDS BREAKDOWN:")
    for name, r in results:
        std_list = [s['standard_identifier'] for s in r.get('standards', [])]
        print(f"{name}: {std_list if std_list else '[Safe Abstention: 0 Standards mapped]'}")

    # 5. Parameter Change Run
    print("\n--- PARAMETER CHANGE RUN ---")
    base_prod = {
        "product_name": "Modular Electrical Device",
        "category": "Household Electrical Appliances",
        "intended_use": "Domestic food warming",
        "material_composition": "Polycarbonate housing",
        "operating_voltage": "230V AC",
        "power_consumption": "100W",
        "water_storage_capacity": "0L",
        "has_uv_module": False
    }
    res_poly = client.post("/api/analyze", json=base_prod).json()
    poly_rules = [r["rule_id"] for r in res_poly["evaluated_rules"]]

    mod_prod = dict(base_prod)
    mod_prod["material_composition"] = "SS304 Food-Grade Stainless Steel"
    res_ss = client.post("/api/analyze", json=mod_prod).json()
    ss_rules = [r["rule_id"] for r in res_ss["evaluated_rules"]]

    print(f"Base (Polycarbonate) Rules: {poly_rules}")
    print(f"Modified (SS304) Rules:     {ss_rules}")
    print(f"Diff: Removed {set(poly_rules) - set(ss_rules)}, Added {set(ss_rules) - set(poly_rules)}")

    # 6. PDF Extraction Run
    print("\n--- PDF EXTRACTION RUN ---")
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

    upload_res = client.post("/api/products/upload", files={"file": ("kettle_datasheet.pdf", pdf_bytes, "application/pdf")}).json()
    print("Extracted PDF Facts:", json.dumps(upload_res.get("extracted_facts", {}), indent=2))

    # 7. What-If Simulation Run
    print("\n--- WHAT-IF SIMULATION RUN ---")
    sim_payload = {
        "product_id": "demo-purifier-001",
        "material": "SS304 Stainless Steel",
        "intended_use": "Domestic food warming"
    }
    sim_res = client.post("/api/simulation", json=sim_payload).json()
    print("Simulation Retained Standards:", sim_res["standards_diff"]["retained"])
    print("Simulation Added Standards:   ", sim_res["standards_diff"]["added"])
    print("Simulation Removed Standards: ", sim_res["standards_diff"]["removed"])
    print("Simulation Certification Route:", sim_res["simulated_profile"]["certification_route"])
    print("Simulation Provenance:        ", sim_res["deterministic_provenance"])

if __name__ == "__main__":
    run_verification()
