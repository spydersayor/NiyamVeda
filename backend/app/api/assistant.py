import logging
import re
from typing import List, Dict, Any, Tuple

from fastapi import APIRouter

from app.schemas.assistant import (
    AssistantChatRequest,
    AssistantChatResponse,
    CitationItem,
)

from app.rag.vector_store import vector_store
from app.rag.gemini_provider import ai_provider
from app.repositories.product_repo import product_repo
from app.services.analysis_service import orchestrator


logger = logging.getLogger(__name__)


router = APIRouter(
    prefix="/api/assistant",
    tags=["Conversational Regulatory Assistant"],
)


DISCLAIMER = (
    "NiyamVeda provides source-grounded regulatory information based on "
    "its indexed knowledge corpus and deterministic analysis. It does not "
    "constitute official BIS certification, legal advice, or a guarantee "
    "of conformity. Final regulatory decisions should be verified with "
    "the relevant authoritative authority."
)


SUPPORTED_LANGUAGES = {"en", "hi", "bn"}


# ---------------------------------------------------------------------------
# Basic helpers
# ---------------------------------------------------------------------------

def _normalise_language(language: str | None) -> str:
    if not language:
        return "en"

    language = language.strip().lower()

    if language in SUPPORTED_LANGUAGES:
        return language

    return "en"


def _normalise_message(message: str) -> str:
    return re.sub(
        r"\s+",
        " ",
        message.strip(),
    )


def _tokenise(text: str) -> set[str]:
    """
    Tokenise both Latin and Unicode text.

    The previous implementation only used [a-zA-Z0-9], which meant that
    Hindi/Bengali queries could not participate meaningfully in overlap
    checks.
    """
    return set(
        re.findall(
            r"[^\W_]+",
            text.lower(),
            flags=re.UNICODE,
        )
    )


# ---------------------------------------------------------------------------
# Retrieval relevance
# ---------------------------------------------------------------------------

# Topic-specific retrieval anchors. These are retrieval filters only; they do
# not assert that a standard/certification scheme applies to a product.
_RETRIEVAL_TOPIC_ANCHORS: Dict[str, Tuple[str, ...]] = {
    "crs": (
        "crs",
        "cro",
        "compulsory registration scheme",
        "registration scheme",
        "meity",
    ),
    "isi": (
        "isi mark",
        "isi marking",
        "standard mark",
    ),
    "kettle": (
        "electric kettle",
        "kettle",
        "water boiler",
        "heating liquids",
        "dry boil",
        "thermal cut-out",
        "thermal cutout",
    ),
    "ro": (
        "reverse osmosis",
        "ro purifier",
        "ro system",
        "water purifier",
        "water purification",
        "water treatment",
    ),
    "cookware": (
        "cookware",
        "cooking utensil",
        "cooking utensils",
        "stainless steel",
        "food contact",
        "food-grade",
        "food grade",
    ),
    "drinking_water": (
        "drinking water",
        "water quality",
        "potable water",
    ),
}


def _remove_explicit_exclusions(text: str) -> str:
    """
    Remove explicitly excluded topics from positive retrieval-intent detection.

    This handles forms such as:
      - do not discuss X
      - don't discuss X
      - not asking about X
      - I am NOT asking about X
      - not interested in X
      - exclude X
      - excluding X
      - avoid X

    The excluded text is removed only for *positive* intent detection. A
    separate helper below records the excluded sub-intents so they can be
    hard-rejected during evidence filtering.
    """
    patterns = (
        r"\b(?:i\s+am\s+)?not\s+asking\s+about\b[^.!?]*[.!?]?",
        r"\b(?:i\s+am\s+)?not\s+interested\s+in\b[^.!?]*[.!?]?",
        r"\b(?:do\s+not|don't|do\s+not\s+want\s+to|please\s+do\s+not|please\s+don't)\s+"
        r"(?:discuss|include|cover|talk\s+about|explain)\b[^.!?]*[.!?]?",
        r"\b(?:exclude|excluding|avoid)\b[^.!?]*[.!?]?",
    )
    cleaned = text
    for pattern in patterns:
        cleaned = re.sub(pattern, " ", cleaned, flags=re.IGNORECASE)
    return cleaned


def _detect_retrieval_topics(text: str) -> set[str]:
    """
    Detect narrow retrieval topics from user/product text.

    This is deliberately conservative. It is used to reject unrelated
    retrieved chunks, not to determine legal/regulatory applicability.

    Hindi/Bengali topic aliases are retrieval signals only. They do not
    introduce or assert any regulatory fact.
    """
    text = _remove_explicit_exclusions(text)
    text_lower = text.lower()
    topics: set[str] = set()

    for topic, anchors in _RETRIEVAL_TOPIC_ANCHORS.items():
        if any(anchor in text_lower for anchor in anchors):
            topics.add(topic)

    multilingual_topic_aliases = {
        "kettle": (
            "इलेक्ट्रिक",
            "केतली",
            "बिजली",
            "उपकरण",
            "किटली",
            "ইলেকট্রিক",
            "কেটলি",
            "বিদ্যুৎ",
        ),
        "ro": (
            "पानी",
            "जल",
            "प्यूरीफायर",
            "प्यूरिफायर",
            "आरओ",
            "रिवर्स ऑस्मोसिस",
            "পানি",
            "জল",
            "পিউরিফায়ার",
            "পিউরিফায়ার",
            "আরও",
            "রিভার্স অসমোসিস",
        ),
        "cookware": (
            "कुकवेयर",
            "बर्तन",
            "स्टील",
            "स्टेनलेस",
            "खाना",
            "खाद्य",
            "কুকওয়্যার",
            "কুকওয়্যার",
            "স্টিল",
            "স্টেইনলেস",
            "রান্না",
            "খাদ্য",
        ),
    }

    for topic, aliases in multilingual_topic_aliases.items():
        if any(alias in text for alias in aliases):
            topics.add(topic)

    # Explicit standard identifiers are also useful retrieval constraints.
    if re.search(r"\bis[\s\-]*302\b", text_lower):
        topics.add("kettle")

    if re.search(r"\bis[\s\-]*16240\b", text_lower):
        topics.add("ro")

    if re.search(r"\bis[\s\-]*10500\b", text_lower):
        topics.add("drinking_water")

    if re.search(r"\bis[\s\-]*(6911|14756)\b", text_lower):
        topics.add("cookware")

    return topics


