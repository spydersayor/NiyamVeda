# NiyamVeda (नियमवेद)

> **From Product to Compliance Clarity**  
> *Explainable BIS Compliance Intelligence Assistant for Indian MSMEs (SIH26107)*

---

## ⚡ Quick Start (Run Both Backend & Frontend with Concurrently)

In the root directory, simply run:

```bash
# 1. Install root dependencies (includes concurrently)
npm install

# 2. Run both Backend & Frontend simultaneously
npm run dev
```

This single command will concurrently start:
- 🚀 **FastAPI Backend**: `http://localhost:8000` (API Docs: `http://localhost:8000/docs`)
- 💻 **Next.js 14 Frontend**: `http://localhost:3000` (All 12 Screens)

---

## 🛠️ Available Root Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs Backend & Frontend concurrently with color-coded prefix tags |
| `npm run dev:backend` | Runs only FastAPI backend (`uvicorn` on port 8000) |
| `npm run dev:frontend` | Runs only Next.js frontend (port 3000) |
| `npm run install:all` | Installs root dependencies and frontend dependencies |
| `npm run install:backend` | Installs Python packages from `backend/requirements.txt` |
| `npm run install:frontend` | Installs Next.js packages in `frontend/` |
| `npm run test:backend` | Runs the test suite in `backend/tests/test_core.py` |

---

## 📂 Project Architecture

```
NiyamVeda/
├── backend/                  # FastAPI + Deterministic Rule Engine + RAG Vector Store
│   ├── app/
│   │   ├── api/              # Endpoints: /products, /analyze, /simulation, /sources
│   │   ├── rules/            # Curated BIS rules & authoritative Source Registry
│   │   ├── rag/              # Vector store (dim=768) + Gemini & offline mock providers
│   │   └── services/         # Orchestrator, Safe Abstention, What-If Simulation
│   └── tests/                # Pytest core verification suite
├── frontend/                 # Next.js 14 (App Router) + Tailwind CSS
│   ├── app/                  # All 12 Screens from SIH Architecture
│   │   ├── page.tsx          # Screen 1: Landing Page
│   │   ├── product/new/      # Screen 2: Product Input (Multi-step form)
│   │   └── product/[id]/
│   │       ├── confirm/      # Screen 3: Confirm Product Facts (Provenance cards)
│   │       ├── analysis/     # Screen 4: Compliance Pathway Dashboard
│   │       ├── why-rule/     # Screen 5: Why This Rule Applies (Dedicated route)
│   │       ├── rule-inspector# Screen 6: Rule Inspector (Dual-panel logic & quote)
│   │       ├── standards/    # Screen 7: Relevant Standards & Evidence
│   │       ├── requirements/ # Screen 8: Requirements Checklist (14 criteria)
│   │       ├── risks/        # Screen 9: Potential Compliance Risks (Pre-mortem)
│   │       ├── simulation/   # Screen 10: What-If Simulation (Deterministic diff)
│   │       └── sources/      # Screen 11: Verified Sources & Evidence Trail
│   └── sources/              # Global Source Registry Directory
├── docker-compose.yml        # Multi-container setup (Postgres + pgvector + Backend + Frontend)
└── package.json              # Root workspace with concurrently orchestration
```

---

## ⚠️ Official Disclaimer

> **NIYAMVEDA provides source-grounded compliance guidance and does not constitute BIS certification or legal approval. Final compliance must be verified against the applicable official standards and regulatory authorities.**
