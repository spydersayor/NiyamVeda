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

    # IMPORTANT: Words that appear in virtually every BIS/compliance
    # document must never count as meaningful evidence of relevance.
    # A query like "What BIS standards apply to QuantumFlux X9?" shares
    # {"bis"} with every single chunk in the corpus — that is NOT evidence
    # that the chunk is relevant to QuantumFlux X9.
    GENERIC_COMPLIANCE_TOKENS: set[str] = {
        # English filler / query words
        "what", "which", "does", "this", "that", "the", "for",
        "and", "are", "with", "from", "about", "apply", "applies",
        "requirements", "requirement", "standard", "standards",
        "information", "how", "can", "any", "all", "some", "get",
        "tell", "give", "list", "show", "find", "explain", "describe",
        "where", "when", "who", "why", "will", "should", "must",
        "need", "want", "have", "has", "had", "been", "being",
        "its", "their", "your", "our", "my", "his", "her",
        # Generic BIS/compliance vocabulary that permeates the entire corpus
        "bis", "indian", "india", "bureau", "national",
        "product", "products", "compliance", "compliant", "comply",
        "certification", "certify", "certified", "certificate",
        "regulation", "regulatory", "regulations", "regulate",
        "applicable", "applicability", "applicable", "whether",
        "mandate", "mandatory", "mandated", "required", "require",
        "quality", "testing", "test", "tests", "inspection",
        "marking", "mark", "marked", "scheme", "schemes",
        "safety", "safe", "approved", "approval", "authorized",
        "rule", "rules", "act", "order", "notification",
        "authority", "official", "government", "ministry",
        "clause", "clauses", "section", "part", "chapter",
        "general", "specific", "particular", "relevant",
        "different", "various", "certain", "current", "new",
        "available", "provide", "providing", "based", "under",
    }

    query_tokens = _tokenise(query)
    chunk_tokens = _tokenise(searchable_lower)

    # Only tokens that are NOT generic compliance vocabulary qualify
    # as meaningful evidence of topical relevance.
    meaningful_query_tokens = {
        token
        for token in query_tokens
        if len(token) >= 3
        and token not in GENERIC_COMPLIANCE_TOKENS
    }

    overlap = meaningful_query_tokens.intersection(chunk_tokens)

    # Require at least 2 genuinely domain-specific tokens to overlap.
    # This prevents "BIS" + "Indian" from being treated as relevance signal.
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
# Safety evasion detection
# ---------------------------------------------------------------------------

# Signals that a user is seeking to bypass, circumvent, or defraud
# regulatory requirements — these warrant SAFE_ABSTENTION, not just
# insufficient evidence.
_EVASION_PATTERNS: List[Tuple[re.Pattern, str]] = [
    (
        re.compile(
            r"\b(bypass|circumvent|evade|avoid|skip|get\s+around)\b.*\b"
            r"(bis|regulation|certification|testing|standard|compliance|requirement)",
            re.IGNORECASE,
        ),
        "Regulatory evasion or circumvention request.",
    ),
    (
        re.compile(
            r"\b(loophole|workaround|backdoor|shortcut)\b.*\b"
            r"(bis|regulation|testing|certification|compliance)",
            re.IGNORECASE,
        ),
        "Seeking regulatory loophole or workaround.",
    ),
    (
        re.compile(
            r"\b(falsif|forg|fake|counterfeit|fraud|fraudulent)"
            r"(y|ied|ying|ing|ous)?\b.*\b"
            r"(compliance|certificate|document|report|test|mark|certification|bis)",
            re.IGNORECASE,
        ),
        "Fraudulent compliance document request.",
    ),
    (
        re.compile(
            r"\b(forge|forged|fabricate|falsify|misrepresent)\b",
            re.IGNORECASE,
        ),
        "Request to forge or fabricate regulatory documents.",
    ),
    (
        re.compile(
            r"how\s+(?:can\s+i|do\s+i|to)\s+(?:bypass|skip|avoid|evade)",
            re.IGNORECASE,
        ),
        "Request to bypass regulatory requirements.",
    ),
]


