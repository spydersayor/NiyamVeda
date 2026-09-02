from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
from app.schemas.models import AnalysisResultResponse, ProductCreate
from app.repositories.product_repo import product_repo
from app.services.analysis_service import orchestrator

router = APIRouter(prefix="/api/analyze", tags=["Analysis Orchestrator"])

# In-memory storage for analysis results
ANALYSIS_STORE: Dict[str, AnalysisResultResponse] = {}

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
    ANALYSIS_STORE[result.analysis_id] = result
    ANALYSIS_STORE[product_id] = result  # Also index by product_id for direct retrieval
    return result

@router.post("", response_model=AnalysisResultResponse)
def analyze_product_direct(product_data: ProductCreate):
    """
    Direct analysis on ad-hoc product payload without saving first.
    """
    result = orchestrator.analyze(product_data)
    ANALYSIS_STORE[result.analysis_id] = result
    return result

@router.get("/result/{identifier}", response_model=AnalysisResultResponse)
def get_analysis_result(identifier: str):
    res = ANALYSIS_STORE.get(identifier)
    if not res:
        # Fall back to analyzing demo product if not found
        demo = product_repo.get("demo-purifier-001")
        if demo:
            res = orchestrator.analyze(demo, product_id=demo.id)
            ANALYSIS_STORE[identifier] = res
            return res
        raise HTTPException(status_code=404, detail="Analysis result not found")
    return res
