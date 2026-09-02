from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.models import SourceRegistryItem, EvidenceChunkSchema
from app.rules.source_registry_data import list_sources, get_source_or_none
from app.rag.vector_store import vector_store

router = APIRouter(prefix="/api/sources", tags=["Source Registry & Evidence"])

@router.get("", response_model=List[SourceRegistryItem])
def get_all_sources():
    return list_sources()

@router.get("/{source_id}", response_model=SourceRegistryItem)
def get_source_details(source_id: str):
    source = get_source_or_none(source_id)
    if not source:
        raise HTTPException(status_code=404, detail=f"Source '{source_id}' not found in registry")
    return source

@router.get("/evidence/search")
def search_evidence(q: str = Query(..., description="Technical search query"), limit: int = 5):
    results = vector_store.search(q, top_k=limit)
    return [
        {
            **item[0],
            "relevance_score": round(item[1], 3)
        }
        for item in results
    ]
