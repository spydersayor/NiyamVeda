import pytest
from app.repositories.product_repo import product_repo
from app.rules.engine import rule_engine
from app.services.analysis_service import orchestrator
from app.services.simulation_service import simulation_service
from app.schemas.models import SimulationRequest

def test_demo_product_seeded():
    prod = product_repo.get("demo-purifier-001")
    assert prod is not None
    assert prod.product_name == "Smart Alkaline Water Purifier"
    assert len(prod.facts) == 6

def test_deterministic_rule_engine():
    prod = product_repo.get("demo-purifier-001")
    results = rule_engine.evaluate_all(prod)
    assert len(results) > 0
    rule_ids = [r.rule_id for r in results]
    assert "RULE-BIS-014" in rule_ids
    assert "RULE-BIS-002" in rule_ids

def test_orchestrator_analysis():
    prod = product_repo.get("demo-purifier-001")
    result = orchestrator.analyze(prod)
    assert result.relevant_standards_count >= 3
    assert result.key_requirements_count == len(result.requirements)
    assert result.key_requirements_count > 0
    assert len(result.pathway_stages) == 5
    assert len(result.risks) > 0
    assert result.safe_abstention.activated is True  # UV-LED Chamber triggered safe abstention

def test_simulation_service():
    req = SimulationRequest(
        product_id="demo-purifier-001",
        material="Flame-Retardant ABS",
        operating_voltage="110V AC",
        intended_use="Commercial Use"
    )
    sim = simulation_service.simulate(req)
    assert "IS/IEC 60950-1: 2010" in sim.standards_diff["added"]
    assert "EMC Test" in sim.tests_diff["added"]
    assert len(sim.deterministic_provenance) > 0
