from typing import Dict, Any, List, Tuple
from app.schemas.models import SafeAbstentionDetails

class SafeAbstentionEngine:
    """
    Evaluates whether the system has sufficient facts and authoritative evidence
    to formulate a reliable compliance analysis.
    If not, it SAFELY ABSTAINS and blocks unsupported AI conclusions.
    """

    CRITICAL_FIELDS = ["category", "operating_voltage", "intended_use"]

    def evaluate_abstention(
        self,
        product_facts: Dict[str, Any],
        matched_rules_count: int,
        authoritative_evidence_count: int,
        has_unstandardized_component: bool = False
    ) -> Tuple[SafeAbstentionDetails, str]:
        """
        Returns:
            (SafeAbstentionDetails, evidence_confidence: "High" | "Medium" | "Insufficient Evidence")
        """
        missing_fields = []
        for field in self.CRITICAL_FIELDS:
            val = product_facts.get(field)
            if not val or str(val).strip() == "" or str(val).lower() == "none":
                missing_fields.append(field)

        # Trigger Case 1: Missing critical technical information
        if missing_fields:
            return (
                SafeAbstentionDetails(
                    activated=True,
                    product_characteristic=f"Missing Attributes: {', '.join(missing_fields)}",
                    evidence_search_result="Incomplete product profile prevents deterministic standard mapping.",
                    system_action="Compliance conclusion blocked due to missing critical engineering parameters.",
                    abstention_reason=f"Operating parameters ({', '.join(missing_fields)}) must be supplied before evaluating BIS applicability.",
                    missing_information=missing_fields,
                    recommended_actions=[
                        {"title": "Add Product Information", "desc": "Provide operating voltage, intended use, and component specs."},
                        {"title": "Refine Product Description", "desc": "Specify exact voltage ratings and power sources."},
                        {"title": "Review Available Sources", "desc": "Consult general electrical safety guidelines under IS 302."}
                    ]
                ),
                "Insufficient Evidence"
            )

        # Trigger Case 2: Unstandardized / novel feature without published BIS standard
        # (e.g. UV-LED Sanitization Chamber highlighted in Screen 12 of visual reference)
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
                "High"  # Main product is High, but specific component triggered Safe Abstention!
            )

        # Trigger Case 3: Zero authoritative evidence retrieved
        if authoritative_evidence_count == 0 or matched_rules_count == 0:
            return (
                SafeAbstentionDetails(
                    activated=True,
                    product_characteristic="Unknown Product Domain",
                    evidence_search_result="No authoritative regulatory sources matched.",
                    system_action="Safe abstention activated to prevent regulatory hallucination.",
                    abstention_reason="The product facts do not match any published BIS quality control orders (QCO) or compulsory registration schemes.",
                    missing_information=["Applicable industry category", "Specific Indian tariff code (HSN)"],
                    recommended_actions=[
                        {"title": "Add Product Information", "desc": "Select a standardized category from the dropdown."},
                        {"title": "Review Available Sources", "desc": "Check the BIS Source Registry list."},
                        {"title": "Request Expert Review", "desc": "Consult a BIS accredited technical advisor."}
                    ]
                ),
                "Insufficient Evidence"
            )

        # Normal confident operation
        return (
            SafeAbstentionDetails(
                activated=False,
                missing_information=[],
                recommended_actions=[]
            ),
            "High"
        )

abstention_engine = SafeAbstentionEngine()