def _detect_safety_evasion(
    message: str,
) -> Tuple[bool, str | None]:
    """
    Detect regulatory evasion / fraud intent.

    Returns (True, reason) if evasion is detected, (False, None) otherwise.

    NOTE: Questions about *legitimate* exemptions (e.g. "Is my product exempt
    from BIS certification?") are NOT evasion and must NOT be caught here.
    Evasion detection applies only to explicit requests to bypass, forge, or
    otherwise circumvent requirements.
    """
    for pattern, reason in _EVASION_PATTERNS:
        if pattern.search(message):
            return True, reason

    return False, None


# ---------------------------------------------------------------------------
# Abstention response builders
# ---------------------------------------------------------------------------

def _safe_abstention_response(
    language: str,
    reason: str,
) -> str:
    """SAFE_ABSTENTION: regulatory evasion / fraud."""

    if language == "hi":
        return (
            "यह अनुरोध NiyamVeda की regulatory सहायता के दायरे "
            "से बाहर है। NiyamVeda regulatory requirements को "
            "bypass, evade या circumvent करने में सहायता नहीं "
            "कर सकता, और न ही compliance documents को forge या "
            "falsify करने में।\n\n"
            f"कारण: {reason}"
        )

    if language == "bn":
        return (
            "এই অনুরোধটি NiyamVeda-এর নিয়ামক সহায়তার সুযোগের "
            "বাইরে। NiyamVeda নিয়ামক প্রয়োজনীয়তা bypass, evade "
            "বা circumvent করতে সাহায্য করতে পারে না, এবং "
            "compliance documents জাল বা মিথ্যা প্রস্তুত করতেও নয়।\n\n"
            f"কারণ: {reason}"
        )

    return (
        "This request falls outside the scope of NiyamVeda's regulatory "
        "assistance. NiyamVeda cannot help bypass, evade, or circumvent "
        "regulatory requirements, or forge/falsify compliance documents.\n\n"
        f"Reason: {reason}"
    )


