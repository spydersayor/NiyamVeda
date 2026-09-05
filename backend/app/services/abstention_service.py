from typing import Dict, Any, List, Tuple
from app.schemas.models import SafeAbstentionDetails

class SafeAbstentionEngine:
    """
    Evaluates whether the system has sufficient facts and authoritative evidence
    to formulate a reliable compliance analysis.
    If not, it SAFELY ABSTAINS and blocks unsupported AI conclusions.
    """

    def evaluate_abstention(
        self,
        product_facts: Dict[str, Any],
        matched_rules_count: int,
        authoritative_evidence_count: int,
        has_unstandardized_component: bool = False
    ) -> Tuple[SafeAbstentionDetails, str]:
        """
        Returns:
            (SafeAbstentionDetails, evidence_confidence: "High" | "Medium" | "Low" | "Insufficient Evidence")
        """
        category = str(product_facts.get("category", "")).lower()
        intended_use = str(product_facts.get("intended_use", "")).lower()
        is_unknown = (
            category in ["", "unknown", "none", "unspecified"]
            and intended_use in ["", "unknown", "none", "unspecified"]
        )

        # Trigger Case 0: Unsupported / unknown product
        if is_unknown or (matched_rules_count == 0 and authoritative_evidence_count == 0):
            return (
                SafeAbstentionDetails(
                    activated=True,
                    product_characteristic="Unknown Product Domain",
                    evidence_search_result="No authoritative regulatory sources or deterministic rules matched.",
                    system_action="Safe abstention activated to prevent regulatory hallucination.",
                    abstention_reason="Insufficient information/evidence to determine applicable compliance requirements. The provided parameters do not match any known BIS quality control order or mandatory standards.",
                    missing_information=["Standardized product category", "Intended use specification", "Material composition"],
                    recommended_actions=[
                        {"title": "Specify Category", "desc": "Provide a recognized appliance, utensil, or industrial category."},
                        {"title": "Define Intended Use", "desc": "Clarify intended consumer, commercial, or industrial application."},
                        {"title": "Review Available Sources", "desc": "Inspect the Bureau of Indian Standards source directory for applicable domains."}
                    ]
                ),
                "Insufficient Evidence"
            )

        # Determine critical fields based on electrical status
        is_electrical = product_facts.get("is_electrical")
        if is_electrical is None:
            volt = str(product_facts.get("operating_voltage", "") or "")
            is_electrical = "electrical" in category or any(v in volt.lower() for v in ["v", "ac", "dc"]) and "non-electrical" not in category

        critical_fields = ["category", "intended_use"]
        if is_electrical:
            critical_fields.append("operating_voltage")

        missing_fields = []
        for field in critical_fields:
            val = product_facts.get(field) or product_facts.get(f"{field}_raw") or product_facts.get(f"{field}_num")
            if val is None or (isinstance(val, str) and (val.strip() == "" or val.lower() in ["none", "unspecified", "unknown"])):
                missing_fields.append(field)

        # Trigger Case 1: Missing critical technical information
        if missing_fields:
            return (
                SafeAbstentionDetails(
                    activated=True,
                    product_characteristic=f"Missing Attributes: {', '.join(missing_fields)}",
                    evidence_search_result="Incomplete product profile prevents deterministic standard mapping.",
                    system_action="Compliance conclusion blocked due to missing critical engineering parameters.",
                    abstention_reason=f"Essential operating parameters ({', '.join(missing_fields)}) must be supplied before evaluating BIS applicability.",
                    missing_information=missing_fields,
                    recommended_actions=[
                        {"title": "Add Product Information", "desc": "Provide operating voltage, intended use, and component specs."},
                        {"title": "Refine Product Description", "desc": "Specify exact voltage ratings and power sources."},
                        {"title": "Review Available Sources", "desc": "Consult general safety guidelines under official BIS standards."}
                    ]
                ),
                "Insufficient Evidence"
            )

        # Trigger Case 2: Unstandardized / novel feature without published BIS standard
        # (e.g. UV-LED Sanitization Chamber)
        if has_unstandardized_component or "uv-led" in str(product_facts.get("material_composition", "")).lower() or "uv-led" in str(product_facts.get("technical_characteristics", "")).lower():
            return (
                SafeAbstentionDetails(
                    activated=True,
                    product_characteristic="UV-LED Sanitization Chamber",
                    evidence_search_result="No sufficiently verified applicable regulatory evidence found in indexed BIS standards.",
                    system_action="AI-generated conclusion blocked for this specific novel characteristic.",
                    abstention_reason="Bureau of Indian Standards currently indexes mercury-vapor UV lamps (IS 16240 Annex A); direct UV-C LED efficacy standards remain in draft/unnotified state.",
                    missing_information=["Specific UV-C emission wavelength (nm)", "Disinfection kill-rate validation report", "Ozone generation emission test"],
                    recommended_actions=[
                        {"title": "Add Product Information", "desc": "Provide additional technical specifications and test lab reports for the UV-LED module."},
                        {"title": "Review Available Sources", "desc": "Inspect authoritative sources in the system to verify current scope under IS 16240: 2015."},
                        {"title": "Refine Product Description", "desc": "Provide more precise technical details regarding standalone vs integrated UV operation."},
                        {"title": "Request Expert Review", "desc": "Submit component specifications to BIS technical committee (ETD/CHD) for custom classification."}
                    ]
                ),
                "High" if matched_rules_count >= 2 else "Medium"
            )

        # Trigger Case 3: Zero rules matched despite having category
        if matched_rules_count == 0:
            return (
                SafeAbstentionDetails(
                    activated=True,
                    product_characteristic="Unregulated Domain",
                    evidence_search_result="No deterministic BIS compliance rules triggered for the supplied parameters.",
                    system_action="Safe abstention activated to avoid fabricating compliance standards.",
                    abstention_reason="Insufficient evidence to determine applicable standard for this specific product profile.",
                    missing_information=["Applicable industry technical specification"],
                    recommended_actions=[
                        {"title": "Review Available Sources", "desc": "Check the BIS Source Registry list."},
                        {"title": "Consult BIS Technical Committee", "desc": "Verify if a voluntary Indian Standard exists."}
                    ]
                ),
                "Insufficient Evidence"
            )

        # Confident operation
        confidence = "High" if matched_rules_count >= 2 and authoritative_evidence_count >= 2 else "Medium"
        return (
            SafeAbstentionDetails(
                activated=False,
                missing_information=[],
                recommended_actions=[]
            ),
            confidence
        )

abstention_engine = SafeAbstentionEngine()