def _detect_primary_product_topics(
    text: str,
    product_context: str = "",
) -> set[str]:
    """
    Detect the actual product(s) the user is asking about.

    This is intentionally stricter than _detect_retrieval_topics().  Words such
    as "plastic", "stainless steel", "water", or "food contact" are product
    attributes and must not become independent product intents.

    The result is used as a retrieval gate only; it does not establish legal or
    regulatory applicability.
    """
    combined = _remove_explicit_exclusions(
        f"{text} {product_context}"
    ).lower()
    scores: Dict[str, int] = {}

    # Strong product identifiers.  Attribute-only terms are deliberately absent.
    product_anchors: Dict[str, Tuple[Tuple[str, int], ...]] = {
        "kettle": (
            ("electric kettle", 12),
            ("water boiler", 10),
            ("kettle", 9),
            ("heating liquids", 8),
            ("इलेक्ट्रिक केतली", 12),
            ("केतली", 9),
            ("किटली", 9),
            ("ইলেকট্রিক কেটলি", 12),
            ("কেটলি", 9),
        ),
        "ro": (
            ("reverse osmosis", 12),
            ("ro purifier", 11),
            ("ro system", 11),
            ("water purifier", 10),
            ("water purification", 8),
            ("ro", 5),
            ("आरओ", 12),
            ("रिवर्स ऑस्मोसिस", 12),
            ("प्यूरीफायर", 9),
            ("प्यूरिफायर", 9),
            ("रिवर्स ओस्मोसिस", 12),
            ("রিভার্স অসমোসিস", 12),
            ("পিউরিফায়ার", 9),
            ("পিউরিফায়ার", 9),
        ),
        "cookware": (
            ("cookware", 12),
            ("cooking utensil", 11),
            ("cooking utensils", 11),
            ("কুকওয়্যার", 12),
            ("কুকওয়্যার", 12),
            ("कुकवेयर", 12),
            ("बर्तन", 10),
        ),
    }

    for topic, anchors in product_anchors.items():
        for anchor, weight in anchors:
            if anchor in combined:
                scores[topic] = scores.get(topic, 0) + weight

    if not scores:
        return set()

    max_score = max(scores.values())
    # Preserve explicitly multi-product questions (e.g. kettle vs RO), while
    # preventing weak attribute mentions from competing with a clear product.
    return {
        topic
        for topic, score in scores.items()
        if score >= max_score * 0.70
    }


def _chunk_matches_product_topic(
    searchable_lower: str,
    topic: str,
) -> bool:
    """Return whether a corpus chunk explicitly discusses the primary product."""
    anchors = _RETRIEVAL_TOPIC_ANCHORS.get(topic, ())
    return any(anchor in searchable_lower for anchor in anchors)


def _extract_explicit_standard_numbers(text: str) -> set[str]:
    """Return only standard identifiers explicitly supplied by the user.

    This is intentionally strict: product values such as 1500W are not treated
    as standards, and an unknown requested IS number must never be substituted
    with a semantically similar standard from the corpus.
    """
    return set(
        re.findall(
            r"\bis[\s\-]*(\d{3,5})\b",
            _normalise_message(text).lower(),
            flags=re.IGNORECASE,
        )
    )


def _chunk_searchable_text(chunk: Dict[str, Any]) -> str:
    return " ".join(
        [
            str(chunk.get("title", "")),
            str(chunk.get("clause_number", "")),
            str(chunk.get("chunk_text", "")),
            str(chunk.get("source_id", "")),
        ]
    ).lower()



def _detect_retrieval_subintents(text: str) -> set[str]:
    """Detect specific evidence intents within an already identified product.

    These are retrieval controls only. They do not establish regulatory
    applicability. In particular, an RO query about output-water quality
    should prefer drinking-water-quality evidence over generic RO performance
    evidence.
    """
    cleaned = _remove_explicit_exclusions(text).lower()
    intents: set[str] = set()

    quality_terms = (
        "drinking water quality", "output water quality",
        "quality of the drinking water", "quality specifications",
        "treated drinking water", "treated water", "water quality",
        "acceptable limits", "pH", "ph", "turbidity", "e. coli",
        "ecoli", "coliform", "hardness", "tds limit",
        "পানির গুণমান", "জলের গুণমান", "पानी की गुणवत्ता",
    )
    performance_terms = (
        "system performance", "ro performance", "pure water recovery",
        "recovery ratio", "tds reduction", "feed water",
        "rated operating pressure", "membrane performance",
        "performance of the ro", "आरओ प्रदर्शन", "पानी की रिकवरी",
        "পিউর ওয়াটার রিকভারি", "পানির পুনরুদ্ধার",
    )

    if any(term in cleaned for term in quality_terms):
        intents.add("drinking_water_quality")
    if any(term in cleaned for term in performance_terms):
        intents.add("ro_performance")

    return intents


