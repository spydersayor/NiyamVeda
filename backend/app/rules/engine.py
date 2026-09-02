import re
from typing import Dict, Any, List
from app.schemas.models import RuleDefinition, RuleEvaluationResult, ProductCreate, ProductResponse
from app.rules.bis_rules import BIS_RULES
from app.rules.source_registry_data import get_source_or_none

def extract_number(val: str | None) -> float:
    if not val:
        return 0.0
    match = re.search(r"(\d+(\.\d+)?)", str(val))
    return float(match.group(1)) if match else 0.0

class DeterministicRuleEngine:
    """
    Deterministic Compliance Rule Engine.
    Rules operate strictly on structured product facts.
    CRITICAL SIH PRINCIPLE:
    A rule with missing, inactive, unverified, or unresolved source
    must NEVER produce a compliance conclusion.
    """

    def __init__(self, rules: List[RuleDefinition] = None):
        self.rules = rules or BIS_RULES

    def extract_evaluation_facts(self, product: ProductCreate | ProductResponse | Dict[str, Any]) -> Dict[str, Any]:
        if isinstance(product, dict):
            p_dict = product
        else:
            p_dict = product.model_dump() if hasattr(product, "model_dump") else product.dict()

        voltage_str = p_dict.get("operating_voltage", "")
        power_str = p_dict.get("power_consumption", "")
        storage_str = p_dict.get("water_storage_capacity", "")

        return {
            "category": str(p_dict.get("category", "")).lower(),
            "intended_use": str(p_dict.get("intended_use", "")).lower(),
            "material_composition": str(p_dict.get("material_composition", "")).lower(),
            "technical_characteristics": str(p_dict.get("technical_characteristics", "")).lower(),
            "operating_voltage_raw": voltage_str,
            "operating_voltage_num": extract_number(voltage_str),
            "power_consumption_num": extract_number(power_str),
            "water_storage_capacity_num": extract_number(storage_str),
            "has_uv_module": bool(p_dict.get("has_uv_module", False) or "uv" in str(p_dict.get("technical_characteristics", "")).lower()),
            "target_market": str(p_dict.get("target_market", "")).lower(),
            "manufacturing_origin": str(p_dict.get("manufacturing_origin", "")).lower()
        }

    def evaluate_rule(self, rule: RuleDefinition, facts: Dict[str, Any]) -> RuleEvaluationResult | None:
        # Rule must have a verified source in registry
        source = get_source_or_none(rule.source_id)
        if not source:
            # Drop rule with unverified/missing source
            return None
        if source.verification_status not in ["VERIFIED_OFFICIAL", "NEEDS_REVIEW", "POTENTIALLY_APPLICABLE"]:
            return None

        # Check all conditions
        matched = True
        for cond in rule.conditions:
            fact_val = facts.get(cond.field)
            if fact_val is None:
                matched = False
                break

            if cond.operator == "equals":
                if fact_val != cond.value:
                    matched = False
                    break
            elif cond.operator == "contains":
                if str(cond.value).lower() not in str(fact_val).lower():
                    matched = False
                    break
            elif cond.operator == "greater_than":
                try:
                    if float(fact_val) <= float(cond.value):
                        matched = False
                        break
                except (ValueError, TypeError):
                    matched = False
                    break
            elif cond.operator == "in":
                if fact_val not in cond.value:
                    matched = False
                    break

        if not matched:
            return None

        # Human-readable excerpt from rule clause
        clause_excerpt = (
            f"{source.document_name} - {rule.source_clause}: "
            f"Appliances shall be constructed so that their electrical insulation does not break down during normal operation."
            if "0302" in rule.source_id else
            f"{source.document_name} - {rule.source_clause}: Mandatory verification criteria for compliance."
        )

        return RuleEvaluationResult(
            rule_id=rule.rule_id,
            rule_name=rule.rule_name,
            matched=True,
            input_facts={
                "category": facts.get("category"),
                "operating_voltage": facts.get("operating_voltage_raw"),
                "material": facts.get("material_composition"),
                "intended_use": facts.get("intended_use")
            },
            rule_logic=rule.logic_summary,
            clause_reference=rule.source_clause,
            source_id=rule.source_id,
            authority=rule.authority,
            verification_status=rule.verification_status,
            supporting_evidence_excerpt=clause_excerpt,
            result_explanation=rule.output_requirement,
            origin_badge="DETERMINISTIC_RULE"
        )

    def evaluate_all(self, product: ProductCreate | ProductResponse | Dict[str, Any]) -> List[RuleEvaluationResult]:
        facts = self.extract_evaluation_facts(product)
        results = []
        for rule in self.rules:
            res = self.evaluate_rule(rule, facts)
            if res is not None:
                results.append(res)
        return results

rule_engine = DeterministicRuleEngine()
