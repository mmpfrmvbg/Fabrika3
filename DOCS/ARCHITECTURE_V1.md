# Architecture v1 — Fabrika3

**Canonical v1 architecture** — one consolidation layer for implementation. It **does not** replace the narrower extracts; it **points** to them and states how they fit together.

| Inputs (read before changing this file’s meaning) | Role |
|-----------------------------------------------------|------|
| [`V1_SCOPE.md`](V1_SCOPE.md) | **Hard boundary** — product + technical envelope for v1. |
| [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) | Intent / assumptions / evidence / escalation **without** control-plane machinery. |
| [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) | **Minimal** persistent entities for governed outcomes. |
| [`EVENTS_V1_EXTRACT.md`](EVENTS_V1_EXTRACT.md) | **No** Kafka / orchestrator in v1; naming + state discipline only. |
| [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) | **Surfaces**: Today + Outcome (tabbed). |
| [`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) | **Flows**: daily loop, stops, automation bounds, anti-self-deception. |
| [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §0–§2 | Global rules, defaults, target v1 objects. |

**Honesty note:** If this document ever disagrees with [`V1_SCOPE.md`](V1_SCOPE.md), **`V1_SCOPE.md` wins.** If extracts disagree among themselves, treat extracts as **detail** and fix the smallest inconsistency in extracts or here with an explicit note in [`STATUS.md`](STATUS.md).

---

## 1. Purpose of the v1 architecture doc

- Give Cursor a **single map**: what subsystems exist in v1, what is **governance-only**, what is **application**, and what is **forbidden**.
- Anchor later implementation tasks so they **do not re-import** RFC / ERD / Kafka / full UI operating models by accident.
- Stay a **consolidation**, not a new platform design — no new subsystems beyond what [`V1_SCOPE.md`](V1_SCOPE.md) already allows.

---

## 2. v1 system boundary

**Inside v1**

| Layer | What it is |
|-------|------------|
| **Web app** | Next.js 15 (App Router) + TypeScript + Tailwind v4 + shadcn/ui — per [`V1_SCOPE.md`](V1_SCOPE.md) §2 and repo `package.json`. |
| **Auth (wiring)** | Supabase Auth (SSR helpers, middleware) — optional at runtime if env unset; not a v1 “auth product” beyond session behavior. |
| **Data** | Postgres via Drizzle; **only** the five entities in [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md), with implementation detail in [`DATA_MODEL_V1.md`](DATA_MODEL_V1.md). |
| **Quality** | ESLint, `tsc --noEmit`, Vitest, Playwright smoke — per [`V1_SCOPE.md`](V1_SCOPE.md) and [`DECISIONS.md`](DECISIONS.md) (e.g. Edge e2e **DEC-003**). |
| **Governance (docs)** | [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md), [`STATUS.md`](STATUS.md), [`NEXT_STEP.md`](NEXT_STEP.md), [`DECISIONS.md`](DECISIONS.md), [`INDEX.md`](INDEX.md) — execution spine **outside** the app UI, always authoritative. |

**Outside v1 (forbidden or deferred)**

- Kafka, internal event bus, orchestrator services, transactional outbox to a broker — [`EVENTS_V1_EXTRACT.md`](EVENTS_V1_EXTRACT.md), [`V1_SCOPE.md`](V1_SCOPE.md) §3.
- Product Contract YAML stack, passport/policy engines, change-request FSM product, execution manifests — [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §5, [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) §4.
- Multi-tenant SaaS, billing, marketplace, public API — [`V1_SCOPE.md`](V1_SCOPE.md) §3.

---

## 3. Core v1 building blocks

1. **Governed outcome loop (conceptual)** — Intent → Outcome + assumptions + acceptance → bounded work → minimal evidence → honest readiness — per [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §1 and [`V1_SCOPE.md`](V1_SCOPE.md) §4.  
2. **Persistence slice** — `project` → `outcome` → `assumption` / `acceptance_criterion` / `evidence_item` — [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md).  
3. **Human-facing shell** — **Today** + **Outcome** workspace — [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md).  
4. **Interaction rules** — daily rhythm, mandatory stops, what the product automates vs founder — [`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md).  
5. **Engineering execution** — Cursor, git, CI, hosting (e.g. Vercel) — **environment**, not a modeled subsystem inside the v1 app architecture.

---

## 4. Canonical v1 data model reference

- **Extract baseline:** [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) (why five entities, what the full ERD omitted).  
- **Canonical implementation model:** [`DATA_MODEL_V1.md`](DATA_MODEL_V1.md) — same five tables, plus indexes/FK/delete-policy guidance for Drizzle migrations. **Do not** add tables beyond those two docs + [`V1_SCOPE.md`](V1_SCOPE.md) without updating scope.