def _detect_explicitly_excluded_subintents(text: str) -> set[str]:
    """Detect sub-intents that the user explicitly says they do NOT want.

    This is deliberately separate from positive intent detection. For example,
    a query can request drinking-water quality while explicitly excluding RO
    performance. The latter must become a hard evidence exclusion.
    """
    lower = text.lower()

    exclusion_patterns = (
        r"\bnot\s+asking\s+about\b([^.!?]*)",
        r"\bdo\s+not\s+(?:discuss|include|cover|talk\s+about|explain)\b([^.!?]*)",
        r"\bdon't\s+(?:discuss|include|cover|talk\s+about|explain)\b([^.!?]*)",
        r"\bnot\s+interested\s+in\b([^.!?]*)",
        r"\bexclude(?:d|ing)?\b([^.!?]*)",
        r"\bavoid\b([^.!?]*)",
    )

    excluded_parts: list[str] = []
    for pattern in exclusion_patterns:
        for match in re.finditer(pattern, lower, flags=re.IGNORECASE):
            excluded_parts.append(match.group(1))

    if not excluded_parts:
        return set()

    excluded_text = " ".join(excluded_parts)
    excluded: set[str] = set()

    performance_terms = (
        "system performance",
        "ro performance",
        "pure water recovery",
        "recovery ratio",
        "tds reduction",
        "feed water",
        "rated operating pressure",
        "membrane performance",
        "performance of the ro",
        "ro system",
        "आरओ प्रदर्शन",
        "पानी की रिकवरी",
        "পিউর ওয়াটার রিকভারি",
        "পানির পুনরুদ্ধার",
    )

    quality_terms = (
        "drinking water quality",
        "output water quality",
        "quality specifications",
        "treated drinking water",
        "treated water",
        "water quality",
        "acceptable limits",
        "turbidity",
        "ph",
        "e. coli",
        "coliform",
        "hardness",
        "tds limit",
    )

    if any(term in excluded_text for term in performance_terms):
        excluded.add("ro_performance")

    if any(term in excluded_text for term in quality_terms):
        excluded.add("drinking_water_quality")

    return excluded


_RETRIEVAL_SUBINTENT_ANCHORS: Dict[str, Tuple[str, ...]] = {
    "drinking_water_quality": (
        "drinking water specification", "water quality",
        "acceptable limits", "table 1", "table 2", "turbidity",
        "ph", "total hardness", "total dissolved solids", "e. coli",
        "thermotolerant coliform", "treated drinking water",
        "potable water quality",
    ),
    "ro_performance": (
        "ro system performance", "pure water recovery", "recovery ratio",
        "tds reduction", "feed water", "rated operating pressure",
        "reverse osmosis (ro) point-of-use", "ro point-of-use",
    ),
}


def _chunk_matches_retrieval_subintent(
    searchable_lower: str,
    subintent: str,
) -> bool:
    anchors = _RETRIEVAL_SUBINTENT_ANCHORS.get(subintent, ())
    return any(anchor in searchable_lower for anchor in anchors)

