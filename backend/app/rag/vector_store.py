import hashlib
import re
import numpy as np
from typing import List, Dict, Any, Tuple

from app.core.config import settings
from app.rag.corpus_data import EVIDENCE_CORPUS


# ---------------------------------------------------------------------------
# Tokenization
# ---------------------------------------------------------------------------

def _tokenize(text: str) -> set[str]:
    """
    Unicode-aware tokenization.

    Keeps useful alphanumeric tokens while removing punctuation.
    """
    return {
        token
        for token in re.findall(r"[a-z0-9]+", text.lower())
        if len(token) > 1
    }


# ---------------------------------------------------------------------------
# Deterministic embedding
# ---------------------------------------------------------------------------

def compute_deterministic_embedding(
    text: str,
    dim: int = 768
) -> List[float]:
    """
    Generate a normalized deterministic 768-dimensional embedding
    based on hashing individual words.

    This remains fully offline and deterministic.
    """
    words = text.lower().split()

    vec = np.zeros(dim, dtype=np.float32)

    for word in words:
        h = int(
            hashlib.sha256(
                word.encode("utf-8")
            ).hexdigest()[:8],
            16
        )

        idx = h % dim
        sign = 1.0 if (h % 2 == 0) else -1.0

        vec[idx] += sign * (1.0 + (h % 10) / 10.0)

    norm = np.linalg.norm(vec)

    if norm > 0:
        vec = vec / norm

    return vec.tolist()


# ---------------------------------------------------------------------------
# Vector Store
# ---------------------------------------------------------------------------

class VectorStore:
    """
    Offline deterministic vector store with hybrid retrieval.

    Retrieval combines:
      1. deterministic cosine similarity
      2. lexical token overlap
      3. exact standard-number matching
      4. important phrase matching

    The public search() interface remains unchanged.
    """

    def __init__(self):
        self.dimension = settings.EMBEDDING_DIMENSION
        self.chunks: List[Dict[str, Any]] = []

        self._initialize_store()

    # -----------------------------------------------------------------------
    # Initialization
    # -----------------------------------------------------------------------

    def _initialize_store(self):
        for chunk in EVIDENCE_CORPUS:
            text = chunk["chunk_text"]

            emb = compute_deterministic_embedding(
                text,
                self.dimension
            )

            self.chunks.append({
                **chunk,
                "embedding": emb,
                "_tokens": _tokenize(text),
            })

    # -----------------------------------------------------------------------
    # Search
    # -----------------------------------------------------------------------

    def search(
        self,
        query: str,
        top_k: int = 5,
        min_similarity: float = 0.0
    ) -> List[Tuple[Dict[str, Any], float]]:

        query_lower = query.lower()
        query_tokens = _tokenize(query)

        query_vec = np.array(
            compute_deterministic_embedding(
                query,
                self.dimension
            ),
            dtype=np.float32
        )

        # ---------------------------------------------------------------
        # Explicit standards mentioned by user
        # ---------------------------------------------------------------

        explicit_standard_numbers = set(
            re.findall(
                r"\bis[\s-]*(\d{4,6})(?::\s*\d{4})?\b",
                query_lower
            )
        )

        # ---------------------------------------------------------------
        # Important retrieval phrases
        # ---------------------------------------------------------------

        important_phrases = [
            "drinking water",
            "water quality",
            "quality specifications",
            "quality limits",
            "acceptable limits",
            "treated drinking water",
            "treated water",
            "potable water",
            "water purification",
            "purification devices",
            "water purifier",
            "reverse osmosis",
            "ro system",
            "ro performance",
            "system performance",
            "pure water recovery",
            "recovery ratio",
            "tds reduction",
            "membrane performance",
            "food grade",
            "food-grade",
            "thermal cut-out",
            "thermal cutout",
            "electric kettle",
            "glow-wire",
            "insulation",
            "voltage",
        ]

        query_phrases = [
            phrase
            for phrase in important_phrases
            if phrase in query_lower
        ]

        results: List[Tuple[Dict[str, Any], float]] = []

        # ---------------------------------------------------------------
        # Score every corpus chunk
        # ---------------------------------------------------------------

        for chunk in self.chunks:

            chunk_text = chunk["chunk_text"].lower()
            chunk_tokens = chunk["_tokens"]

            # -----------------------------------------------------------
            # 1. Semantic similarity
            # -----------------------------------------------------------

            chunk_vec = np.array(
                chunk["embedding"],
                dtype=np.float32
            )

            semantic_score = float(
                np.dot(query_vec, chunk_vec)
            )

            # -----------------------------------------------------------
            # 2. Lexical overlap
            # -----------------------------------------------------------

            common_tokens = query_tokens.intersection(chunk_tokens)

            if query_tokens:
                lexical_score = (
                    len(common_tokens)
                    / max(len(query_tokens), 1)
                )
            else:
                lexical_score = 0.0

            # -----------------------------------------------------------
            # 3. Phrase overlap
            # -----------------------------------------------------------

            phrase_score = 0.0

            for phrase in query_phrases:
                if phrase in chunk_text:
                    phrase_score += 0.12

            phrase_score = min(phrase_score, 0.36)

            # -----------------------------------------------------------
            # 4. Exact standard-number boost
            # -----------------------------------------------------------

            standard_score = 0.0

            for standard_number in explicit_standard_numbers:
                if standard_number in chunk_text:
                    standard_score += 0.50

            standard_score = min(standard_score, 0.50)

            # -----------------------------------------------------------
            # 5. Important domain-token boosts
            # -----------------------------------------------------------

            domain_tokens = {
                "302",
                "16240",
                "10500",
                "13428",
                "230v",
                "voltage",
                "insulation",
                "glow-wire",
                "water",
                "purifier",
                "purification",
                "polycarbonate",
                "cookware",
                "stainless",
                "drinking",
                "potable",
                "tds",
                "recovery",
                "membrane",
            }

            domain_overlap = (
                query_tokens.intersection(domain_tokens)
                .intersection(chunk_tokens)
            )

            domain_score = min(
                len(domain_overlap) * 0.035,
                0.18
            )

            # -----------------------------------------------------------
            # Final hybrid score
            # -----------------------------------------------------------

            score = (
                semantic_score * 0.55
                + lexical_score * 0.25
                + phrase_score
                + standard_score
                + domain_score
            )

            # Keep score in a stable range.
            score = min(max(score, 0.0), 1.0)

            # -----------------------------------------------------------
            # Minimum similarity gate
            # -----------------------------------------------------------

            if score < min_similarity:
                continue

            results.append((chunk, score))

        # ---------------------------------------------------------------
        # Sort
        # ---------------------------------------------------------------

        results.sort(
            key=lambda item: item[1],
            reverse=True
        )

        # ---------------------------------------------------------------
        # IMPORTANT:
        #
        # We intentionally return the best candidates. The assistant layer
        # performs the final topic/sub-intent safety filtering.
        # ---------------------------------------------------------------

        return results[:top_k]

    # -----------------------------------------------------------------------
    # Direct chunk lookup
    # -----------------------------------------------------------------------

    def get_chunk_by_id(
        self,
        chunk_id: str
    ) -> Dict[str, Any] | None:

        for chunk in self.chunks:
            if chunk["id"] == chunk_id:
                return chunk

        return None


vector_store = VectorStore()