def _insufficient_evidence_response(
    language: str,
    reason: str = "",
) -> str:
    """INSUFFICIENT_EVIDENCE: legitimate question, but no authoritative evidence available."""

    if language == "hi":
        return (
            "इस प्रश्न का उत्तर देने के लिए NiyamVeda के "
            "indexed knowledge corpus में पर्याप्त प्रामाणिक "
            "साक्ष्य उपलब्ध नहीं है।\n\n"
            "NiyamVeda केवल उपलब्ध प्रमाणित evidence के आधार पर "
            "उत्तर देता है। Gemini की सामान्य ज्ञान का उपयोग "
            "किए बिना, यह प्रश्न वर्तमान corpus से सिद्ध नहीं "
            "किया जा सकता।\n\n"
            + (f"कारण: {reason}" if reason else "")
        )

    if language == "bn":
        return (
            "এই প্রশ্নের উত্তর দেওয়ার জন্য NiyamVeda-এর indexed "
            "knowledge corpus-এ পর্যাপ্ত প্রামাণিক সাক্ষ্য পাওয়া "
            "যায়নি।\n\n"
            "NiyamVeda শুধুমাত্র উপলব্ধ প্রামাণিক evidence-এর "
            "ভিত্তিতে উত্তর দেয়। Gemini-র সাধারণ জ্ঞান ব্যবহার "
            "না করে, বর্তমান corpus থেকে এই প্রশ্ন সমর্থিত "
            "করা যাচ্ছে না।\n\n"
            + (f"কারণ: {reason}" if reason else "")
        )

    return (
        "NiyamVeda does not have sufficient authoritative evidence in its "
        "indexed knowledge corpus to answer this question reliably.\n\n"
        "NiyamVeda answers only from verified authoritative evidence. "
        "Without relying on Gemini's general world knowledge, this question "
        "cannot be supported from the current corpus.\n\n"
        + (f"Reason: {reason}" if reason else "")
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
# User-provided authoritative evidence extraction
# ---------------------------------------------------------------------------

def _extract_user_provided_evidence(
    message: str,
) -> List[Dict[str, Any]]:
    """
    Detect when the user has pasted or quoted an authoritative document
    excerpt directly in their message, and construct a synthetic evidence
    chunk from it.

    This allows NiyamVeda to answer questions about products that are NOT
    in its predefined dataset if the user supplies sufficient authoritative
    source material in the query itself.

    The returned chunk uses source_id "USER_PROVIDED" and verification_status
    "USER_SUPPLIED" so the system can distinguish it from indexed corpus
    evidence and apply appropriate disclaimer language.

    Detection heuristics (conservative — must indicate authoritative content):
    - Quoted block (triple-backtick or indent) following "here is"/"attached"/
      "following document"/"BIS document"/"standard says"
    - Clause/section references inline with surrounding quote context
    - Explicit marker phrases: "Clause X.Y", "IS XXXXX", "BIS Standard",
      "the following document", "as per the document I am providing"
    """
    evidence_markers = [
        r"here is.*?(bis|standard|document|clause|specification)",
        r"the following (bis|standard|document|clause|specification)",
        r"as per (the )?(document|bis|standard|specification) (i|we) (am|are) providing",
        r"i(?:'m| am) providing.*?(document|standard|specification)",
        r"i(?:'ve| have) attached.*?(document|standard|specification)",
        r"attached.*?(bis|standard|document|specification)",
        r"the document (says|states|requires|specifies)",
        r"this (bis|standard|document|specification) (says|states|requires|specifies)",
        r"clause\s+\d+\.\d+\s+(?:says|states|requires|specifies|of\s+this)",
        r"\bis[\s\-]+\d{3,6}[\s\-]+(?:says|states|requires|specifies|clause)",
        r"according to.*?(document|standard|specification|bis|clause)",
    ]

    message_lower = message.lower()

    has_marker = any(
        re.search(pattern, message_lower, re.IGNORECASE)
        for pattern in evidence_markers
    )

    if not has_marker:
        return []

    # Only create a user-evidence chunk if the message is substantive
    # enough to plausibly contain authoritative content (> 150 chars).
    if len(message) < 150:
        return []

    # Extract any inline IS numbers mentioned for metadata.
    inline_standards = re.findall(
        r"\bis[\s\-]*(\d{3,6})\b",
        message,
        re.IGNORECASE,
    )

    standard_ref = (
        ", ".join(f"IS {n}" for n in inline_standards[:3])
        if inline_standards
        else "User-supplied authoritative document"
    )

    return [
        {
            "source_id": "USER_PROVIDED",
            "title": standard_ref,
            "authority": "User-supplied",
            "document_type": "User-provided authoritative excerpt",
            "clause_number": "",
            "verification_status": "USER_SUPPLIED",
            "source_url": None,
            "chunk_text": message,
        }
    ]


# ---------------------------------------------------------------------------
# Evidence sufficiency evaluation
# ---------------------------------------------------------------------------

def _evaluate_evidence_sufficiency(
    message: str,
    retrieved_chunks: List[Dict[str, Any]],
    product_context: str = "",
) -> Tuple[bool, str, str]:
    """
    Multi-factor evidence sufficiency gate.

    Determines whether the retrieved corpus evidence (plus any user-supplied
    evidence) is sufficient to ground an answer to the user's question.

    Returns (is_sufficient, response_type, reason) where:
      - is_sufficient: True → proceed to LLM generation
      - response_type: "grounded_answer" | "insufficient_evidence"
      - reason: human-readable explanation (used in abstention message)

    IMPORTANT:
    - An empty product dataset entry does NOT by itself mean insufficient.
    - User-supplied authoritative documents CAN satisfy the evidence gate.
    - QuantumFlux X9 (and similar unknown products) produce INSUFFICIENT only
      because NO authoritative evidence exists — not because the product name
      is absent from a lookup table.
    - Generic chunk counts (len > 0) are NOT sufficient — chunk relevance,
      source authority, and topical match are all considered.
    """

    if not retrieved_chunks:
        return (
            False,
            "insufficient_evidence",
            "No sufficiently relevant authoritative evidence was retrieved "
            "for this question.",
        )

    # Factor 1: Source authority — at least one chunk from a verified source
    # or user-supplied document.
    has_verified_source = any(
        chunk.get("verification_status") in (
            "VERIFIED", "AUTHORITATIVE", "INDEXED", "USER_SUPPLIED",
        )
        for chunk in retrieved_chunks
    )

    # If verification_status is not explicitly set, we still accept chunks
    # from the indexed corpus (non-empty source_id != USER_PROVIDED checks
    # are handled elsewhere).
    # Treat any chunk from the corpus as having at least INDEXED authority.
    if not has_verified_source:
        all_source_ids = [
            chunk.get("source_id", "") for chunk in retrieved_chunks
        ]
        # Accept if any non-empty source_id present (indexed corpus chunk)
        has_verified_source = any(sid for sid in all_source_ids)

    if not has_verified_source:
        return (
            False,
            "insufficient_evidence",
            "Retrieved evidence lacks verified or authoritative source "
            "attribution.",
        )

    # Factor 2: Clause-specific question check.
    # If the user asks about a specific clause (e.g. "Clause 30.2"), verify
    # that at least one retrieved chunk actually contains that clause.
    clause_match = re.search(
        r"clause\s+(\d+(?:\.\d+)*)",
        message,
        re.IGNORECASE,
    )

    if clause_match:
        requested_clause = clause_match.group(1)
        clause_in_evidence = any(
            requested_clause in str(
                chunk.get("clause_number", "")
            )
            or requested_clause in str(
                chunk.get("chunk_text", "")
            )
            for chunk in retrieved_chunks
        )

        if not clause_in_evidence:
            return (
                False,
                "insufficient_evidence",
                f"Clause {requested_clause} is not present in the "
                "retrieved authoritative evidence. NiyamVeda will not "
                "reconstruct clause content from general knowledge.",
            )

    # Factor 3: Standard-specific question check.
    # If the user asks about a specific standard (e.g. "IS 99999"), verify
    # that at least one chunk actually references it.
    query_standard_numbers = _extract_explicit_standard_numbers(message)
    if query_standard_numbers:
        standard_in_evidence = any(
            any(
                std_num in str(chunk.get("source_id", ""))
                or std_num in str(chunk.get("title", ""))
                or std_num in str(chunk.get("chunk_text", ""))
                for std_num in query_standard_numbers
            )
            for chunk in retrieved_chunks
        )
        if not standard_in_evidence:
            return (
                False,
                "insufficient_evidence",
                f"Standard IS {', '.join(query_standard_numbers)} is not present in the "
                "retrieved authoritative evidence. NiyamVeda will not "
                "fabricate standard content from general knowledge.",
            )

    # Factor 4: Product / domain mismatch check (Requirement 4).
    # If the question unambiguously targets a specific product domain (Product A)
    # but all retrieved chunks strictly belong to an unrelated product domain (Product B),
    # reject as insufficient evidence.
    intent_query = _remove_explicit_exclusions(message)
    evidence_marker_match = re.search(
        r"(?:here is|the following|as per the attached|attached document|refer to the following)\b",
        intent_query,
        re.IGNORECASE,
    )
    question_part = (
        intent_query[:evidence_marker_match.start()].strip()
        if evidence_marker_match
        else intent_query
    )
    target_topics = _detect_primary_product_topics(
        question_part or intent_query,
        product_context,
    )

    if target_topics:
        has_matching_chunk = any(
            any(
                _chunk_matches_product_topic(
                    f"{chunk.get('title', '')} {chunk.get('chunk_text', '')} {chunk.get('source_id', '')}".lower(),
                    topic,
                )
                for topic in target_topics
            )
            for chunk in retrieved_chunks
        )
        if not has_matching_chunk:
            other_domains_in_chunks = set()
            for chunk in retrieved_chunks:
                c_text = f"{chunk.get('title', '')} {chunk.get('chunk_text', '')} {chunk.get('source_id', '')}".lower()
                for known_topic in ("kettle", "ro", "cookware"):
                    if _chunk_matches_product_topic(c_text, known_topic):
                        other_domains_in_chunks.add(known_topic)
            if other_domains_in_chunks and not (other_domains_in_chunks & target_topics):
                return (
                    False,
                    "insufficient_evidence",
                    "The retrieved evidence relates to a different product domain and does not address the question.",
                )

    return True, "grounded_answer", ""


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
            response_type="insufficient_evidence",
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
    # STEP 1: Safety evasion check (SAFE_ABSTENTION)
    # ---------------------------------------------------------------

    is_evasion, evasion_reason = _detect_safety_evasion(message)

    if is_evasion:
        return AssistantChatResponse(
            response=_safe_abstention_response(
                language,
                evasion_reason or "Regulatory evasion or circumvention request.",
            ),
            response_type="safe_abstention",
            suggested_queries=[
                "What standards apply to electric kettles?",
                "What are the legitimate BIS certification steps for a product?",
                "What requirements apply to stainless steel cookware?",
            ],
            citations=[],
            safe_abstention=True,
            abstention_reason=evasion_reason,
            grounded_in_corpus=False,
            disclaimer=DISCLAIMER,
        )

    # ---------------------------------------------------------------
    # STEP 2: Known prohibited domains (military hardware, etc.)
    #
    # NOTE: This does NOT apply to ordinary unknown commercial products.
    # An unknown product (e.g. "pressure vessel") that is NOT in this
    # list proceeds to the evidence gate — it is NOT blocked here.
    # ---------------------------------------------------------------

    if _is_unknown_product_domain(
        message_lower
    ):
        reason = (
            "This product domain falls outside the scope of civil/commercial "
            "BIS regulation and is not represented in the NiyamVeda corpus."
        )

        return AssistantChatResponse(
            response=_insufficient_evidence_response(
                language,
                reason,
            ),
            response_type="insufficient_evidence",
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
    # STEP 3: Hallmarking / laboratory (INSUFFICIENT_EVIDENCE)
    # These are legitimate questions — but the corpus lacks the data.
    # ---------------------------------------------------------------

    special_topic_reason = _get_special_topic_reason(
        message_lower
    )

    if special_topic_reason:
        return AssistantChatResponse(
            response=_insufficient_evidence_response(
                language,
                special_topic_reason,
            ),
            response_type="insufficient_evidence",
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
    # STEP 4: Extract user-provided authoritative evidence
    #
    # A user may paste an authoritative BIS document excerpt directly
    # into their message. If so, treat it as evidence — this allows
    # answering questions about products NOT in the predefined dataset
    # (e.g. pressure vessels) when the user provides the authoritative
    # source themselves.
    # ---------------------------------------------------------------

    user_evidence_chunks = _extract_user_provided_evidence(message)

    # ---------------------------------------------------------------
    # STEP 5: Retrieve authoritative corpus evidence
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

    # Merge: corpus evidence + user-supplied evidence.
    # User-supplied chunks are appended AFTER corpus chunks so corpus
    # evidence always takes precedence in the LLM's grounding context.
    all_evidence_chunks = retrieved_chunks + user_evidence_chunks

    # ---------------------------------------------------------------
    # STEP 6: Product-specific deterministic abstention
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
                "उत्पाद के लिए पर्याप्त साक्ष्य न पाकर abstention "
                "सक्रिय किया है। इसलिए मैं उपलब्ध साक्ष्य से आगे "
                "कोई compliance conclusion या BIS requirement का "
                "अनुमान नहीं लगाऊँगा।\n\n"
                f"कारण: {reason}"
            )

        elif language == "bn":

            response_text = (
                f"আপনার সক্রিয় পণ্য **{product_name}**-এর জন্য "
                f"উপলব্ধ তথ্য:\n\n"
                f"- বিভাগ: {category}\n"
                f"- অপারেটিং ভোল্টেজ: {voltage}\n\n"
                "তবে deterministic compliance engine পর্যাপ্ত "
                "প্রমাণের অভাবে এই পণ্যের জন্য abstention "
                "সক্রিয় করেছে। তাই উপলব্ধ প্রমাণের বাইরে কোনো "
                "compliance conclusion বা BIS requirement অনুমান "
                "করা হবে না।\n\n"
                f"কারণ: {reason}"
            )

        else:

            response_text = (
                f"Your active product is **{product_name}**.\n\n"
                f"- **Category:** {category}\n"
                f"- **Operating Voltage:** {voltage}\n\n"
                "However, the deterministic compliance engine has "
                "found insufficient evidence for a reliable "
                "conclusion about this product. Therefore, I will "
                "not make a compliance conclusion or invent a BIS "
                "requirement beyond the available evidence.\n\n"
                f"Reason: {reason}"
            )

        return AssistantChatResponse(
            response=response_text,
            response_type="insufficient_evidence",
            suggested_queries=[
                "What information is missing from my product profile?",
                "Explain why abstention was activated.",
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
    # STEP 7: Multi-factor evidence sufficiency gate
    #
    # Evaluates whether combined corpus + user evidence is sufficient
    # to answer the question.
    #
    # PHILOSOPHY:
    # - An unknown product does NOT automatically trigger INSUFFICIENT.
    # - Insufficient evidence occurs when NO authoritative evidence
    #   (corpus OR user-supplied) addresses the question.
    # - QuantumFlux X9 + no evidence → INSUFFICIENT.
    # - Unknown product + user-supplied BIS document → potentially GROUNDED.
    # ---------------------------------------------------------------

    is_sufficient, response_type, sufficiency_reason = _evaluate_evidence_sufficiency(
        message,
        all_evidence_chunks,
        product_context,
    )

    if not is_sufficient:
        return AssistantChatResponse(
            response=_insufficient_evidence_response(
                language,
                sufficiency_reason,
            ),
            response_type="insufficient_evidence",
            suggested_queries=[
                "What standards apply to electric kettles?",
                "What requirements are indexed for RO purifiers?",
                "What standards apply to stainless steel cookware?",
            ],
            citations=[],
            safe_abstention=True,
            abstention_reason=sufficiency_reason,
            grounded_in_corpus=False,
            disclaimer=DISCLAIMER,
        )

    # ---------------------------------------------------------------
    # STEP 8: Deterministic rule context
    # ---------------------------------------------------------------

    matched_rules: List[Dict[str, Any]] = []

    if analysis:
        matched_rules = [
            rule.model_dump()
            for rule in analysis.evaluated_rules
        ]

    # ---------------------------------------------------------------
    # STEP 9: LLM generation — grounded strictly in evidence
    #
    # Pass all_evidence_chunks (corpus + user-supplied) to the LLM.
    # The strict system instruction in GeminiProvider prevents the
    # model from using general knowledge to fill any gaps.
    # ---------------------------------------------------------------

    # Note: If only user-supplied evidence is present, add a note to
    # the prompt so the model knows the source is user-provided.
    user_evidence_note = ""
    if user_evidence_chunks and not retrieved_chunks:
        user_evidence_note = (
            "\n\nNOTE: The only available evidence for this question "
            "is the authoritative document excerpt provided by the "
            "user in their message. Answer strictly from that "
            "provided text."
        )

    prompt = (
        f"User question: {message}\n\n"
        f"Product context:\n"
        f"{product_context or 'None'}"
        f"{user_evidence_note}"
    )

    system_instruction = _language_instruction(
        language
    )

    response_text = ai_provider.generate_explanation(
        prompt=prompt,
        system_instruction=system_instruction,
        retrieved_evidence=all_evidence_chunks,
        matched_rules=matched_rules,
    )

    # Add disclosure note when answer is grounded in user-supplied evidence
    # so the user understands the answer is based on their document, not
    # NiyamVeda's indexed corpus.
    if user_evidence_chunks and not retrieved_chunks:
        if language == "hi":
            response_text += (
                "\n\n⚠️ यह उत्तर आपके द्वारा प्रदान किए गए "
                "document के आधार पर दिया गया है, NiyamVeda के "
                "indexed corpus से नहीं।"
            )
        elif language == "bn":
            response_text += (
                "\n\n⚠️ এই উত্তরটি আপনার সরবরাহ করা document-এর "
                "ভিত্তিতে দেওয়া হয়েছে, NiyamVeda-এর indexed "
                "corpus থেকে নয়।"
            )
        else:
            response_text += (
                "\n\n⚠️ This answer is based on the authoritative "
                "document you provided, not NiyamVeda's indexed "
                "corpus. Please verify the document's authenticity "
                "independently."
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
        response_type="grounded_answer",
        suggested_queries=suggested_queries[:4],
        citations=citations,
        safe_abstention=False,
        abstention_reason=None,
        grounded_in_corpus=True,
        disclaimer=DISCLAIMER,
    )