def _has_meaningful_overlap(
    query: str,
    chunk: Dict[str, Any],
    product_context: str = "",
) -> bool:
    """
    Decide whether a retrieved chunk is actually relevant.

    IMPORTANT:
    - The vector store may return arbitrary chunks when min_similarity=0.
    - Search aliases are intentionally NOT used as the relevance test.
    - The original user message is the primary relevance signal.
    - Product context is only a secondary signal for product-context queries.
    - For known topics, at least one topic-specific anchor must appear in the
      chunk. A generic word such as "BIS", "standard", "certification", or
      "registration" is not enough.
    """

    query = _normalise_message(query)
    searchable_lower = _chunk_searchable_text(chunk)

    # ---------------------------------------------------------------
    # Explicit standard/source number matching
    # ---------------------------------------------------------------

    # Only an explicitly supplied IS number is treated as a standard
    # identifier. We record the match here, but DO NOT return immediately:
    # sub-intent and explicit-exclusion safety gates must run first.
    query_standard_numbers = _extract_explicit_standard_numbers(query)
    explicit_standard_match = False

    for number in query_standard_numbers:
        if re.search(
            rf"\bis[\s\-]*{re.escape(number)}\b",
            searchable_lower,
            flags=re.IGNORECASE,
        ):
            explicit_standard_match = True
            break

        # Some corpus records/source IDs may contain the standard number
        # without an "IS" prefix. This fallback is allowed only because the
        # user explicitly supplied the IS identifier.
        if re.search(rf"\b{re.escape(number)}\b", searchable_lower):
            explicit_standard_match = True
            break

    # ---------------------------------------------------------------
    # Topic-aware relevance
    # ---------------------------------------------------------------

    # Positive intent detection must ignore text that the user explicitly
    # marked as excluded. Otherwise a sentence such as
    # "I am NOT asking about RO system performance" would incorrectly create
    # a positive RO-performance intent.
    intent_query = _remove_explicit_exclusions(query)
    query_topics = _detect_retrieval_topics(intent_query)

    # Product identity is a stronger retrieval constraint than incidental
    # attributes mentioned in the same question. For example, a kettle may
    # contain plastic parts and hold drinking water, but that does not turn the
    # query into an RO, drinking-water, or generic plastics query.
    # ---------------------------------------------------------------
    # HARD EXCLUSION SAFETY GATE
    # ---------------------------------------------------------------

    # Explicit user exclusions always outrank semantic similarity, product
    # overlap, and even an explicitly mentioned standard number.
    excluded_subintents = _detect_explicitly_excluded_subintents(query)

    if excluded_subintents:
        for excluded_subintent in excluded_subintents:
            if _chunk_matches_retrieval_subintent(
                searchable_lower,
                excluded_subintent,
            ):
                return False

    # ---------------------------------------------------------------
    # HARD STANDARD-MISMATCH SAFETY GATE
    # ---------------------------------------------------------------

    # This MUST run before the requested-sub-intent gate. A chunk may match
    # the requested semantic sub-intent while still belonging to a different
    # explicitly requested standard. Semantic relevance must never override
    # an explicit standard identifier.
    if query_standard_numbers and not explicit_standard_match:
        return False

    # ---------------------------------------------------------------
    # REQUESTED SUB-INTENT SAFETY GATE
    # ---------------------------------------------------------------

    query_subintents = _detect_retrieval_subintents(intent_query)

    if query_subintents:
        if not any(
            _chunk_matches_retrieval_subintent(
                searchable_lower,
                subintent,
            )
            for subintent in query_subintents
        ):
            return False

        # A requested sub-intent is a sufficiently specific evidence gate.
        # At this point an explicit standard, if present, has already matched.
        # Therefore this return can safely accept the sub-intent match without
        # allowing a mismatched standard through.
        return True

    # An explicit standard match is safe after the hard exclusion and
    # hard-mismatch gates above.
    if explicit_standard_match:
        return True

    primary_product_topics = _detect_primary_product_topics(
        intent_query,
        product_context=product_context,
    )

    # If the user asks a product-context question such as
    # "What requirements apply to this active product?", product_context is the
    # authoritative source for identifying the product. It is still only a
    # retrieval gate and never establishes regulatory applicability.
    if primary_product_topics:
        if any(
            _chunk_matches_product_topic(searchable_lower, topic)
            for topic in primary_product_topics
        ):
            return True

        # A clearly identified product query must never fall through to generic
        # lexical overlap or secondary attribute topics.
        return False

    if not query_topics and product_context:
        query_topics = _detect_retrieval_topics(product_context)

    if query_topics:
        for topic in query_topics:
            if _chunk_matches_product_topic(searchable_lower, topic):
                return True

        # A query with a known non-product topic must not fall through to generic
        # lexical overlap. This keeps CRS/ISI/etc. queries tightly scoped.
        return False

    # ---------------------------------------------------------------
    # Generic lexical overlap
    # ---------------------------------------------------------------

    query_tokens = _tokenise(query)
    chunk_tokens = _tokenise(searchable_lower)

    meaningful_query_tokens = {
        token
        for token in query_tokens
        if len(token) >= 3
        and token not in {
            "what", "which", "does", "this", "that", "the", "for",
            "and", "are", "with", "from", "about", "apply", "applies",
            "requirements", "requirement", "standard", "standards",
            "information",
        }
    }

    overlap = meaningful_query_tokens.intersection(chunk_tokens)

    # One generic word is not sufficient evidence. Require two meaningful
    # lexical matches for queries that do not map to a known topic.
    return len(overlap) >= 2


# ---------------------------------------------------------------------------
# Multilingual retrieval expansion
# ---------------------------------------------------------------------------

def _retrieval_aliases(message: str) -> List[str]:
    """
    Retrieval-only language aliases.

    These aliases DO NOT represent regulatory facts. They only help map
    common Hindi/Bengali user terminology to English terminology that exists
    in the indexed corpus.
    """

    aliases: List[str] = []

    # Hindi electric kettle queries
    hindi_electrical_terms = [
        "इलेक्ट्रिक",
        "केतली",
        "बिजली",
        "उपकरण",
        "मानक",
        "बीआईएस",
    ]

    if any(
        term in message
        for term in hindi_electrical_terms
    ):
        aliases.extend(
            [
                "electric kettle",
                "electrical appliance",
                "BIS",
                "Indian Standard",
                "IS 302",
                "electrical safety",
            ]
        )

    # Hindi water purifier queries
    hindi_water_terms = [
        "पानी",
        "जल",
        "प्यूरीफायर",
        "प्यूरिफायर",
        "शोधक",
        "आरओ",
        "रिवर्स ऑस्मोसिस",
    ]

    if any(
        term in message
        for term in hindi_water_terms
    ):
        aliases.extend(
            [
                "water purifier",
                "RO purifier",
                "reverse osmosis",
                "water treatment",
                "IS 16240",
                "IS 10500",
            ]
        )

    # Hindi cookware queries
    hindi_cookware_terms = [
        "कुकवेयर",
        "बर्तन",
        "स्टील",
        "स्टेनलेस",
        "खाना",
        "खाद्य",
    ]

    if any(
        term in message
        for term in hindi_cookware_terms
    ):
        aliases.extend(
            [
                "cookware",
                "stainless steel",
                "food contact",
                "IS 6911",
                "IS 14756",
            ]
        )

    # Bengali electrical kettle queries
    bengali_electrical_terms = [
        "ইলেকট্রিক",
        "কেটলি",
        "বিদ্যুৎ",
        "বিআইএস",
        "মানদণ্ড",
        "মান",
    ]

    if any(
        term in message
        for term in bengali_electrical_terms
    ):
        aliases.extend(
            [
                "electric kettle",
                "electrical appliance",
                "BIS",
                "Indian Standard",
                "IS 302",
                "electrical safety",
            ]
        )

    # Bengali water purifier queries
    bengali_water_terms = [
        "পানি",
        "জল",
        "পিউরিফায়ার",
        "পিউরিফায়ার",
        "আরও",
        "রিভার্স অসমোসিস",
    ]

    if any(
        term in message
        for term in bengali_water_terms
    ):
        aliases.extend(
            [
                "water purifier",
                "RO purifier",
                "reverse osmosis",
                "water treatment",
                "IS 16240",
                "IS 10500",
            ]
        )

    # Certification / registration retrieval aliases.
    # These are search expansion terms only and are never used as evidence.
    message_lower = message.lower()

    if (
        "crs" in message_lower
        or "cro" in message_lower
        or "compulsory registration" in message_lower
        or "registration scheme" in message_lower
    ):
        aliases.extend(
            [
                "CRS",
                "CRO",
                "Compulsory Registration Scheme",
                "registration scheme",
                "MeitY",
            ]
        )

    if (
        "isi mark" in message_lower
        or "isi marking" in message_lower
        or "standard mark" in message_lower
    ):
        aliases.extend(
            [
                "ISI Mark",
                "ISI marking",
                "Standard Mark",
                "BIS certification",
            ]
        )

    # Bengali cookware queries
    bengali_cookware_terms = [
        "কুকওয়্যার",
        "কুকওয়্যার",
        "স্টিল",
        "স্টেইনলেস",
        "রান্না",
        "খাদ্য",
    ]

    if any(
        term in message
        for term in bengali_cookware_terms
    ):
        aliases.extend(
            [
                "cookware",
                "stainless steel",
                "food contact",
                "IS 6911",
                "IS 14756",
            ]
        )

    return aliases


