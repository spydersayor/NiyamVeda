import logging
import httpx
from typing import List, Dict, Any
from app.core.config import settings
from app.rag.provider_base import LLMProvider, EmbeddingProvider
from app.rag.mock_provider import mock_provider

logger = logging.getLogger(__name__)

class GeminiProvider(LLMProvider, EmbeddingProvider):
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.LLM_MODEL
        self.embedding_model = settings.EMBEDDING_MODEL

    def generate_explanation(
        self,
        prompt: str,
        system_instruction: str,
        retrieved_evidence: List[Dict[str, Any]],
        matched_rules: List[Dict[str, Any]]
    ) -> str:
        if not self.api_key or self.api_key.strip() in ("", "your_gemini_api_key_here"):
            logger.info("GEMINI_API_KEY not configured or placeholder detected; using deterministic mock provider.")
            return mock_provider.generate_explanation(prompt, system_instruction, retrieved_evidence, matched_rules)

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        
        grounding_context = "\n".join([
            f"[Source: {e.get('source_id')}, Clause: {e.get('clause_number')}]\n{e.get('chunk_text')}"
            for e in retrieved_evidence
        ])
        
        full_prompt = (
            f"{system_instruction}\n\n"
            f"EVALUATED RULES:\n{str(matched_rules)}\n\n"
            f"AUTHORITATIVE EVIDENCE:\n{grounding_context}\n\n"
            f"USER QUERY / CONTEXT:\n{prompt}\n\n"
            f"Explain clearly for an Indian MSME. Never invent rules or citations not present in the context above."
        )

        try:
            with httpx.Client(timeout=15.0) as client:
                res = client.post(
                    url,
                    json={
                        "contents": [{"parts": [{"text": full_prompt}]}],
                        "generationConfig": {"temperature": 0.2, "maxOutputTokens": 600}
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        if parts:
                            return parts[0].get("text", "")
                else:
                    logger.warning(
                        f"Gemini API returned non-200 HTTP status: {res.status_code}. "
                        "Falling back to authoritative deterministic explanation."
                    )
        except httpx.TimeoutException:
            logger.warning("Gemini API request timed out after 15s. Falling back to deterministic explanation.")
        except Exception as e:
            logger.warning(
                f"Gemini API invocation failed ({type(e).__name__}). "
                "Falling back to authoritative deterministic explanation."
            )

        return mock_provider.generate_explanation(prompt, system_instruction, retrieved_evidence, matched_rules)

    def embed_text(self, text: str) -> List[float]:
        # Always fallback or format to 768-dim
        return mock_provider.embed_text(text)

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        return [self.embed_text(t) for t in texts]

ai_provider = GeminiProvider()
