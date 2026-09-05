from typing import List, Dict, Any
from app.rag.provider_base import LLMProvider, EmbeddingProvider
from app.rag.vector_store import compute_deterministic_embedding


class MockDomainProvider(LLMProvider, EmbeddingProvider):
    """
    Offline, evidence-only provider.

    IMPORTANT:
    This provider must never invent standards, clauses, certification
    schemes, laboratory information, regulatory requirements, or metrics.

    If authoritative evidence is available, it summarizes ONLY that evidence.
    If evidence is unavailable, it explicitly abstains.
    """

    def generate_explanation(
        self,
        prompt: str,
        system_instruction: str,
        retrieved_evidence: List[Dict[str, Any]],
        matched_rules: List[Dict[str, Any]]
    ) -> str:

        if not retrieved_evidence:
            return (
                "I could not find sufficient authoritative information in "
                "NiyamVeda's indexed knowledge corpus to answer this question "
                "reliably. I will not guess or invent a regulatory requirement."
            )

        # Only use evidence that actually exists in the corpus.
        verified_evidence = [
            e for e in retrieved_evidence
            if e.get("chunk_text")
        ]

        if not verified_evidence:
            return (
                "I could not find sufficient authoritative information in "
                "NiyamVeda's indexed knowledge corpus to answer this question "
                "reliably. I will not guess or invent a regulatory requirement."
            )

        lines = [
            "Based only on the authoritative information currently indexed "
            "in NiyamVeda:"
        ]

        for index, evidence in enumerate(verified_evidence[:4], start=1):
            title = evidence.get("title", "Indian Standard")
            clause = evidence.get("clause_number", "")
            text = evidence.get("chunk_text", "").strip()

            source_id = evidence.get("source_id", "")
            verification_status = evidence.get(
                "verification_status",
                "UNKNOWN"
            )

            lines.append(
                f"\n{index}. {title}"
                f"{f' — {clause}' if clause else ''}\n"
                f"{text}\n"
                f"Source ID: {source_id}\n"
                f"Verification status: {verification_status}"
            )

        if matched_rules:
            rule_ids = [
                str(rule.get("rule_id"))
                for rule in matched_rules
                if rule.get("rule_id")
            ]

            if rule_ids:
                lines.append(
                    "\nDeterministic evaluation context: "
                    + ", ".join(rule_ids)
                )

        lines.append(
            "\nThis offline response is limited to the indexed evidence. "
            "No unsupported regulatory conclusion has been added."
        )

        return "\n".join(lines)

    def embed_text(self, text: str) -> List[float]:
        return compute_deterministic_embedding(text, 768)

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        return [self.embed_text(t) for t in texts]


mock_provider = MockDomainProvider()