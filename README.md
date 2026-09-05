<div align="center">

# ⚖️ NiyamVeda (नियमवेद)
### *From Product to Compliance Clarity*

**Explainable BIS Compliance Intelligence Assistant for Indian MSMEs**  
*Problem Statement SIH26107 · Smart India Hackathon*

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deploy%20Ready-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Build Status](https://img.shields.io/badge/Build-Clean%20%280%20Warnings%29-brightgreen?style=for-the-badge)]()

</div>

---

## 📖 Executive Summary

Navigating Indian regulatory compliance (BIS ISI Marks, MeitY Compulsory Registration Scheme, Quality Control Orders) is notoriously difficult for Micro, Small, and Medium Enterprises (MSMEs). Complex standards, overlapping notifications, and exorbitant consultant fees frequently delay product launches.

**NiyamVeda (नियमवेद)** is an explainable decision intelligence assistant designed specifically to guide Indian hardware creators, manufacturers, and MSMEs from technical product specifications directly to authoritative regulatory clarity.

### 🛡️ Architectural Principle: The Anti-Hallucination Triad
NiyamVeda is **explicitly not a generic conversational chatbot**. In compliance, hallucinations result in legal liability and failed audits. NiyamVeda enforces a strict separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                 1. Structured Product Facts                 │
│      (Voltage, materials, intended use, technical specs)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                2. Deterministic Rule Engine                 │
│       (Evaluates exact thresholds, clauses, & schedules)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          3. Authoritative Evidence Trail (RAG)              │
│    (Curated BIS/MeitY Gazettes, pgvector 768-dim embeddings)│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                4. AI Explanation & Synthesis                │
│    (Gemini synthesizes user-friendly rationales; NEVER law) │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              5. Safe Abstention Gatekeeper                  │
│   (Halts and warns when facts are missing or unstandardized)│
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Production Deployment Architecture

NiyamVeda is architected for clean separation of concerns:
- **Frontend (Next.js 14)**: Hosted on **Vercel** with edge caching and static/dynamic rendering.
- **Backend (FastAPI)**: Hosted on **Render** (Python Web Service with Uvicorn).
- **Database (PostgreSQL)**: Hosted on **Render Managed PostgreSQL** (or Supabase/Neon/RDS).

---

### Part 1: Deploy Backend & Database on Render

1. **Create Managed PostgreSQL Database**:
   - Go to [Render Dashboard](https://dashboard.render.com) > **New** > **PostgreSQL**.
   - Set Name: `niyamveda-db`, Database: `niyamveda_db`, User: `niyamveda`.
   - Copy the **Internal Database URL** (or External Database URL if deploying backend elsewhere).

2. **Deploy Backend Web Service**:
   - Go to **New** > **Web Service** and connect your NiyamVeda GitHub repository.
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     - `DATABASE_URL`: Your Render PostgreSQL database URL
     - `CORS_ORIGIN`: Your Vercel frontend domain (e.g., `https://niyamveda.vercel.app`)
     - `GEMINI_API_KEY`: Your Google AI Gemini API Key (optional for offline mock fallback)
     - `LLM_MODEL`: `gemini-2.5-flash`
     - `EMBEDDING_MODEL`: `text-embedding-004`
     - `EMBEDDING_DIMENSION`: `768`
   - Click **Create Web Service**. The backend will automatically initialize tables and demo seeders on startup via `init_db()`.
   - Copy your backend URL: e.g. `https://niyamveda-api.onrender.com`.

---

### Part 2: Deploy Frontend on Vercel

1. **Import Project to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new) and click **"Import Project"**.
   - Select your NiyamVeda repository.
2. **Configure Project**:
   - **Root Directory**: Select `frontend` (or leave as root with the included `vercel.json`).
   - **Framework Preset**: Automatically detected as **Next.js**.
3. **Set Environment Variable**:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://niyamveda-api.onrender.com`).
   - *(If omitted, the frontend automatically activates offline demo fallback mode with all 12 screens functional).*
4. **Deploy**: Click **Deploy**. Vercel will build and publish your Next.js frontend globally.

---

## ⚡ Quick Start (Local Development)

You can run both the **FastAPI Backend** and the **Next.js 14 Frontend** concurrently with a single command.

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+
- **Python**: v3.10+ (tested on Python 3.11, 3.12, 3.13)
- **Git**

### 2. Setup & Installation

Clone the repository and install all dependencies:

```bash
# Clone repository
git clone https://github.com/your-username/NiyamVeda.git
cd NiyamVeda

# Install root orchestrator and frontend dependencies
npm run install:all

# Install backend dependencies
npm run install:backend
```

### 3. Configure Environment Variables

```bash
# Root & Backend environment
cp .env.example .env

# Frontend environment
cp frontend/.env.example frontend/.env.local
```

### 4. Run Concurrently

In the root directory, execute:

```bash
npm run dev
```

This starts:
- 🚀 **FastAPI Backend**: `http://localhost:8000` (Interactive OpenAPI Docs: `http://localhost:8000/docs`)
- 💻 **Next.js 14 Frontend**: `http://localhost:3000` (Interactive 12-Screen Compliance Portal)

---

## 🛠️ Root Script Reference

| Command | Description |
| :--- | :--- |
| `npm run dev` | Concurrently runs both Backend and Frontend with color-coded logs |
| `npm run dev:frontend` | Runs Next.js frontend in development mode (`port 3000`) |
| `npm run dev:backend` | Runs FastAPI backend with `uvicorn` auto-reload (`port 8000`) |
| `npm run build` | Builds the Next.js production bundle with zero warnings |
| `npm run lint` | Runs ESLint on frontend code checking Next.js Web Vitals |
| `npm run test:backend` | Executes pytest verification suite (`tests/test_core.py`) |
| `npm run install:all` | Installs root dependencies and frontend npm packages |
| `npm run install:backend`| Installs Python dependencies via `pip install -r requirements.txt` |

---

## 🖥️ Screen-by-Screen Feature Tour (12 Dedicated Screens)

NiyamVeda features a complete, highly-polished user experience mapped directly to the SIH26107 architecture:

```
Screen 1: Landing Page (/)
 ├── Screen 2: Product Intake & Fact Extractor (/product/new)
 └── Product Workspace (/product/[id]/...)
      ├── Screen 3: Confirm Product Facts (/confirm)
      ├── Screen 4: Compliance Pathway Dashboard (/analysis)
      ├── Screen 5: Why This Rule Applies (/why-rule)
      ├── Screen 6: Rule Inspector (/rule-inspector)
      ├── Screen 7: Relevant Standards & Evidence (/standards)
      ├── Screen 8: Requirements Checklist (/requirements)
      ├── Screen 9: Pre-Mortem Compliance Risks (/risks)
      ├── Screen 10: What-If Simulation Engine (/simulation)
      ├── Screen 11: Verified Source Registry (/sources)
      └── Screen 12: Safe Abstention Gatekeeper (/abstention)
```

1. **Screen 1 — Landing Page (`/`)**: High-impact portal with regulatory search, key compliance metrics, and direct pathways for MSMEs.
2. **Screen 2 — Guided Technical Fact Intake (`/product/new`)**: 4-stage intake collecting operating voltage, housing materials, intended application, and drag-and-drop specification sheet uploads.
3. **Screen 3 — Fact Confirmation & Provenance (`/product/[id]/confirm`)**: Shows provenance tags (`USER_PROVIDED`, `EXTRACTED_FROM_DOCUMENT`, `INFERRED`) with confidence indicators.
4. **Screen 4 — Compliance Pathway Dashboard (`/product/[id]/analysis`)**: Summarizes certification routes (CRS Scheme, ISI Mark, or Exemption), estimated timeline, testing fees, and a 4-pillar confidence score.
5. **Screen 5 — Why This Rule Applies (`/product/[id]/why-rule`)**: Plain-language legal explanations connecting product characteristics directly to gazette clauses.
6. **Screen 6 — Dual-Panel Rule Inspector (`/product/[id]/rule-inspector`)**: Side-by-side inspection showing deterministic engine logic on the left and exact BIS gazette clause excerpts on the right.
7. **Screen 7 — Applicable Standards Explorer (`/product/[id]/standards`)**: Explores mandatory Indian Standards (e.g., IS 302 Part 1 for Electrical Safety, IS 16240 for Reverse Osmosis).
8. **Screen 8 — Test Protocol Checklist (`/product/[id]/requirements`)**: 14-point audit-ready checklist detailing tests, acceptance thresholds, and laboratory standards.
9. **Screen 9 — Pre-Mortem Risk Analysis (`/product/[id]/risks`)**: Identifies common MSME failure modes (e.g., uncertified power adapters, flammability test failures) before paying laboratory fees.
10. **Screen 10 — What-If Simulation Engine (`/product/[id]/simulation`)**: Interactive simulator allowing engineers to modify voltages, materials, or target markets to instantly view diffs in testing costs and applicable standards.
11. **Screen 11 — Verified Source Registry (`/sources` & `/product/[id]/sources`)**: Authoritative database of BIS standards, MeitY gazette notifications, and QCO orders with official source URLs.
12. **Screen 12 — Safe Abstention Gatekeeper (`/product/[id]/abstention`)**: Explicit safety fallback triggered when technical facts are missing or when an unstandardized technology is detected.

---

## 🐳 Docker Deployment

A multi-container setup is available for local or production deployment with PostgreSQL + pgvector:

```bash
# Build and run all containers (Postgres, pgvector, Backend, Frontend)
docker-compose up --build -d

# View status
docker-compose ps

# Stop containers
docker-compose down
```

---

## 🔬 Quality & Testing Assurance

Both frontend and backend are configured for high reliability and zero warnings:

### Frontend Verification
```bash
cd frontend
npm run lint    # ✔ No ESLint warnings or errors
npm run build   # ✓ Compiled successfully with Next.js App Router static/dynamic traces
```

### Backend Verification
```bash
cd backend
python -m pytest tests/test_core.py -v
# ============================== 4 passed in 0.29s ==============================
```

Tests cover:
- ✅ Demo product seeding & fact provenance verification
- ✅ Deterministic BIS Rule Engine execution & clause matching
- ✅ Orchestrator composite confidence scoring
- ✅ What-If Simulation service diff computation

---

## 🏛️ Authoritative Sources Covered

NiyamVeda indexes and evaluates compliance against official Indian regulatory publications:
- **IS 302 (Part 1): 2008 / IEC 60335-1**: Safety of Household and Similar Electrical Appliances.
- **IS 16240: 2015**: Reverse Osmosis Based Point-of-Use Water Treatment Systems.
- **IS 14543 / IS 13428**: Packaged Drinking Water & Mineral Water Specifications.
- **MeitY CRO Orders (Phase I - V)**: Compulsory Registration Scheme for Electronics & IT Goods.
- **DPIIT Quality Control Orders (QCOs)**: Mandatory certification mandates published under the BIS Act, 2016.

---

## ⚠️ Official Disclaimer

> **NIYAMVEDA provides source-grounded compliance guidance and decision intelligence; it does not constitute official BIS certification or legal approval. Final compliance certification must always be obtained from the Bureau of Indian Standards (BIS) and authorized test laboratories in accordance with the applicable statutory standards.**

---

<div align="center">
  <sub>Built with ❤️ for Indian MSMEs · Smart India Hackathon (SIH26107)</sub>
</div>
