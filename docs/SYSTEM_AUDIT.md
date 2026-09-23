# SYSTEM AUDIT & ARCHITECTURAL BASELINE

**Platform**: NITI AI / YOJAI  
**Audit Date**: September 23, 2026  
**Auditor**: Principal Systems Architect & Security Engineering Group  
**Status**: Initial Full-Stack Baseline Audit Complete  

---

## 1. Executive Summary & Inventory

The repository currently consists of a pnpm monorepo configured with:
* `apps/web`: Next.js 14 App Router (React 18, Tailwind CSS, Framer Motion, Firebase Client SDK, Zustand, Leaflet)
* `packages/ui`: Shared design tokens & constants
* `packages/types`: Shared TypeScript definitions (`UserAccount`, `EntrepreneurProfile`, `BusinessLocation`, `SchemeSummary`, etc.)
* `.github/workflows/deploy-pages.yml`: Automated CI/CD deploying Next.js static export to GitHub Pages.

### Subsystem Baseline Status Matrix
| Subsystem Area | Current Implementation State | Integrity / Gap Analysis |
| :--- | :--- | :--- |
| **Authentication** | Frontend Firebase Client SDK (Email, Google, Apple) with local state sync | **PARTIAL/CLIENT-ONLY**: Client signs in and updates Zustand. No backend session verification endpoint or Cloudflare token exchange. |
| **User Profile & Persistence** | Zustand store persisting to `localStorage` | **CLIENT-MOCKED**: Profiles are saved into `localStorage` (`profile_${uid}`). No remote persistent transactional database (Cloudflare D1 / Firestore). |
| **Location & Map** | Interactive Pinpoint & Coordinate standardizer | **CLIENT-ONLY**: Resolves coordinates and standardizes State/District, but does not query geographic scheme availability API. |
| **Government Scheme Database** | Types defined in `@niti-ai/types` | **UNCONNECTED**: Scheme database schema exists in types, but seed data, JSON repository, and scheme search/detail routes (`/schemes`, `/schemes/[slug]`) are not yet instantiated in `apps/web`. |
| **Eligibility & Recommendations** | Rule criteria typed | **UNCONNECTED**: Score calculation exists only for profile completeness; recommendation scoring engine not attached. |
| **AI / RAG / Chatbot** | Architecture specified in PDFs | **UNCONNECTED**: No chat UI routes (`/chat`), streaming endpoints, local LLM connectors, or vector index files implemented. |
| **Backend / Edge Workers** | Architecture specified | **UNCONNECTED**: Monorepo does not yet have `apps/worker` with Cloudflare D1 migrations or REST API handlers. |
| **Security & Authorization** | Client `AuthGuard` | **PARTIAL**: Client routes are guarded, but backend RBAC and token validation layer are missing. |

---

## 2. Detailed Subsystem Analysis

### 2.1 Frontend (`apps/web`)
* **Routes Active**:
  * `/`: Landing page with hero, statistics ticker, features, and dynamic header session detection.
  * `/auth/signin`: Google, Apple, and Email authentication page.
  * `/auth/signup`: Account registration page with initial profile creation trigger.
  * `/dashboard`: Authenticated dashboard presenting profile readiness metrics and quick actions.
  * `/onboarding`: 5-step wizard (Personal, Enterprise, Capital, Location, Review) with profile completeness calculation.
* **Integrity Findings**:
  * All active frontend pages compile cleanly with strict TypeScript and ESLint.
  * Deep obsidian dark background (`#020617`), contrast typography, and custom black cursor are verified.
  * Custom SVGs for Apple, Google 'G' letter, and Google watermark are integrated without external image requests.

### 2.2 Data Layer & Redundancy Audit
* **Duplicate Detection**:
  * User profile persistence currently writes to `localStorage.setItem('profile_' + uid)`. If a user logs in on a new device/browser, their profile is missing.
  * In Phase 4-5, this must transition to an idempotent backend upsert (`INSERT INTO profiles (user_id, ...) ON CONFLICT(user_id) DO UPDATE ...`).
* **Firestore / Database Rules**:
  * No Firestore instance is currently reading/writing documents from the client; auth is currently handled via Firebase Auth.
  * If Firestore is connected, a deny-by-default `firestore.rules` must be applied and tested with emulator tests.

### 2.3 AI, RAG & Search Pipeline
* **Local LLM & Commercial API Check**:
  * Scanned codebase for unauthorized commercial API keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `COHERE_API_KEY`, etc.): **Zero found**.
  * RAG retriever and hybrid search modules need to be implemented in a dedicated service or edge worker with local fallback.

---

## 3. Immediate Remediation & Build Order

To transition the platform from client-state prototype to production-grade end-to-end integration:

1. **Step 1**: Establish `docs/CONNECTION_MATRIX.md` and `docs/DATA_INTEGRITY_REPORT.md`.
2. **Step 2**: Implement the **Scheme Database & Ingestion Engine** (`data/schemes` + `@niti-ai/types` + `/schemes` explorer route).
3. **Step 3**: Implement the **Deterministic Rule-Based Eligibility & Recommendation Engine** evaluating real scheme criteria against entrepreneur parameters.
4. **Step 4**: Implement the **Self-Hosted Multilingual AI Chat & Comparison Assistant** (English, Hindi, Hinglish) with strict grounding, prompt injection defenses, and zero commercial API leaks.
5. **Step 5**: Create end-to-end integration tests verifying the full chain:
   $$\text{Auth} \rightarrow \text{Profile} \rightarrow \text{Eligibility} \rightarrow \text{RAG/Search} \rightarrow \text{Chatbot} \rightarrow \text{UI}$$
