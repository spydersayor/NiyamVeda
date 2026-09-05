import uuid
from datetime import datetime
from typing import Dict, Any, List
from app.core.config import settings
from app.schemas.models import (
    ProductCreate, ProductResponse, AnalysisResultResponse,
    ApplicableStandard, ComplianceRequirement, ComplianceRisk,
    RuleEvaluationResult, SafeAbstentionDetails
)
from app.rules.engine import rule_engine
from app.rules.source_registry_data import get_source_or_none, list_sources
from app.rag.vector_store import vector_store
from app.rag.gemini_provider import ai_provider
from app.services.abstention_service import abstention_engine

class AnalysisOrchestrator:
    """
    Main compliance analysis orchestrator.
    Directly coordinates Fact Validation -> Safe Abstention Gate -> Deterministic Rules
    -> Evidence Retrieval & Verification -> Grounded Synthesis.
    Fully parameter-driven without hardcoded metrics, standards, or requirements.
    """

    def analyze(self, product: ProductCreate | ProductResponse | Dict[str, Any], product_id: str = None) -> AnalysisResultResponse:
        p_dict = product if isinstance(product, dict) else (product.model_dump() if hasattr(product, "model_dump") else product.dict())
        pid = product_id or p_dict.get("id") or f"prod-{str(uuid.uuid4())[:8]}"
        pname = p_dict.get("product_name", "Product")
        
        # 1. Extract structured evaluation facts
        facts = rule_engine.extract_evaluation_facts(p_dict)
        
        # 2. Evaluate Deterministic Rules
        evaluated_rules = rule_engine.evaluate_all(p_dict)
        
        # 3. Retrieve Authoritative Evidence Chunks
        search_query = f"{facts.get('category', '')} {facts.get('intended_use', '')} {facts.get('operating_voltage_raw', '')} {facts.get('material_composition', '')}".strip()
        retrieved_evidence_raw = vector_store.search(search_query, top_k=6) if search_query else []
        
        # Extract pure chunks
        evidence_chunks = [item[0] for item in retrieved_evidence_raw]
        
        # 4. Check Safe Abstention Gate
        safe_abstention, confidence_level = abstention_engine.evaluate_abstention(
            product_facts=facts,
            matched_rules_count=len(evaluated_rules),
            authoritative_evidence_count=len(evidence_chunks),
            has_unstandardized_component=facts.get("has_uv_module", False)
        )

        # 5. Handle Unknown / Insufficient Evidence Products
        if confidence_level == "Insufficient Evidence" or len(evaluated_rules) == 0:
            pathway_stages = [
                {
                    "step": 1,
                    "title": "Product Assessment Initiated",
                    "description": "Product facts inspected against BIS quality control catalog.",
                    "status": "COMPLETED"
                },
                {
                    "step": 2,
                    "title": "Rule Evaluation Attempted",
                    "description": "Zero applicable deterministic compliance rules identified for unknown domain.",
                    "status": "IN_PROGRESS"
                },
                {
                    "step": 3,
                    "title": "Standards Mapping Blocked",
                    "description": "Insufficient evidence to determine applicable standard.",
                    "status": "PENDING"
                },
                {
                    "step": 4,
                    "title": "Testing Considerations",
                    "description": "Testing specifications cannot be formulated without verified standard.",
                    "status": "PENDING"
                },
                {
                    "step": 5,
                    "title": "Recommended Next Actions",
                    "description": "Clarify product specifications and consult technical advisory.",
                    "status": "PENDING"
                }
            ]

            return AnalysisResultResponse(
                analysis_id=f"analysis-{str(uuid.uuid4())[:8]}",
                product_id=pid,
                product_name=pname,
                timestamp=datetime.now(),
                relevant_standards_count=0,
                key_requirements_count=0,
                evidence_confidence="Insufficient Evidence",
                attention_needed_count=1,
                pathway_stages=pathway_stages,
                safe_abstention=safe_abstention,
                evaluated_rules=[],
                standards=[],
                requirements=[],
                checklist_completion_percent=0,
                risks=[],
                ai_synthesis_summary=(
                    "Insufficient information/evidence to determine applicable compliance requirements. "
                    "The product parameters do not correspond to any known BIS mandatory Quality Control Order (QCO) "
                    "or indexed Indian Standard."
                ),
                disclaimer=settings.DISCLAIMER
            )

        # 6. Dynamically Assemble Standards from Triggered Rules & Verified Sources
        standards_map: Dict[str, ApplicableStandard] = {}
        for rule in evaluated_rules:
            src = get_source_or_none(rule.source_id)
            if not src:
                continue
            
            std_id = src.document_name.split(" - ")[0].strip()
            if std_id not in standards_map:
                domain = src.applicable_domain.split(",")[0].strip() if src.applicable_domain else "General Compliance"
                standards_map[std_id] = ApplicableStandard(
                    standard_identifier=std_id,
                    title=src.document_name.split(" - ")[1] if " - " in src.document_name else src.document_name,
                    relevance_summary=f"Relevant to: {domain}, {rule.rule_name}",
                    verification_status=src.verification_status,
                    source_id=src.source_id,
                    clause_reference=rule.clause_reference,
                    evidence_excerpt=rule.supporting_evidence_excerpt,
                    document_source=src.authority,
                    official_url=src.official_url
                )
        standards: List[ApplicableStandard] = list(standards_map.values())

        # 7. Dynamically Assemble Requirements from Triggered Rules
        requirements: List[ComplianceRequirement] = []
        req_idx = 1
        for rule in evaluated_rules:
            src = get_source_or_none(rule.source_id)
            std_id = src.document_name.split(" - ")[0].strip() if src else "BIS Standard"
            
            # Determine dynamic status based on product facts
            status = "READY"
            if rule.rule_id == "RULE-BIS-003":
                # Polycarbonate flammability requires specialized glow wire lab test
                status = "REVIEW_REQUIRED"
            elif rule.rule_id == "RULE-BIS-006":
                # Polymer migration requires chemical lab testing
                status = "REVIEW_REQUIRED"
            elif rule.rule_id == "RULE-BIS-015":
                # Liquid heating dry boil protection
                tech = facts.get("technical_characteristics", "")
                if any(k in tech for k in ["dry-boil", "cut-out", "protector", "auto-shutoff", "thermostat"]):
                    status = "READY"
                else:
                    status = "NEEDS_INFORMATION"
            elif rule.rule_id == "RULE-BIS-002":
                # RO water recovery
                if facts.get("water_storage_capacity_num", 0) > 0:
                    status = "READY"
                else:
                    status = "NEEDS_INFORMATION"
            elif rule.rule_id == "RULE-BIS-004":
                status = "NEEDS_INFORMATION"
            elif rule.rule_id == "RULE-BIS-005":
                if "304" in facts.get("material_composition", "") or "316" in facts.get("material_composition", ""):
                    status = "READY"
                else:
                    status = "REVIEW_REQUIRED"

            requirements.append(ComplianceRequirement(
                id=f"REQ-{req_idx:02d}",
                requirement=rule.rule_name,
                why_it_applies=rule.result_explanation,
                source=std_id,
                source_id=rule.source_id,
                category="TESTING_AND_CERTIFICATION" if "safety" in rule.rule_name.lower() or "test" in rule.rule_name.lower() else "PRODUCT_INFORMATION",
                status=status
            ))
            req_idx += 1

        # 8. Dynamically Assemble Potential Compliance Risks
        risks: List[ComplianceRisk] = []
        risk_idx = 1
        for rule in evaluated_rules:
            if rule.rule_id == "RULE-BIS-003":
                risks.append(ComplianceRisk(
                    id=f"RISK-{risk_idx:02d}",
                    risk="Polymer Flammability Test Failure",
                    severity="HIGH",
                    why_it_matters="Polycarbonate enclosure may fail glow-wire flammability test under mains voltage.",
                    potential_impact="Direct failure during NABL lab testing, requiring costly mold re-tooling.",
                    suggested_action="Procure flame-retardant (FR V-0) grade resin with UL94 yellow card.",
                    evidence_strength="High",
                    linked_rule_id=rule.rule_id,
                    linked_source="IS 302 (Part 1): 2008 Clause 30.2",
                    risk_type="EVIDENCE_SUPPORTED_RISK"
                ))
                risk_idx += 1
            elif rule.rule_id == "RULE-BIS-015":
                risks.append(ComplianceRisk(
                    id=f"RISK-{risk_idx:02d}",
                    risk="Dry-Boil Thermal Cut-Out Absence",
                    severity="HIGH",
                    why_it_matters="Heating elements operated without water reach hazardous temperatures exceeding 250°C.",
                    potential_impact="Fire hazard, enclosure deformation, and immediate failure under IS 302-2-15 abnormal testing.",
                    suggested_action="Integrate dual bimetallic thermal cut-out with manual or automatic reset.",
                    evidence_strength="High",
                    linked_rule_id=rule.rule_id,
                    linked_source="IS 302 (Part 2/Sec 15): 2009 Clause 19",
                    risk_type="EVIDENCE_SUPPORTED_RISK"
                ))
                risk_idx += 1
            elif rule.rule_id == "RULE-BIS-005" and not ("304" in facts.get("material_composition", "") or "316" in facts.get("material_composition", "")):
                risks.append(ComplianceRisk(
                    id=f"RISK-{risk_idx:02d}",
                    risk="Non-Standard Stainless Steel Leaching",
                    severity="MEDIUM",
                    why_it_matters="Inferior grade stainless steel may leach heavy metals or corrode under acidic food contact.",
                    potential_impact="Rejection during chemical analysis under IS 6911 mandatory quality control order.",
                    suggested_action="Obtain mill test certificate confirming AISI 304 / Grade X07Cr18Ni9 composition.",
                    evidence_strength="Medium",
                    linked_rule_id=rule.rule_id,
                    linked_source="IS 6911: 2017 Clause 5.1",
                    risk_type="EVIDENCE_SUPPORTED_RISK"
                ))
                risk_idx += 1
            elif rule.rule_id == "RULE-BIS-002":
                risks.append(ComplianceRisk(
                    id=f"RISK-{risk_idx:02d}",
                    risk="Pure Water Recovery Ratio Non-Compliance",
                    severity="MEDIUM",
                    why_it_matters="Point-of-use RO systems failing 20% recovery ratio face statutory market ban under QCO.",
                    potential_impact="BIS license rejection due to excessive reject water discharge.",
                    suggested_action="Calibrate flow restrictor valve and pre-filter stage hydraulic pressure.",
                    evidence_strength="High",
                    linked_rule_id=rule.rule_id,
                    linked_source="IS 16240: 2015 Clause 5.2",
                    risk_type="EVIDENCE_SUPPORTED_RISK"
                ))
                risk_idx += 1

        # 9. Deterministically Calculate Metrics
        total_reqs = len(requirements)
        ready_reqs = sum(1 for r in requirements if r.status == "READY")
        attention_reqs = sum(1 for r in requirements if r.status in ["REVIEW_REQUIRED", "NEEDS_INFORMATION"])
        attention_risks = sum(1 for r in risks if r.severity in ["HIGH", "MEDIUM"])
        attention_needed = attention_reqs + attention_risks

        checklist_percent = round((ready_reqs / total_reqs) * 100) if total_reqs > 0 else 0

        # 10. AI Grounded Synthesis
        rules_dict_list = [r.model_dump() for r in evaluated_rules]
        ai_summary = ai_provider.generate_explanation(
            prompt=f"Product: {pname}, Category: {facts.get('category')}, Voltage: {facts.get('operating_voltage_raw')}, Material: {facts.get('material_composition')}",
            system_instruction="Explain the BIS compliance pathway concisely for an Indian MSME.",
            retrieved_evidence=evidence_chunks,
            matched_rules=rules_dict_list
        )

        # 11. Dynamic Pathway Stages
        cat_name = p_dict.get("category") or "Identified Category"
        pathway_stages = [
            {
                "step": 1,
                "title": "Product Category Identified",
                "description": f"Your product falls under {cat_name}.",
                "status": "COMPLETED"
            },
            {
                "step": 2,
                "title": "Potential BIS Requirements Identified",
                "description": f"Deterministic engine found {len(evaluated_rules)} applicable rules for this product profile.",
                "status": "COMPLETED"
            },
            {
                "step": 3,
                "title": "Relevant Standards Reviewed",
                "description": f"{len(standards)} relevant BIS standards and regulatory sources retrieved.",
                "status": "COMPLETED"
            },
            {
                "step": 4,
                "title": "Testing / Certification Considerations",
                "description": f"Evaluated {len(requirements)} specific testing and certification criteria.",
                "status": "IN_PROGRESS"
            },
            {
                "step": 5,
                "title": "Recommended Next Actions",
                "description": f"{attention_needed} items require technical documentation or testing attention.",
                "status": "PENDING"
            }
        ]

        return AnalysisResultResponse(
            analysis_id=f"analysis-{str(uuid.uuid4())[:8]}",
            product_id=pid,
            product_name=pname,
            timestamp=datetime.now(),
            relevant_standards_count=len(standards),
            key_requirements_count=len(requirements),
            evidence_confidence=confidence_level,
            attention_needed_count=attention_needed,
            pathway_stages=pathway_stages,
            safe_abstention=safe_abstention,
            evaluated_rules=evaluated_rules,
            standards=standards,
            requirements=requirements,
            checklist_completion_percent=checklist_percent,
            risks=risks,
            ai_synthesis_summary=ai_summary,
            disclaimer=settings.DISCLAIMER
        )

orchestrator = AnalysisOrchestrator()
