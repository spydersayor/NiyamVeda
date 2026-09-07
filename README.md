<div align="center">

# ⚖️ NiyamVeda (नियमवेद)
### *From Product to Compliance Clarity*

**Explainable BIS Compliance Intelligence Assistant for Indian MSMEs**  
*Problem Statement SIH26107 · Smart India Hackathon*

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deploy%20Ready-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Responsive%20Ready-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20%E0%A4%B9%E0%A4%BF%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80%20%7C%20%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE-orange?style=for-the-badge)]()
[![Tests](https://img.shields.io/badge/Tests-150%2B%20Passing-brightgreen?style=for-the-badge&logo=pytest&logoColor=white)]()

</div>

---

## 📖 Executive Summary

Navigating Indian regulatory compliance (BIS ISI Marks, MeitY Compulsory Registration Scheme, Quality Control Orders) is notoriously challenging for Micro, Small, and Medium Enterprises (MSMEs). Complex standards, overlapping gazette notifications, and exorbitant consultant fees frequently delay hardware product launches.

**NiyamVeda (नियमवेद)** is an explainable decision intelligence assistant designed specifically to guide Indian hardware creators, manufacturers, and MSMEs from raw technical product specifications directly to authoritative regulatory clarity with zero hallucinations.

---

## 🛡️ Architectural Principle: The Anti-Hallucination Triad

NiyamVeda is **explicitly not a generic conversational chatbot**. In legal and compliance contexts, generative hallucinations cause failed audits and regulatory penalties. NiyamVeda enforces a strict separation of concerns:

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

## ✨ Key Platform Capabilities

### 1. Robust Authentication & User Identity System
- **Database-Backed Persistence**: Fully integrated with PostgreSQL `users` and `sessions` tables (with SHA-256 server-side session token hashing).
- **Required Username Identity**:
  - `VARCHAR(30)` database constraint matching frontend and Pydantic validation (3–30 characters).
  - Database-level case-insensitive uniqueness constraint: `CREATE UNIQUE INDEX idx_users_username_lower ON users (LOWER(username));`.
  - Collision-proof: `Rishi`, `rishi`, and `RISHI` are recognized as the same user and duplicates are rejected.
  - Safe migration algorithm that sanitizes and backfills legacy records with deterministic suffixes (`_1`, `_2`) without data loss or corruption.
  - Regex: `^[A-Za-z0-9_]{3,30}$`.
- **Strict Full Name Validation**:
  - Validates against `^[A-Za-z]+(?: [A-Za-z]+)*$`.
  - Strictly accepts only English letters with single spaces between words (rejects numbers, symbols, double spaces, leading/trailing spaces, and tabs without silent mutation).
  - Validated independently on both frontend (instant UI feedback) and backend (Pydantic validator).
- **Top Identity Display**: Shows `username` in the top navbar and mobile menu with safe fallback to display name.
- **Profile Hub (`/profile`)**: Displays distinct Username (`@username`) and Full Name cards, joined date, account security badges, and active projects.
- **1-Click Demo Evaluation Mode**: Instant examiner sign-in as `Rajesh Kumar Sharma` (`rajesh_sharma`), with absolute zero demo fallback on genuine authentication errors.

### 2. Tri-Lingual Localization (EN · HI · BN)
- Complete native translation across **English**, **Hindi (हिन्दी)**, and **Bengali (বাংলা)**.
- Integrated `useTranslation()` context covering navigation, auth forms, validation alerts, compliance checklists, standards, profile, and AI assistant.

### 3. Complete Mobile & Tablet Responsive Architecture
- Fully responsive from **320px mobile viewports** up to **4K desktop displays** with zero page-level horizontal overflow (`max-w-full`).
- Collapsible mobile navigation drawer with hamburger toggle, language switcher, and theme controls.
- Responsive `ProductSidebar` that converts from a 56px fixed vertical desktop bar into a sleek, touch-friendly horizontal tab navigation on smaller viewports.
- Responsive data tables with dedicated horizontal scrolling wrappers (`min-w-[600px]`) preserving column alignment.

### 4. Interactive What-If Simulation Engine
- Modify operating voltages (e.g., `230V AC → 110V AC`), housing materials (e.g., `Polycarbonate → Flame-Retardant ABS`), or intended use (`Domestic → Commercial`).
- Real-time diff calculation showing added, retained, and removed standards, laboratory test protocol changes, and certification cost impacts.

### 5. Conversational Regulatory Assistant & Drawer
- Grounded regulatory chat widget (`AssistantDrawer`) and dedicated `/assistant` page powered by Google Gemini.
- Grounded strictly in indexed BIS/MeitY gazette corpora with built-in safe abstention when information is outside domain knowledge.

### 6. Dual Theme Support
- Instant dark and light theme switching with CSS design tokens and smooth transitions.

---

## 🖥️ Screen-by-Screen Feature Tour (14 Dedicated Views)

```
NiyamVeda Application Map
 ├── Landing Page (/)
 ├── Authentication (/auth) [Login, Register, Demo Mode]
 ├── Profile & Identity (/profile)
 ├── Regulatory Assistant (/assistant)
 ├── Verified Sources Registry (/sources)
 ├── About NiyamVeda (/about)
 ├── How It Works (/how-it-works)
 ├── Product Creation Intake (/product/new)
 └── Product Workspace (/product/[id]/...)
      ├── Confirm Facts (/confirm)
      ├── Compliance Dashboard (/analysis)
      ├── Why This Rule Applies (/why-rule)
      ├── Dual-Panel Rule Inspector (/rule-inspector)
      ├── Relevant Standards & Evidence (/standards)
      ├── Audit-Ready Requirements (/requirements)
      ├── Pre-Mortem Risk Analysis (/risks)
      ├── What-If Simulation Engine (/simulation)
      ├── Product Sources (/sources)
      └── Safe Abstention Gatekeeper (/abstention)
```

1. **Landing Page (`/`)**: High-impact portal with regulatory search, key compliance metrics, and direct pathways for MSMEs.
2. **Authentication (`/auth`)**: Clean dark-themed login & registration form featuring Full Name, Username (`@`), MSME Company Name, Email, and Password with real-time format validation.
3. **User Profile (`/profile`)**: Account overview displaying Username, Full Name, joined date, security badges, and active product assessments.
4. **Product Intake (`/product/new`)**: 4-stage intake collecting operating voltage, housing materials, intended application, and specification sheet uploads.
5. **Fact Confirmation & Provenance (`/product/[id]/confirm`)**: Shows provenance tags (`USER_PROVIDED`, `EXTRACTED_FROM_DOCUMENT`, `INFERRED`) with confidence indicators.
6. **Compliance Dashboard (`/product/[id]/analysis`)**: Summarizes certification routes (CRS Scheme, ISI Mark, or Exemption), estimated timeline, testing fees, and a 4-pillar confidence score.
7. **Why This Rule Applies (`/product/[id]/why-rule`)**: Plain-language legal explanations connecting product characteristics directly to gazette clauses.
8. **Rule Inspector (`/product/[id]/rule-inspector`)**: Side-by-side inspection showing deterministic engine logic on the left and exact BIS gazette clause excerpts on the right.
9. **Applicable Standards (`/product/[id]/standards`)**: Explores mandatory Indian Standards (e.g., IS 302 Part 1 for Electrical Safety, IS 16240 for Reverse Osmosis).
10. **Requirements Checklist (`/product/[id]/requirements`)**: 14-point audit-ready checklist detailing tests, acceptance thresholds, and laboratory standards.
11. **Risk Analysis (`/product/[id]/risks`)**: Identifies common MSME failure modes (e.g., uncertified power adapters, flammability test failures) before paying laboratory fees.
12. **What-If Simulation (`/product/[id]/simulation`)**: Interactive simulator allowing engineers to modify product facts and view changes in testing costs and standards.
13. **Source Registry (`/sources` & `/product/[id]/sources`)**: Authoritative database of BIS standards, MeitY gazette notifications, and QCO orders with official links.
14. **Safe Abstention (`/product/[id]/abstention`)**: Explicit safety fallback triggered when technical facts are missing or when an unstandardized technology is detected.

---

## ⚡ Quick Start (Local Development)

Run both the **FastAPI Backend** and the **Next.js 14 Frontend** concurrently with a single command.

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+
- **Python**: v3.11+ (tested on Python 3.11, 3.12, 3.13)
- **PostgreSQL**: v14+ (local service or managed cloud instance)
- **Git**

### 2. Setup & Installation

```bash
# Clone repository
git clone https://github.com/spydersayor/NiyamVeda.git
cd NiyamVeda

# Install root orchestrator and frontend dependencies
npm run install:all

# Install backend Python dependencies
npm run install:backend
```

### 3. Environment Configuration

```bash
# Root & Backend environment
cp .env.example .env

# Frontend environment
cp frontend/.env.example frontend/.env.local
```

Make sure `DATABASE_URL` in `.env` points to your PostgreSQL database (e.g. `postgresql://postgres:postgres@localhost:5432/niyamveda_db`).

### 4. Run Concurrently

In the root directory, execute:

```bash
npm run dev
```

This concurrently boots:
- 🚀 **FastAPI Backend**: `http://localhost:8000` (Interactive Swagger Docs: `http://localhost:8000/docs`)
- 💻 **Next.js 14 Frontend**: `http://localhost:3000` (Full Multi-Page Compliance Portal)

---

## 🛠️ Root Script Reference

| Command | Description |
| :--- | :--- |
| `npm run dev` | Concurrently runs both Backend and Frontend with color-coded logs |
| `npm run dev:frontend` | Runs Next.js frontend in development mode (`port 3000`) |
| `npm run dev:backend` | Runs FastAPI backend with `uvicorn` auto-reload (`port 8000`) |
| `npm run build` | Builds the Next.js production bundle with zero warnings |
| `npm run lint` | Runs ESLint on frontend code checking Next.js Web Vitals |
| `npm run test:backend` | Executes pytest verification suite (`tests/`) |
| `npm run install:all` | Installs root dependencies and frontend npm packages |
| `npm run install:backend`| Installs Python dependencies via `pip install -r requirements.txt` |

---

## 🚀 Production Deployment Architecture

NiyamVeda is architected for high-performance cloud deployment:
- **Frontend (Next.js 14)**: Hosted on **Vercel** with edge caching and static page optimization.
- **Backend (FastAPI)**: Hosted on **Render** (Python Web Service with Uvicorn).
- **Database (PostgreSQL)**: Hosted on **Render Managed PostgreSQL** (or Supabase/Neon/RDS).

### Backend on Render
1. Create a **Managed PostgreSQL** database on Render (`niyamveda-db`).
2. Create a **Web Service** connecting your repository:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     - `DATABASE_URL`: Connection string from PostgreSQL instance
     - `CORS_ORIGIN`: Your Vercel domain (e.g., `https://niyamveda.vercel.app`)
     - `GEMINI_API_KEY`: Google AI Gemini API Key (optional for mock fallback)

### Frontend on Vercel
1. Import repository into Vercel and select `frontend` directory.
2. Set Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://niyamveda-api.onrender.com`).
3. Deploy! Next.js will build and deploy the application globally.

---

## 🔬 Quality Assurance & Automated Testing

Both frontend and backend are maintained with strict quality gates:

### Backend Test Suite (150+ Tests)
```bash
cd backend
python -m pytest tests/ -v
# ======================= 150 passed, 6 warnings in 2.00s =======================
```

The test suite thoroughly validates:
- ✅ **Authentication & Session Lifecycle**: Registration, login, session expiry, token hashing, and logout.
- ✅ **Security Integrity**: Unknown emails and invalid passwords strictly return 401 and never fall back to demo accounts.
- ✅ **Full Name Validation**: Valid names accepted; numbers, underscores, double spaces, and symbols rejected.
- ✅ **Username Validation**: Length 3–30, allowed characters `[A-Za-z0-9_]`, and rejection of special characters.
- ✅ **Case-Insensitive Uniqueness**: `Rishi`, `rishi`, and `RISHI` duplicate collisions rejected with HTTP 400.
- ✅ **Safe User Migration**: Automatic backfill verifying email sanitization, length boundaries, and deterministic suffix collision resolution.
- ✅ **RFC Email Normalization**: Structural RFC validation, whitespace stripping, and case normalization.
- ✅ **Compliance Engine**: Product fact extraction, rule evaluation, and what-if simulation diffs.

### Frontend Quality Verification
```bash
cd frontend
npx tsc --noEmit   # ✔ 0 TypeScript compile errors
npm run build      # ✓ Compiled successfully with Next.js App Router (12/12 routes static/dynamic)
```

---

## 🏛️ Authoritative Indian Standards Covered

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
