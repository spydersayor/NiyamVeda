from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class CitationItem(BaseModel):
    source_id: str
    title: str
    clause: str
    authority: str
    verification_status: str
    official_url: Optional[str] = None

class AssistantChatRequest(BaseModel):
    message: str
    product_id: Optional[str] = None
    language: Optional[str] = "en"  # "en", "hi", "bn"
    history: Optional[List[Dict[str, str]]] = []

class AssistantChatResponse(BaseModel):
    response: str
    suggested_queries: List[str]
    citations: List[CitationItem]
    safe_abstention: bool = False
    abstention_reason: Optional[str] = None
    grounded_in_corpus: bool = True
    disclaimer: str