def _retrieve_evidence(
    message: str,
    product_context: str = "",
) -> List[Tuple[Dict[str, Any], float]]:
    """
    Retrieve evidence from the existing VectorStore only.

    No standards or regulatory facts are created here.
    """

    search_query = message

    if product_context:
        search_query = (
            f"{message} {product_context}"
        )

    aliases = _retrieval_aliases(message)

    if aliases:
        search_query = (
            f"{search_query} {' '.join(aliases)}"
        )

    results = vector_store.search(
        search_query,
        # Retrieve a wider candidate pool before applying strict safety
        # filtering. The final response still receives only the best 4
        # relevant chunks.
        top_k=32,
        min_similarity=0.0,
    )

    meaningful_results = [
        (chunk, score)
        for chunk, score in results
        if _has_meaningful_overlap(
            message,
            chunk,
            product_context=product_context,
        )
    ]

    # ---------------------------------------------------------------
    # Explicit standard/source number safety gate
    # ---------------------------------------------------------------

    # If the user explicitly names one or more IS numbers, the answer must be
    # grounded in those exact standards. A different standard is never an
    # acceptable substitute merely because vector similarity is high.
    explicit_numbers = _extract_explicit_standard_numbers(message)

    if explicit_numbers:
        exact_results: List[Tuple[Dict[str, Any], float]] = []

        # IMPORTANT: filter the already safety-validated meaningful results,
        # not the raw vector candidates. Otherwise an explicitly excluded
        # standard could bypass _has_meaningful_overlap().
        for chunk, score in meaningful_results:
            searchable = _chunk_searchable_text(chunk)
            if any(
                re.search(
                    rf"\bis[\s\-]*{re.escape(number)}\b",
                    searchable,
                    flags=re.IGNORECASE,
                )
                or re.search(
                    rf"\b{re.escape(number)}\b",
                    searchable,
                )
                for number in explicit_numbers
            ):
                exact_results.append((chunk, score))

        # Never fall back to semantically similar standards. If the exact
        # requested identifier is absent from the safety-validated candidates,
        # return no evidence so the endpoint activates Safe Abstention.
        return exact_results[:4]

    return meaningful_results[:4]


# ---------------------------------------------------------------------------
# Citations
# ---------------------------------------------------------------------------

def _build_citations(
    retrieved_results: List[Tuple[Dict[str, Any], float]],
) -> List[CitationItem]:

    citations: List[CitationItem] = []

    seen_sources: set[str] = set()

    for chunk, score in retrieved_results:

        source_id = str(
            chunk.get(
                "source_id",
                "",
            )
        )

        if not source_id:
            continue

        if source_id in seen_sources:
            continue

        seen_sources.add(source_id)

        citations.append(
            CitationItem(
                source_id=source_id,
                title=str(
                    chunk.get(
                        "title",
                        "Indian Standard",
                    )
                ),
                clause=str(
                    chunk.get(
                        "clause_number",
                        "",
                    )
                ),
                authority=str(
                    chunk.get(
                        "authority",
                        "",
                    )
                ),
                verification_status=str(
                    chunk.get(
                        "verification_status",
                        "UNKNOWN",
                    )
                ),
                official_url=chunk.get(
                    "source_url"
                ),
            )
        )

    return citations[:4]


# ---------------------------------------------------------------------------
# Language
# ---------------------------------------------------------------------------

def _localized_intro(language: str) -> str:
    """
    Adds a language-appropriate introduction without translating or modifying
    authoritative corpus evidence.
    """

    if language == "hi":
        return (
            "आपके प्रश्न के संदर्भ में उपलब्ध NiyamVeda प्रमाणित जानकारी और "
            "BIS मानक नीचे दिए गए हैं। प्रमाणित तकनीकी पाठ को मूल रूप में "
            "रखा गया है।\n\n"
        )

    if language == "bn":
        return (
            "আপনার প্রশ্নের প্রেক্ষিতে NiyamVeda-তে বর্তমানে সূচিবদ্ধ "
            "প্রামাণিক তথ্য এবং BIS মানদণ্ড নিচে দেওয়া হলো। "
            "প্রামাণিক প্রযুক্তিগত পাঠ মূল রূপে রাখা হয়েছে।\n\n"
        )

    return ""


