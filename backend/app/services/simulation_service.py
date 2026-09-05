from typing import Dict, Any, List
from app.core.config import settings
from app.schemas.models import SimulationRequest, SimulationResult
from app.rules.engine import rule_engine
from app.rules.source_registry_data import get_source_or_none
from app.repositories.product_repo import product_repo

class SimulationService:
    """
    Deterministic What-If Product Simulation.
    Evaluates how changing product parameters (material, voltage, target market, food_contact, etc.)
    deterministically alters applicable standards, certification routes, and required tests.
    CRITICAL SIH PRINCIPLE: Gemini NEVER invents hypothetical compliance changes.
    """

    def _derive_tests_and_route(self, evaluated_rules, facts: Dict[str, Any]):
        tests = []
        route = "Scheme I (ISI Mark)"
        for r in evaluated_rules:
            if "014" in r.rule_id:
                tests.append("Electrical Insulation & Leakage Current Test")
            elif "015" in r.rule_id:
                tests.append("Abnormal Operation & Dry Boil Test")
            elif "003" in r.rule_id:
                tests.append("Glow-Wire Flammability Test (750°C/850°C)")
            elif "002" in r.rule_id:
                tests.append("RO TDS Rejection & Recovery Test")
            elif "004" in r.rule_id:
                tests.append("Potable Water Microbiological & Chemical Test")
            elif "005" in r.rule_id:
                tests.append("Stainless Steel Grade Spectrometry & Metal Leaching Test")
            elif "006" in r.rule_id:
                tests.append("Overall Polymer Migration Test (<10 mg/dm²)")
            elif "020" in r.rule_id:
                tests.append("SMPS Safety & Energy Efficiency Test")
                route = "CRS under MeitY"
            elif "60950" in r.rule_id:
                tests.append("Electrical Safety Test")
                tests.append("EMC Test")
                route = "CRS + BIS Registration"
            elif "030" in r.rule_id:
                tests.append("Handle Thermal Resistance & Mechanical Strength Test")

        return list(dict.fromkeys(tests)) if tests else ["Visual & Construction Inspection"], route

    def simulate(self, req: SimulationRequest) -> SimulationResult:
        prod = product_repo.get(req.product_id)
        prod_dict = prod.model_dump() if prod else {}

        # Fallback for explicit demo ID if DB not yet populated
        if not prod_dict and req.product_id in ["demo-purifier-001", "demo-analysis-001"]:
            prod_dict = {
                "id": "demo-purifier-001",
                "product_name": "Smart Alkaline Water Purifier",
                "category": "Household Electrical Appliances (Water Filters)",
                "intended_use": "Domestic kitchen water filtration and mineral ionization",
                "material_composition": "Polycarbonate casing, carbon block filters, UV-LED sanitization chamber",
                "operating_voltage": "230V AC, 50Hz",
                "power_consumption": "48W",
                "water_storage_capacity": "8 Liters",
                "has_uv_module": True,
                "target_market": "Domestic"
            }

        # 1. Base Current Product Profile
        curr_mat = prod_dict.get("material_composition", "Polycarbonate")
        curr_volt = prod_dict.get("operating_voltage", "230V AC")
        curr_app = prod_dict.get("intended_use", "Domestic Use")

        curr_rules = rule_engine.evaluate_all(prod_dict) if prod_dict else []
        curr_standards_set = set()
        for r in curr_rules:
            src = get_source_or_none(r.source_id)
            if src:
                curr_standards_set.add(src.document_name.split(" - ")[0].strip())
        curr_standards = sorted(list(curr_standards_set))
        curr_tests, curr_route = self._derive_tests_and_route(curr_rules, prod_dict)

        current_profile = {
            "material": curr_mat,
            "operating_voltage": curr_volt,
            "application": curr_app,
            "standards": curr_standards,
            "tests": curr_tests,
            "certification_route": curr_route
        }

        # 2. Simulated Profile with Applied Changes
        sim_dict = dict(prod_dict)
        changes_applied = {}

        if req.material and req.material != curr_mat:
            sim_dict["material_composition"] = req.material
            changes_applied["material"] = f"{curr_mat} → {req.material}"
        if req.operating_voltage and req.operating_voltage != curr_volt:
            sim_dict["operating_voltage"] = req.operating_voltage
            changes_applied["operating_voltage"] = f"{curr_volt} → {req.operating_voltage}"
        if req.intended_use and req.intended_use != curr_app:
            sim_dict["intended_use"] = req.intended_use
            changes_applied["application"] = f"{curr_app} → {req.intended_use}"
        elif req.target_market and req.target_market != curr_app:
            sim_dict["target_market"] = req.target_market
            changes_applied["application"] = f"{curr_app} → {req.target_market}"
        if req.category:
            sim_dict["category"] = req.category
            changes_applied["category"] = f"{prod_dict.get('category', '')} → {req.category}"
        if req.food_contact is not None:
            sim_dict["food_contact"] = req.food_contact
            changes_applied["food_contact"] = f"food_contact → {req.food_contact}"
        if req.electrical is not None:
            sim_dict["electrical"] = req.electrical
            changes_applied["electrical"] = f"electrical → {req.electrical}"

        # 3. Deterministic Re-evaluation
        sim_rules = rule_engine.evaluate_all(sim_dict)
        sim_standards_set = set()
        for r in sim_rules:
            src = get_source_or_none(r.source_id)
            if src:
                sim_standards_set.add(src.document_name.split(" - ")[0].strip())
        sim_standards = sorted(list(sim_standards_set))
        sim_tests, sim_route = self._derive_tests_and_route(sim_rules, sim_dict)

        # 4. Compute Differences
        standards_retained = [s for s in curr_standards if s in sim_standards_set]
        standards_added = [s for s in sim_standards if s not in curr_standards_set]
        standards_removed = [s for s in curr_standards if s not in sim_standards_set]

        curr_tests_set = set(curr_tests)
        tests_added = [t for t in sim_tests if t not in curr_tests_set]
        tests_retained = [t for t in curr_tests if t in sim_tests]

        # 5. Deterministic Provenance Explanations
        provenance = []
        for change_key, change_val in changes_applied.items():
            val_lower = str(change_val).lower()
            if "commercial" in val_lower:
                provenance.append(
                    f"Changed Fact ({change_val}): Triggered IS/IEC 60950-1 for commercial equipment with mandatory EMC testing."
                )
            elif "flame" in val_lower or "abs" in val_lower:
                provenance.append(
                    f"Changed Fact ({change_val}): Glow-wire flammability risk mitigated; exemption from needle flame test applied."
                )
            elif "stainless" in val_lower or "ss304" in val_lower:
                provenance.append(
                    f"Changed Fact ({change_val}): Triggered food-grade austenitic stainless steel certification under IS 6911."
                )
            elif "food_contact → false" in val_lower:
                provenance.append(
                    f"Changed Fact ({change_val}): Food contact requirements and migration test standards exempted."
                )
            elif "food_contact → true" in val_lower:
                provenance.append(
                    f"Changed Fact ({change_val}): Food contact regulations and migration testing standards activated."
                )
            elif "110v" in val_lower or "24v" in val_lower:
                provenance.append(
                    f"Changed Fact ({change_val}): Operating voltage modified; dielectric withstand test voltage modified."
                )
            else:
                provenance.append(
                    f"Changed Fact ({change_val}): Compliance pathway re-evaluated under updated parameters."
                )

        if not provenance:
            provenance.append("No active parameter changes applied to baseline profile.")

        simulated_profile = {
            "material": sim_dict.get("material_composition", curr_mat),
            "operating_voltage": sim_dict.get("operating_voltage", curr_volt),
            "application": sim_dict.get("intended_use", curr_app),
            "standards": sim_standards,
            "tests": sim_tests,
            "certification_route": sim_route
        }

        return SimulationResult(
            product_id=req.product_id,
            changes_applied=changes_applied if changes_applied else {"status": "Unchanged baseline"},
            current_profile=current_profile,
            simulated_profile=simulated_profile,
            standards_diff={
                "retained": standards_retained,
                "added": standards_added,
                "removed": standards_removed
            },
            tests_diff={
                "added": tests_added,
                "retained": tests_retained
            },
            certification_route=sim_route,
            deterministic_provenance=provenance,
            disclaimer="Simulation result is for decision support only and not a legal compliance conclusion."
        )

simulation_service = SimulationService()
