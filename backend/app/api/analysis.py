import json
from fastapi import APIRouter, HTTPException
from typing import Optional, Dict, Any
from psycopg2.extras import RealDictCursor
from app.core.database import get_connection
from app.schemas.models import AnalysisResultResponse, ProductCreate
from app.repositories.product_repo import product_repo
from app.services.analysis_service import orchestrator

router = APIRouter(prefix="/api/analyze", tags=["Analysis Orchestrator"])

def _save_analysis_result(result: AnalysisResultResponse, product_id: Optional[str] = None) -> None:
    result_dict = result.model_dump() if hasattr(result, "model_dump") else result.dict()
    # Serialize datetimes to ISO strings for JSON storage
    result_json = json.dumps(result_dict, default=str)
    
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO analysis_results (
                    id, product_id, evidence_confidence, safe_abstention_activated,
                    abstention_reason, summary, result_data, created_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT (id) DO UPDATE SET
                    evidence_confidence = EXCLUDED.evidence_confidence,
                    safe_abstention_activated = EXCLUDED.safe_abstention_activated,
                    abstention_reason = EXCLUDED.abstention_reason,
                    summary = EXCLUDED.summary,
                    result_data = EXCLUDED.result_data
            """, (
                result.analysis_id,
                product_id,
                result.evidence_confidence,
                result.safe_abstention.activated,
                result.safe_abstention.abstention_reason,
                result.ai_synthesis_summary,
                result_json
            ))

def _get_analysis_result_from_db(identifier: str) -> Optional[AnalysisResultResponse]:
    with get_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT result_data FROM analysis_results
                WHERE id = %s OR product_id = %s
                ORDER BY created_at DESC
                LIMIT 1
            """, (identifier, identifier))
            row = cur.fetchone()
            if row and row.get("result_data"):
                raw_data = row["result_data"]
                if isinstance(raw_data, str):
                    data = json.loads(raw_data)
                else:
                    data = raw_data
                return AnalysisResultResponse(**data)
    return None

@router.post("/{product_id}", response_model=AnalysisResultResponse)
def analyze_product_by_id(product_id: str):
    """
    Main orchestrator endpoint requested by user:
    PRODUCT INPUT -> Validate Product Facts -> Missing Critical Facts Check (Safe Abstention Trigger)
    -> Run Deterministic Rules -> Retrieve Evidence -> Verify Evidence -> Gemini Explanation
    -> Compliance Result.
    """
    product = product_repo.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found")

    result = orchestrator.analyze(product, product_id=product.id)
    _save_analysis_result(result, product_id=product.id)
    return result

@router.post("", response_model=AnalysisResultResponse)
def analyze_product_direct(product_data: ProductCreate):
    """
    Direct analysis on ad-hoc product payload without saving first.
    """
    result = orchestrator.analyze(product_data)
    _save_analysis_result(result, product_id=None)
    return result

@router.get("/result/{identifier}", response_model=AnalysisResultResponse)
def get_analysis_result(identifier: str):
    res = _get_analysis_result_from_db(identifier)
    if res:
        return res

    # If identifier is an existing product, run dynamic analysis on its actual parameters
    product = product_repo.get(identifier)
    if product:
        res = orchestrator.analyze(product, product_id=product.id)
        _save_analysis_result(res, product_id=product.id)
        return res

    # Preserve fallback to analyzing demo product ONLY for explicit demo identifiers
    # As required: Do not return demo analysis for arbitrary invalid/nonexistent IDs
    if identifier in ("demo-purifier-001", "demo-analysis-001"):
        demo = product_repo.get("demo-purifier-001")
        if demo:
            res = orchestrator.analyze(demo, product_id=demo.id)
            _save_analysis_result(res, product_id=demo.id)
            return res

    raise HTTPException(status_code=404, detail=f"Analysis result '{identifier}' not found")