def _language_instruction(
    language: str,
) -> str:

    if language == "hi":
        return (
            "Respond in clear Hindi. Keep Indian Standard names, "
            "source IDs, clause numbers, URLs and technical terms "
            "in their original form where useful."
        )

    if language == "bn":
        return (
            "Respond in clear Bengali. Keep Indian Standard names, "
            "source IDs, clause numbers, URLs and technical terms "
            "in their original form where useful."
        )

    return (
        "Respond in clear English suitable for an Indian MSME."
    )


# ---------------------------------------------------------------------------
# Safe abstention
# ---------------------------------------------------------------------------

def _safe_abstention_response(
    language: str,
    reason: str,
) -> str:

    if language == "hi":
        return (
            "मुझे इस प्रश्न का विश्वसनीय उत्तर देने के लिए "
            "NiyamVeda के वर्तमान indexed knowledge corpus में "
            "पर्याप्त सत्यापित जानकारी नहीं मिली।\n\n"
            "Safe Abstention सक्रिय है, इसलिए मैं अनुमान लगाकर "
            "कोई BIS standard, clause, certification requirement, "
            "laboratory, hallmarking requirement या regulatory "
            "claim नहीं बताऊँगा।\n\n"
            f"कारण: {reason}"
        )

    if language == "bn":
        return (
            "এই প্রশ্নের নির্ভরযোগ্য উত্তর দেওয়ার জন্য "
            "NiyamVeda-এর বর্তমান indexed knowledge corpus-এ "
            "পর্যাপ্ত যাচাইকৃত তথ্য পাওয়া যায়নি।\n\n"
            "Safe Abstention সক্রিয় রয়েছে, তাই আমি অনুমান করে "
            "কোনো BIS standard, clause, certification requirement, "
            "laboratory, hallmarking requirement বা regulatory "
            "claim প্রদান করব না।\n\n"
            f"কারণ: {reason}"
        )

    return (
        "I could not find sufficient verified information in "
        "NiyamVeda's indexed knowledge corpus to answer this "
        "reliably.\n\n"
        "SAFE ABSTENTION is active, so I will not guess or invent "
        "a BIS standard, clause, certification requirement, "
        "laboratory, hallmarking requirement, URL, or regulatory claim.\n\n"
        f"Reason: {reason}"
    )


# ---------------------------------------------------------------------------
# Product context
# ---------------------------------------------------------------------------

def _product_context(
    product_id: str | None,
):
    if not product_id:
        return None, "", {}, None

    product = product_repo.get(
        product_id
    )

    if not product:
        return None, "", {}, None

    # IMPORTANT:
    # Existing deterministic analysis remains the source of truth.
    analysis = orchestrator.analyze(
        product,
        product_id=product.id,
    )

    facts = {
        "product_name": product.product_name,
        "category": product.category,
        "intended_use": product.intended_use,
        "operating_voltage": product.operating_voltage,
        "power_consumption": product.power_consumption,
        "material_composition": product.material_composition,
        "technical_characteristics": (
            product.technical_characteristics
        ),
        "water_storage_capacity": (
            product.water_storage_capacity
        ),
    }

    context = "\n".join(
        [
            f"Product: {product.product_name}",
            f"Category: {product.category}",
            f"Intended use: {product.intended_use}",
            f"Operating voltage: {product.operating_voltage}",
            f"Power consumption: {product.power_consumption}",
            f"Material composition: {product.material_composition}",
            (
                "Technical characteristics: "
                f"{product.technical_characteristics}"
            ),
            (
                "Water storage capacity: "
                f"{product.water_storage_capacity}"
            ),
            (
                "Evidence confidence: "
                f"{analysis.evidence_confidence}"
            ),
            (
                "Safe abstention: "
                f"{analysis.safe_abstention.activated}"
            ),
        ]
    )

    return (
        product,
        context,
        facts,
        analysis,
    )


# ---------------------------------------------------------------------------
# Special-topic routing
# ---------------------------------------------------------------------------

def _get_special_topic_reason(
    message_lower: str,
) -> str | None:

    # These checks do NOT claim that these subjects are absent from
    # the entire Indian regulatory ecosystem. They only state that
    # NiyamVeda's indexed corpus currently does not contain sufficient
    # information for these particular queries.

    if (
        "hallmarking" in message_lower
        or "hallmark" in message_lower
    ):
        return (
            "Hallmarking information is not currently indexed "
            "in the NiyamVeda regulatory knowledge corpus."
        )

    laboratory_terms = [
        "nabl laboratory",
        "laboratory in",
        "testing lab",
        "testing labs",
        "list of labs",
        "which laboratory",
        "which lab",
        "laboratory should i use",
    ]

    if any(
        term in message_lower
        for term in laboratory_terms
    ):
        return (
            "Specific laboratory-directory or laboratory-location "
            "information is not indexed in the NiyamVeda regulatory "
            "knowledge corpus. Local laboratory rosters are not maintained "
            "in the indexed corpus; official BIS/NABL LIMS should be used "
            "to verify current laboratory listings."
        )

    return None


def _is_unknown_product_domain(
    message_lower: str,
) -> bool:

    unsupported_domains = [
        "autonomous military drone",
        "military drone",
        "nuclear-powered drone",
        "nuclear drone",
        "laser scanner",
        "nuclear reactor",
        "rocket",
        "space suit",
        "firearm",
        "missile",
        "military aircraft",
    ]

    return any(
        term in message_lower
        for term in unsupported_domains
    )


