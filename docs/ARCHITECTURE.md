# NiyamVeda (नियमवेद) - Architecture Documentation

## Tagline
**From Product to Compliance Clarity**
*Problem Statement SIH26107 - Smart India Hackathon*

## Architectural Principle: Anti-Hallucination Triad
NiyamVeda is explicitly **not a generic chatbot**. It enforces a strict separation of concerns:

```
+-----------------------------+
|    Structured Product Facts |
+-----------------------------+
              |
              v
+-----------------------------+
|  Deterministic Rule Engine  | <--- Derived strictly from Source Registry
+-----------------------------+
              |
              v
+-----------------------------+
| Authoritative Evidence (RAG)| <--- pgvector (dim=768) + Verified Indian Standards
+-----------------------------+
              |
              v
+-----------------------------+
| AI Explanation / Synthesis  | <--- Gemini explains and summarizes; NEVER creates law
+-----------------------------+
              |
              v
+-----------------------------+
| Safe Abstention Gatekeeper  | <--- Blocks conclusions if facts/evidence insufficient
+-----------------------------+
```

## Confidence Model
Confidence is computed as an explainable composite function:
- **Product Fact Completeness** (weight 25%): Required attributes present (voltage, frequency, housing, application).
- **Deterministic Rule Coverage** (weight 25%): Exact match against verified BIS rules.
- **Evidence Retrieval Quality** (weight 25%): Relevancy and clause alignment from authoritative standard texts.
- **Authority & Source Status** (weight 25%): Source is current, legally enforced, and published by BIS / MeitY.

When any critical fact is absent or no authoritative source covers a novel/experimental technology (such as unstandardized UV-LED sanitization chambers), **Safe Abstention** is triggered immediately.