---

## 5. Canonical v1 execution / state model

- **Canonical doc:** [`EVENTS_V1.md`](EVENTS_V1.md) — what counts as state vs “event” vocabulary, allowed transitions, docs-only conventions, explicit exclusions. **Extract rationale:** [`EVENTS_V1_EXTRACT.md`](EVENTS_V1_EXTRACT.md).  
- **No** central orchestrator or Kafka-driven FSM in the product — same boundary as the extract; **do not** add broker/outbox “for consistency.”  
- **State** = rows on `outcome`, `assumption`, `acceptance_criterion`, `evidence_item` (+ `project` per [`DATA_MODEL_V1.md`](DATA_MODEL_V1.md)) — plus **honest labels** aligned with governance vocabulary (`not_release_ready`, `working_in_preview`, `verified`, …) surfaced in UI (Readiness tab per [`UI_V1.md`](UI_V1.md)) and [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §2.  
- **Bounded work** for humans and Cursor: exactly what [`NEXT_STEP.md`](NEXT_STEP.md) and [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) say — not `change_request` rows ([`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) §4).  
- **Escalation / stop** behavior: product copy + UI gates per [`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §4 and [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §4 — **not** policy engine automation.

---

## 6. Canonical v1 UI / UX model reference

- **Screens & components (implementation):** [`UI_V1.md`](UI_V1.md) — canonical routes, required elements, key states.  
- **Extract baseline (why those screens):** [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md).  
- **Flows, stops, automation boundaries (behavior, not layout):** [`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) — **do not** duplicate here; do **not** treat UX extract as a second screen list ([`UI_V1.md`](UI_V1.md) tension rule).

---

## 7. Explicit out-of-scope architecture

Consolidated “do not build in v1”:

| Area | Pointer |
|------|---------|
| Message bus / orchestrator / outbox | [`EVENTS_V1_EXTRACT.md`](EVENTS_V1_EXTRACT.md) §3–§6 source omissions |
| Contract & control plane aggregates | [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §5, [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) §4 |
| Rich timeline, tri-mode Explore/Build/Ship product | [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) §4, [`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §8 |
| Runtime assurance mesh | [`V1_SCOPE.md`](V1_SCOPE.md) §3, [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §5 |

---

## 8. Rules for future Cursor work (“build within this architecture”)

1. **Read** [`V1_SCOPE.md`](V1_SCOPE.md) + this file **before** expanding schema, UI, or integrations.  
2. **Obey** [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md), [`STATUS.md`](STATUS.md), [`NEXT_STEP.md`](NEXT_STEP.md) — one active step; update DOCS after meaningful progress ([`INDEX.md`](INDEX.md) §5).  
3. **Persist** only entities from [`DATA_MODEL_V1.md`](DATA_MODEL_V1.md) / [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) unless `V1_SCOPE` / MASTER explicitly expands scope.  
4. **Surface** stops and readiness per [`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) + [`UI_V1.md`](UI_V1.md) + [`RELEASE_CRITERIA_V1.md`](RELEASE_CRITERIA_V1.md); never default-hide `not_release_ready`.  
5. **Do not** add Kafka topics, internal domain-event services, or YAML contract engines “for consistency with RFC” — see [`EVENTS_V1.md`](EVENTS_V1.md) for the v1 state model.  
6. **Prefer** updating extracts + this file **together** when v1 architecture truly changes — avoid silent drift.

---

## 9. Do not assume beyond this architecture

- **Do not assume** `ARCHITECTURE_V1.md` lists every file in `app/` — it describes **allowed shape**, not a directory inventory.  
- **Do not assume** [`RFC.md`](RFC.md), full [`ERD - Data Model.md`](ERD%20-%20Data%20Model.md), or Kafka event docs are implementation specs — they remain **pre-v1** inputs ([`INDEX.md`](INDEX.md) §2).  
- **Do not assume** release labels mean more than [`RELEASE_CRITERIA_V1.md`](RELEASE_CRITERIA_V1.md) defines — `verified` is **narrow** and human-gated.  
- **Do assume** shipping v1 requires **evidence** and **honest readiness** language everywhere the product claims progress ([`V1_SCOPE.md`](V1_SCOPE.md) §4, [`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §7).

---

## Document control

- **Task:** **P4-4.3-architecture** — first §4.3 checkbox after `V1_SCOPE.md`.  
- **§4.3 canonical docs:** **`DATA_MODEL_V1`**, **`EVENTS_V1`**, **`UI_V1`**, **`RELEASE_CRITERIA_V1`** — see [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §4.3; readiness rules: [`RELEASE_CRITERIA_V1.md`](RELEASE_CRITERIA_V1.md).