# ---------------------------------------------------------------------------
# Certification / registration handling
# ---------------------------------------------------------------------------

def _is_certification_question(
    message_lower: str,
) -> bool:

    terms = [
        "certification",
        "certify",
        "certified",
        "certification guaranteed",
        "guarantee certification",
        "crs",
        "isi mark",
        "registration scheme",
        "conformity",
    ]

    return any(
        term in message_lower
        for term in terms
    )


def _certification_disclaimer(
    language: str,
) -> str:

    if language == "hi":
        return (
            "\n\nध्यान दें: NiyamVeda certification या registration "
            "की guarantee नहीं देता। उपलब्ध corpus में किसी scheme "
            "या process की पर्याप्त जानकारी न होने पर मैं अनुमान "
            "नहीं लगाऊँगा।"
        )

    if language == "bn":
        return (
            "\n\nদ্রষ্টব্য: NiyamVeda certification বা registration-এর "
            "গ্যারান্টি দেয় না। বর্তমান corpus-এ কোনো scheme বা "
            "process সম্পর্কে পর্যাপ্ত তথ্য না থাকলে আমি অনুমান "
            "করব না।"
        )

    return (
        "\n\nNote: NiyamVeda does not guarantee certification or "
        "registration. Where the indexed corpus does not contain "
        "enough information about a scheme or process, I will not "
        "guess."
    )


# ---------------------------------------------------------------------------
# Chat endpoint
# ---------------------------------------------------------------------------

