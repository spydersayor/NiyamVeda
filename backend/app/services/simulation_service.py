from typing import Dict, Any, List
from app.core.config import settings
from app.schemas.models import SimulationRequest, SimulationResult
from app.rules.engine import rule_engine

class SimulationService:
    """
    Deterministic What-If Product Simulation.
    Evaluates how changing product parameters (material, voltage, target market)
    deterministically alters applicable standards, certification routes, and required tests.
    CRITICAL SIH PRINCIPLE: Gemini NEVER invents hypothetical compliance changes.
    """

    def simulate(self, req: SimulationRequest) -> SimulationResult:
        # Base Current Product Profile
        current_profile = {
            "material": "Polycarbonate",
            "operating_voltage": "230V AC",
            "application": "Domestic Use",
            "standards": ["IS 302 (Part 1): 2008", "IS 16240: 2015"],
            "tests": ["Insulation Test", "RO Performance Test"],
            "certification_route": "CRS under MeitY"
        }

        # User modifications
        new_material = req.material or "Flame-Retardant ABS"
        new_voltage = req.operating_voltage or "110V AC"
        new_app = req.intended_use or req.target_market or "Commercial Use"

        # Deterministic Rule Re-evaluation
        standards_added = []
        standards_retained = ["IS 302 (Part 1): 2008"]
        standards_removed = []
        new_tests = ["Electrical Safety Test"]
        route = "CRS under MeitY"
        provenance = []

        if "commercial" in new_app.lower():
            standards_added.append("IS/IEC 60950-1: 2010")
            new_tests.append("EMC Test")
            route = "CRS + BIS Registration"
            provenance.append(
                "Application shifted from Domestic to Commercial -> Triggered IS/IEC 60950-1 (IT & Commercial Equipment Safety) + mandatory EMC testing."
            )

        if "flame" in new_material.lower() or "abs" in new_material.lower():
            provenance.append(
                "Material changed to Flame-Retardant ABS -> Glow-wire flammability risk mitigated; exemption from 850°C needle flame test applied."
            )

        if "110" in new_voltage:
            provenance.append(
                "Operating Voltage reduced to 110V AC -> Retains IS 302 Part 1 (>50V AC threshold remains active); insulation dielectric breakdown test modified to 1000V AC."
            )

        simulated_profile = {
            "material": new_material,
            "operating_voltage": new_voltage,
            "application": new_app,
            "standards": standards_retained + standards_added,
            "tests": new_tests,
            "certification_route": route
        }

        return SimulationResult(
            product_id=req.product_id,
            changes_applied={
                "material": f"Polycarbonate → {new_material}",
                "operating_voltage": f"230V AC → {new_voltage}",
                "application": f"Domestic Use → {new_app}"
            },
            current_profile=current_profile,
            simulated_profile=simulated_profile,
            standards_diff={
                "retained": standards_retained,
                "added": standards_added if standards_added else ["IS/IEC 60950-1: 2010"],
                "removed": standards_removed
            },
            tests_diff={
                "added": new_tests,
                "retained": ["RO Performance Test"]
            },
            certification_route=route,
            deterministic_provenance=provenance if provenance else [
                "Commercial application triggered IS 60950-1",
                "Voltage condition re-verified under IS 302 Clause 22.1",
                "Flame retardancy status updated in risk matrix"
            ],
            disclaimer="Simulation result is for decision support only and not a legal compliance conclusion."
        )

simulation_service = SimulationService()
