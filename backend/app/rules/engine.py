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

        voltage_str = str(p_dict.get("operating_voltage", "") or "")
        power_str = str(p_dict.get("power_consumption", "") or "")
        storage_str = str(p_dict.get("water_storage_capacity", "") or "")
        category_str = str(p_dict.get("category", "") or "").lower()
        intended_use_str = str(p_dict.get("intended_use", "") or "").lower()
        material_str = str(p_dict.get("material_composition", "") or "").lower()
        tech_str = str(p_dict.get("technical_characteristics", "") or "").lower()
        target_market_str = str(p_dict.get("target_market", "") or "").lower()

        voltage_num = extract_number(voltage_str)
        power_num = extract_number(power_str)

        # Electrical determination based on facts
        is_electrical = p_dict.get("electrical")
        if is_electrical is None:
            has_voltage = voltage_num > 0 or any(t in voltage_str.lower() for t in ["v", "ac", "dc", "volt", "hz"])
            is_appl = any(t in category_str for t in ["electrical", "electronic", "appliance"])
            is_non_elec = any(t in category_str for t in ["non-electrical", "manual", "cookware", "utensil"])
            is_electrical = (has_voltage or is_appl) and not is_non_elec

        # Heating element determination
        has_heating = p_dict.get("heating_element")
        if has_heating is None:
            has_heating = any(t in tech_str or t in intended_use_str for t in ["heating", "heater", "boil", "kettle", "element"])

        # Food contact determination
        food_contact = p_dict.get("food_contact")
        if food_contact is None:
            food_contact = any(
                t in intended_use_str or t in tech_str or t in category_str
                for t in ["water", "drinking", "food", "kitchen", "cook", "boil", "beverage", "filtration", "purif", "utensil", "potable"]
            )

        # Water purification determination (not simply heating/boiling water)
        water_purification = (
            any(t in intended_use_str or t in tech_str or t in category_str for t in ["water filter", "water purif", "reverse osmosis", " ro ", "point-of-use", "filtration"])
            and not any(t in intended_use_str for t in ["boiling and heating", "kettle", "cookware"])
        )

        # Material flags
        has_stainless_steel = any(t in material_str or t in tech_str for t in ["stainless", "steel", "ss304", "ss316", "ss 304", "ss 316", "inox"])
        has_polycarbonate = "polycarbonate" in material_str
        has_plastic = any(t in material_str or t in tech_str for t in ["plastic", "polycarbonate", "polypropylene", "pp", "abs", "polymer", "resin"])
        is_commercial = any(t in target_market_str or t in intended_use_str for t in ["commercial", "industrial", "office", "enterprise"])

        return {
            "category": category_str,
            "intended_use": intended_use_str,
            "material_composition": material_str,
            "technical_characteristics": tech_str,
            "operating_voltage": voltage_str,
            "operating_voltage_raw": voltage_str,
            "operating_voltage_num": voltage_num,
            "power_consumption": power_str,
            "power_consumption_num": power_num,
            "water_storage_capacity": storage_str,
            "water_storage_capacity_num": extract_number(storage_str),
            "is_electrical": bool(is_electrical),
            "has_heating_element": bool(has_heating),
            "food_contact": bool(food_contact),
            "water_purification": bool(water_purification),
            "has_stainless_steel": bool(has_stainless_steel),
            "has_polycarbonate": bool(has_polycarbonate),
            "has_plastic": bool(has_plastic),
            "is_commercial": bool(is_commercial),
            "has_uv_module": bool(p_dict.get("has_uv_module", False) or "uv" in tech_str or "uv" in material_str),
            "target_market": target_market_str,
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
        clause_excerpt = f"{source.document_name} - {rule.source_clause}: {rule.output_requirement}"

        input_facts_display = {}
        for cond in rule.conditions:
            input_facts_display[cond.field] = facts.get(cond.field)
        if facts.get("category"):
            input_facts_display["category"] = facts.get("category")
        if facts.get("operating_voltage_raw"):
            input_facts_display["operating_voltage"] = facts.get("operating_voltage_raw")
        if facts.get("material_composition"):
            input_facts_display["material"] = facts.get("material_composition")
        if facts.get("intended_use"):
            input_facts_display["intended_use"] = facts.get("intended_use")

        return RuleEvaluationResult(
            rule_id=rule.rule_id,
            rule_name=rule.rule_name,
            matched=True,
            input_facts=input_facts_display,
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
