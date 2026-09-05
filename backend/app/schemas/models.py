from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

# --- Source Registry ---
class SourceRegistryItem(BaseModel):
    source_id: str
    authority: str
    document_name: str
    document_type: str
    official_url: Optional[str] = None
    applicable_domain: str
    version: Optional[str] = None
    effective_date: Optional[str] = None
    verification_status: str  # "VERIFIED_OFFICIAL", "NEEDS_REVIEW", "POTENTIALLY_APPLICABLE"

# --- Evidence Chunk ---
class EvidenceChunkSchema(BaseModel):
    id: str
    source_id: str
    title: str
    authority: str
    document_type: str
    clause_number: str
    chunk_text: str
    publication_date: Optional[str] = None
    effective_date: Optional[str] = None
    version: Optional[str] = None
    verification_status: str
    source_url: Optional[str] = None
    relevance_score: Optional[float] = None

# --- Product Facts & Provenance ---
class ProductFact(BaseModel):
    key: str
    label: str
    value: str
    origin: str  # "USER_PROVIDED", "EXTRACTED_FROM_DOCUMENT", "INFERRED"
    is_confirmed: bool = True
    needs_review: bool = False

class ProductCreate(BaseModel):
    project_name: Optional[str] = "Smart Purifier Compliance Project"
    product_name: str
    category: str
    intended_use: str
    material_composition: Optional[str] = None
    technical_characteristics: Optional[str] = None
    operating_voltage: Optional[str] = None
    power_consumption: Optional[str] = None
    water_storage_capacity: Optional[str] = None
    has_uv_module: Optional[bool] = False
    manufacturing_origin: Optional[str] = "India"
    target_market: Optional[str] = "Domestic"

class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    category: Optional[str] = None
    intended_use: Optional[str] = None
    material_composition: Optional[str] = None
    technical_characteristics: Optional[str] = None
    operating_voltage: Optional[str] = None
    power_consumption: Optional[str] = None
    water_storage_capacity: Optional[str] = None
    has_uv_module: Optional[bool] = None
    manufacturing_origin: Optional[str] = None
    target_market: Optional[str] = None
    status: Optional[str] = None

class ProductResponse(ProductCreate):
    id: str
    status: str
    facts: List[ProductFact] = []
    created_at: datetime
    updated_at: datetime

# --- Rule Engine ---
class RuleCondition(BaseModel):
    field: str
    operator: str  # "equals", "greater_than", "contains", "in"
    value: Any

class RuleDefinition(BaseModel):
    rule_id: str
    rule_name: str
    category: str
    conditions: List[RuleCondition]
    logic_summary: str
    source_id: str
    source_clause: str
    authority: str
    verification_status: str
    output_requirement: str
    output_risk: Optional[str] = None

class RuleEvaluationResult(BaseModel):
    rule_id: str
    rule_name: str
    matched: bool
    input_facts: Dict[str, Any]
    rule_logic: str
    clause_reference: str
    source_id: str
    authority: str
    verification_status: str
    supporting_evidence_excerpt: str
    result_explanation: str
    origin_badge: str = "DETERMINISTIC_RULE"

# --- Standards & Requirements ---
class ApplicableStandard(BaseModel):
    standard_identifier: str
    title: str
    relevance_summary: str
    verification_status: str  # "VERIFIED_OFFICIAL", "NEEDS_REVIEW", "POTENTIALLY_APPLICABLE"
    source_id: str
    clause_reference: Optional[str] = None
    evidence_excerpt: Optional[str] = None
    document_source: str
    official_url: Optional[str] = None

class ComplianceRequirement(BaseModel):
    id: str
    requirement: str
    why_it_applies: str
    source: str
    source_id: str
    category: str  # "PRODUCT_INFORMATION", "TESTING_AND_CERTIFICATION", "DOCUMENTATION"
    status: str  # "READY", "NEEDS_INFORMATION", "REVIEW_REQUIRED", "POTENTIALLY_APPLICABLE"

class ComplianceRisk(BaseModel):
    id: str
    risk: str
    severity: str  # "HIGH", "MEDIUM", "POTENTIAL"
    why_it_matters: str
    potential_impact: str
    suggested_action: str
    evidence_strength: str  # "High", "Medium", "Low"
    linked_rule_id: Optional[str] = None
    linked_source: Optional[str] = None
    risk_type: str = "EVIDENCE_SUPPORTED_RISK"  # or "INFORMATION_GAP"

# --- Safe Abstention ---
class SafeAbstentionDetails(BaseModel):
    activated: bool
    product_characteristic: Optional[str] = None
    evidence_search_result: Optional[str] = None
    system_action: Optional[str] = None
    abstention_reason: Optional[str] = None
    missing_information: List[str] = []
    recommended_actions: List[Dict[str, str]] = []

# --- What-If Simulation ---
class SimulationRequest(BaseModel):
    product_id: str
    material: Optional[str] = None
    operating_voltage: Optional[str] = None
    target_market: Optional[str] = None
    intended_use: Optional[str] = None
    category: Optional[str] = None
    food_contact: Optional[bool] = None
    electrical: Optional[bool] = None

class SimulationResult(BaseModel):
    product_id: str
    changes_applied: Dict[str, Any]
    current_profile: Dict[str, Any]
    simulated_profile: Dict[str, Any]
    standards_diff: Dict[str, List[str]]  # added, retained, removed
    tests_diff: Dict[str, List[str]]
    certification_route: str
    deterministic_provenance: List[str]
    disclaimer: str

# --- Unified Orchestrator Analysis Result ---
class AnalysisResultResponse(BaseModel):
    analysis_id: str
    product_id: str
    product_name: str
    timestamp: datetime
    
    # 4 Key Metrics (Screen 4)
    relevant_standards_count: int
    key_requirements_count: int
    evidence_confidence: str  # "High", "Medium", "Insufficient Evidence"
    attention_needed_count: int
    
    # Pathway Stages (Screen 4)
    pathway_stages: List[Dict[str, Any]]
    
    # Safe Abstention
    safe_abstention: SafeAbstentionDetails
    
    # Evaluated Rules & Evidence (Screen 5 & 6)
    evaluated_rules: List[RuleEvaluationResult]
    
    # Standards (Screen 7)
    standards: List[ApplicableStandard]
    
    # Requirements Checklist (Screen 8)
    requirements: List[ComplianceRequirement]
    checklist_completion_percent: int
    
    # Potential Risks (Screen 9)
    risks: List[ComplianceRisk]
    
    # AI Grounded Synthesis Summary
    ai_synthesis_summary: str
    
    # Universal Disclaimer
    disclaimer: str