@router.post(
    "/chat",
    response_model=AssistantChatResponse,
)
def assistant_chat(
    payload: AssistantChatRequest,
):

    message = _normalise_message(
        payload.message
    )

    language = _normalise_language(
        payload.language
    )

    # ---------------------------------------------------------------
    # Empty query
    # ---------------------------------------------------------------

    if not message:
        return AssistantChatResponse(
            response=(
                "Please enter a question so I can search the "
                "available regulatory knowledge."
            ),
            suggested_queries=[
                "What standards apply to electric kettles?",
                "What information is available for RO purifiers?",
                "What standards apply to stainless steel cookware?",
            ],
            citations=[],
            safe_abstention=True,
            abstention_reason="Empty user query.",
            grounded_in_corpus=False,
            disclaimer=DISCLAIMER,
        )

    message_lower = message.lower()

    # ---------------------------------------------------------------
    # Product context
    # ---------------------------------------------------------------

    try:
        (
            product,
            product_context,
            product_facts,
            analysis,
        ) = _product_context(
            payload.product_id
        )

    except Exception as exc:
        logger.exception(
            "Unable to load product context: %s",
            exc,
        )

        product = None
        product_context = ""
        product_facts = {}
        analysis = None

    # ---------------------------------------------------------------
    # Unknown / unsupported domain
    # ---------------------------------------------------------------

    if _is_unknown_product_domain(
        message_lower
    ):
        reason = (
            "This product domain is not sufficiently represented "
            "in the indexed NiyamVeda knowledge corpus."
        )

        return AssistantChatResponse(
            response=_safe_abstention_response(
                language,
                reason,
            ),
            suggested_queries=[
                "What standards apply to electric kettles?",
                "What requirements are indexed for RO purifiers?",
                "What standards apply to stainless steel cookware?",
            ],
            citations=[],
            safe_abstention=True,
            abstention_reason=reason,
            grounded_in_corpus=False,
            disclaimer=DISCLAIMER,
        )

    # ---------------------------------------------------------------
    # Hallmarking / laboratory
    # ---------------------------------------------------------------

    special_topic_reason = _get_special_topic_reason(
        message_lower
    )

    if special_topic_reason:
        return AssistantChatResponse(
            response=_safe_abstention_response(
                language,
                special_topic_reason,
            ),
            suggested_queries=[
                "What standards apply to electric kettles?",
                "What requirements are indexed for RO purifiers?",
                "What standards apply to stainless steel cookware?",
            ],
            citations=[],
            safe_abstention=True,
            abstention_reason=special_topic_reason,
            grounded_in_corpus=False,
            disclaimer=DISCLAIMER,
        )

    # ---------------------------------------------------------------
    # Retrieve authoritative corpus evidence
    # ---------------------------------------------------------------

    retrieved_results = _retrieve_evidence(
        message,
        product_context,
    )

    citations = _build_citations(
        retrieved_results
    )

    retrieved_chunks = [
        chunk
        for chunk, score in retrieved_results
    ]

    # ---------------------------------------------------------------
    # Product-specific deterministic abstention
    # ---------------------------------------------------------------

    if (
        analysis
        and analysis.safe_abstention.activated
    ):

        reason = (
            analysis.safe_abstention.abstention_reason
            or (
                "The deterministic analysis does not have "
                "sufficient evidence for a reliable conclusion."
            )
        )

        product_name = (
            product.product_name
            if product
            else "the active product"
        )

        category = (
            product.category
            if product
            else "not specified"
        )

        voltage = (
            product.operating_voltage
            if product
            and product.operating_voltage
            else "not specified"
        )

        if language == "hi":

            response_text = (
                f"आपके सक्रिय उत्पाद **{product_name}** के लिए "
                f"उपलब्ध जानकारी:\n\n"
                f"- श्रेणी: {category}\n"
                f"- ऑपरेटिंग वोल्टेज: {voltage}\n\n"
                "लेकिन deterministic compliance engine ने इस "
                "उत्पाद के लिए Safe Abstention सक्रिय किया है। "
                "इसलिए मैं उपलब्ध साक्ष्य से आगे कोई compliance "
                "conclusion या BIS requirement का अनुमान नहीं "
                "लगाऊँगा।\n\n"
                f"कारण: {reason}"
            )

        elif language == "bn":

            response_text = (
                f"আপনার সক্রিয় পণ্য **{product_name}**-এর জন্য "
                f"উপলব্ধ তথ্য:\n\n"
                f"- বিভাগ: {category}\n"
                f"- অপারেটিং ভোল্টেজ: {voltage}\n\n"
                "তবে deterministic compliance engine এই "
                "পণ্যের জন্য Safe Abstention সক্রিয় করেছে। "
                "তাই উপলব্ধ প্রমাণের বাইরে কোনো compliance "
                "conclusion বা BIS requirement অনুমান করা হবে না।\n\n"
                f"কারণ: {reason}"
            )

        else:

            response_text = (
                f"Your active product is **{product_name}**.\n\n"
                f"- **Category:** {category}\n"
                f"- **Operating Voltage:** {voltage}\n\n"
                "However, the deterministic compliance engine "
                "has activated Safe Abstention for this product. "
                "Therefore, I will not make a compliance conclusion "
                "or invent a BIS requirement beyond the available "
                "evidence.\n\n"
                f"Reason: {reason}"
            )

        return AssistantChatResponse(
            response=response_text,
            suggested_queries=[
                "What information is missing from my product profile?",
                "Explain why safe abstention was activated.",
                "What evidence was retrieved for my product?",
            ],
            citations=citations,
            safe_abstention=True,
            abstention_reason=reason,
            grounded_in_corpus=bool(
                retrieved_chunks
            ),
            disclaimer=DISCLAIMER,
        )

    # ---------------------------------------------------------------
    # No authoritative evidence
    # ---------------------------------------------------------------

    if not retrieved_chunks:

        reason = (
            "No sufficiently relevant authoritative evidence "
            "was retrieved for this question."
        )

        return AssistantChatResponse(
            response=_safe_abstention_response(
                language,
                reason,
            ),
            suggested_queries=[
                "What standards apply to electric kettles?",
                "What requirements are indexed for RO purifiers?",
                "What standards apply to stainless steel cookware?",
            ],
            citations=[],
            safe_abstention=True,
            abstention_reason=reason,
            grounded_in_corpus=False,
            disclaimer=DISCLAIMER,
        )

    # ---------------------------------------------------------------
    # Deterministic rule context
    # ---------------------------------------------------------------

    matched_rules: List[Dict[str, Any]] = []

    if analysis:
        matched_rules = [
            rule.model_dump()
            for rule in analysis.evaluated_rules
        ]

    # ---------------------------------------------------------------
    # Gemini / evidence-only provider
    # ---------------------------------------------------------------

    prompt = (
        f"User question: {message}\n\n"
        f"Product context:\n"
        f"{product_context or 'None'}"
    )

    system_instruction = _language_instruction(
        language
    )

    response_text = ai_provider.generate_explanation(
        prompt=prompt,
        system_instruction=system_instruction,
        retrieved_evidence=retrieved_chunks,
        matched_rules=matched_rules,
    )

    # Localized wrapper for Hindi/Bengali. Authoritative corpus evidence
    # remains unchanged and in its original form.
    response_text = _localized_intro(language) + response_text

    # ---------------------------------------------------------------
    # Certification safety language
    # ---------------------------------------------------------------

    if _is_certification_question(
        message_lower
    ):
        response_text = (
            response_text
            + _certification_disclaimer(
                language
            )
        )

        # The user's phrase "ISI Mark" may be present in the question
        # even when the corpus does not contain sufficient information
        # about it. We explicitly avoid inventing its process.
        if "isi mark" in message_lower:

            if language == "hi":
                response_text += (
                    "\n\nआपके प्रश्न में ISI Mark का उल्लेख है। "
                    "उपलब्ध indexed evidence में इसके बारे में "
                    "पर्याप्त जानकारी नहीं है, इसलिए मैं इसके "
                    "नियम या प्रक्रिया का अनुमान नहीं लगाऊँगा।"
                )

            elif language == "bn":
                response_text += (
                    "\n\nআপনার প্রশ্নে ISI Mark-এর উল্লেখ রয়েছে। "
                    "বর্তমান indexed evidence-এ এটি সম্পর্কে "
                    "পর্যাপ্ত তথ্য নেই, তাই আমি এর নিয়ম বা "
                    "প্রক্রিয়া অনুমান করব না।"
                )

            else:
                response_text += (
                    "\n\nYour question mentions ISI Mark. The "
                    "currently indexed evidence does not contain "
                    "enough information about its rules or process "
                    "to answer that part reliably, so I will not "
                    "invent those details."
                )

    # ---------------------------------------------------------------
    # Suggested questions
    # ---------------------------------------------------------------

    suggested_queries = [
        "What does this cited clause say?",
        "What evidence was used for this answer?",
        "What standards are indexed for this product category?",
    ]

    if product:
        suggested_queries.insert(
            0,
            "Explain the deterministic analysis for my product.",
        )

    # ---------------------------------------------------------------
    # Final response
    # ---------------------------------------------------------------

    return AssistantChatResponse(
        response=response_text,
        suggested_queries=suggested_queries[:4],
        citations=citations,
        safe_abstention=False,
        abstention_reason=None,
        grounded_in_corpus=True,
        disclaimer=DISCLAIMER,
    )