import logging
from typing import List, Dict, Any

import httpx

from app.core.config import settings
from app.rag.provider_base import LLMProvider, EmbeddingProvider
from app.rag.mock_provider import mock_provider


logger = logging.getLogger(__name__)


class GeminiProvider(LLMProvider, EmbeddingProvider):

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.LLM_MODEL
        self.embedding_model = settings.EMBEDDING_MODEL

    def _is_configured(self) -> bool:
        return bool(
            self.api_key
            and self.api_key.strip()
            and self.api_key.strip() != "your_gemini_api_key_here"
        )

    def generate_explanation(
        self,
        prompt: str,
        system_instruction: str,
        retrieved_evidence: List[Dict[str, Any]],
        matched_rules: List[Dict[str, Any]]
    ) -> str:

        # Never ask Gemini to answer without authoritative evidence.
        if not retrieved_evidence:
            return mock_provider.generate_explanation(
                prompt,
                system_instruction,
                retrieved_evidence,
                matched_rules
            )

        if not self._is_configured():
            logger.info(
                "Gemini API key is not configured. "
                "Using evidence-only offline provider."
            )

            return mock_provider.generate_explanation(
                prompt,
                system_instruction,
                retrieved_evidence,
                matched_rules
            )

        grounding_context_parts = []

        for evidence in retrieved_evidence:
            grounding_context_parts.append(
                "\n".join([
                    f"SOURCE_ID: {evidence.get('source_id', '')}",
                    f"TITLE: {evidence.get('title', '')}",
                    f"AUTHORITY: {evidence.get('authority', '')}",
                    f"DOCUMENT_TYPE: {evidence.get('document_type', '')}",
                    f"CLAUSE: {evidence.get('clause_number', '')}",
                    f"VERIFICATION_STATUS: "
                    f"{evidence.get('verification_status', '')}",
                    f"SOURCE_URL: {evidence.get('source_url', '')}",
                    f"EVIDENCE: {evidence.get('chunk_text', '')}",
                ])
            )

        grounding_context = "\n\n---\n\n".join(
            grounding_context_parts
        )

        rules_context = "\n".join(
            str(rule)
            for rule in matched_rules
        )

        strict_system_instruction = f"""
You are NiyamVeda's regulatory information assistant.

Your job is to explain information using ONLY the authoritative evidence
provided in the context below and, when supplied, deterministic evaluation
results.

ABSOLUTE RULES:

1. Never invent an Indian Standard.
2. Never invent a clause number.
3. Never invent a BIS requirement.
4. Never invent a QCO, CRO, CRS or certification scheme.
5. Never invent laboratory names, laboratory locations or accreditation.
6. Never invent hallmarking requirements.
7. Never invent URLs.
8. Never claim that a product is officially compliant.
9. Never claim that a product is certified.
10. Never guarantee certification or registration.
11. Never infer a regulatory requirement merely because it sounds reasonable.
12. Do not treat absence of evidence as evidence that something is not required.
13. If the supplied evidence does not answer the question, explicitly say
    that sufficient information is not available in the indexed corpus.
14. Preserve uncertainty and verification status from the evidence.
15. Product-specific compliance conclusions must defer to deterministic
    evaluation results when those results are supplied.
16. Answer in the requested language.
17. Keep the answer concise and understandable for an Indian MSME.

The following is the authoritative indexed evidence:

{grounding_context}

The following are deterministic evaluation results, if available:

{rules_context}

User question:

{prompt}

{system_instruction}
"""

        url = (
            f"https://generativelanguage.googleapis.com/"
            f"v1beta/models/{self.model}:generateContent"
            f"?key={self.api_key}"
        )

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": strict_system_instruction
                        }
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 700
            }
        }

        try:
            with httpx.Client(timeout=20.0) as client:
                response = client.post(
                    url,
                    json=payload
                )

            if response.status_code != 200:
                logger.warning(
                    "Gemini returned HTTP %s. "
                    "Using evidence-only fallback.",
                    response.status_code
                )

                return mock_provider.generate_explanation(
                    prompt,
                    system_instruction,
                    retrieved_evidence,
                    matched_rules
                )

            data = response.json()

            candidates = data.get("candidates", [])

            if not candidates:
                logger.warning(
                    "Gemini returned no candidates. "
                    "Using evidence-only fallback."
                )

                return mock_provider.generate_explanation(
                    prompt,
                    system_instruction,
                    retrieved_evidence,
                    matched_rules
                )

            content = candidates[0].get("content", {})
            parts = content.get("parts", [])

            if not parts:
                logger.warning(
                    "Gemini response contained no text parts. "
                    "Using evidence-only fallback."
                )

                return mock_provider.generate_explanation(
                    prompt,
                    system_instruction,
                    retrieved_evidence,
                    matched_rules
                )

            generated_text = parts[0].get("text", "").strip()

            if not generated_text:
                return mock_provider.generate_explanation(
                    prompt,
                    system_instruction,
                    retrieved_evidence,
                    matched_rules
                )

            return generated_text

        except httpx.TimeoutException:
            logger.warning(
                "Gemini request timed out. "
                "Using evidence-only fallback."
            )

        except Exception as exc:
            logger.warning(
                "Gemini invocation failed (%s). "
                "Using evidence-only fallback.",
                type(exc).__name__
            )

        return mock_provider.generate_explanation(
            prompt,
            system_instruction,
            retrieved_evidence,
            matched_rules
        )

    def embed_text(self, text: str) -> List[float]:
        # Keep deterministic offline embeddings.
        return mock_provider.embed_text(text)

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        return [
            self.embed_text(text)
            for text in texts
        ]


ai_provider = GeminiProvider()