# Events & state model v1 — Fabrika3

**Canonical v1 event/state discipline** for implementation. This is **not** a Kafka design, **not** a domain-event catalog for a broker, and **not** a replayable orchestrator log.

| Authority | Role |
|-----------|------|
| [`V1_SCOPE.md`](V1_SCOPE.md) | **Wins** on exclusions — no broker, no distributed orchestration in v1 ([`V1_SCOPE.md`](V1_SCOPE.md) §3). |
| [`ARCHITECTURE_V1.md`](ARCHITECTURE_V1.md) | **System boundary** — §5 execution/state; this file is the **narrow operational** companion. |
| [`DATA_MODEL_V1.md`](DATA_MODEL_V1.md) | **Where** allowed states live — column enums on the five tables. |
| [`EVENTS_V1_EXTRACT.md`](EVENTS_V1_EXTRACT.md) | **Rationale** from the Kafka-oriented source doc — what was stripped; **not** repeated line-for-line here. |

**Tension rule:** If [`EVENTS_V1_EXTRACT.md`](EVENTS_V1_EXTRACT.md) reads like it implies infrastructure (topics, consumers, replay), **prefer [`V1_SCOPE.md`](V1_SCOPE.md) + this file** — v1 “events” are **facts after DB commit** (row state), not bus messages.

---

## 1. Purpose of the v1 event/state model doc

- Give implementers and reviewers a **single place** to answer: “What counts as an event in v1, and what is forbidden?”
- Map **useful vocabulary** from the exploratory Kafka doc (command vs fact, domain-first naming) onto **app + Postgres + DOCS** — without importing runtime from [`event schema для Kafka queue-оркестратора.md`](<event schema для Kafka queue-оркестратора.md>).
- Prevent **accidental scope creep**: no internal event bus, no outbox table “just in case,” no topic naming in env vars for v1.

---

## 2. What event/state concepts exist in v1

**In v1, “state” is authoritative; “events” are informal language for transitions that result in persisted state.**

| Layer | Meaning |
|-------|---------|
| **Authoritative state** | Column values on `project`, `outcome`, `assumption`, `acceptance_criterion`, `evidence_item` per [`DATA_MODEL_V1.md`](DATA_MODEL_V1.md). A user or API handler **updates rows**; there is no separate v1 **event store** product. |
| **Command vs event (discipline)** | **Command** = requested change (may fail validation). **Event (colloquial)** = **after** a successful write — the new row snapshot is the fact. This maps to **server actions** + **transactions**, not to message types. |
| **Naming / UX** | Prefer domain language (“assumption needs decision,” “evidence stale”) over pipeline jargon when surfacing errors ([`V1_SCOPE.md`](V1_SCOPE.md) §4, [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §2 tone). |
| **Governance loop outside the DB** | [`STATUS.md`](STATUS.md), [`NEXT_STEP.md`](NEXT_STEP.md), [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) — **docs state** for Cursor/human execution; not normalized as v1 product tables unless scope explicitly adds them ([`DATA_MODEL_V1.md`](DATA_MODEL_V1.md) §4). |

**Not v1 “event concepts”:** shipped `event_type` / `event_version` strings, partition keys, correlation-id chains across services, mandatory “12 events” checklists from the Kafka sketch — those remain **pre-v1** or **post-v1** only ([`EVENTS_V1_EXTRACT.md`](EVENTS_V1_EXTRACT.md) §2–§3).

---

## 3. Minimal state transitions that matter now

These are the **transitions product logic and UI should respect** (align enums with [`DATA_MODEL_V1.md`](DATA_MODEL_V1.md) / [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md)):

| Area | Transitions (conceptual) | Persisted as |
|------|--------------------------|--------------|
| **Outcome lifecycle** | draft → active → blocked → done or abandoned | `outcome.status` |
| **Release honesty** | not_assessed ↔ not_release_ready ↔ working_in_preview ↔ verified | `outcome.release_readiness` + optional `release_readiness_note` |
| **Assumptions** | open / auto_defaulted / needs_human_decision → approved or rejected | `assumption.status` (+ `resolution_note`, `resolved_at` when closing) |
| **Acceptance** | pending → satisfied, failed, or waived | `acceptance_criterion.status` |
| **Evidence** | draft → valid; valid → stale when superseded or upstream changed | `evidence_item.status` |
| **Project** | active ↔ archived | `project.status` |

**Implementation note:** Prefer **one transaction per user-visible action** that touches related rows (e.g. closing an assumption and updating outcome readiness) so the UI never shows half-applied “events.”

---

## 4. Transitions that are docs/app-level conventions only

| Convention | v1 treatment |
|--------------|--------------|
| **Cursor Run** as a lifecycle object | Tracked in **DOCS + git** ([`DATA_MODEL_V1.md`](DATA_MODEL_V1.md) §4); **no** `cursor_run` table required for honesty in v1. |
| **Meta “change.state_transitioned”** | Mental model / future audit — **not** a v1 table or internal bus topic ([`EVENTS_V1_EXTRACT.md`](EVENTS_V1_EXTRACT.md) §5). |
| **Orchestrator command catalog** (ResolveAssumptions, StartExecutionRun, … from source doc) | **Narrative / checklist** only; real “commands” = **bounded** work described in [`NEXT_STEP.md`](NEXT_STEP.md). |
| **Correlation / idempotency / partition keys** | **Deferred** — add only with an explicit post-v1 architecture task ([`EVENTS_V1_EXTRACT.md`](EVENTS_V1_EXTRACT.md) §5). |
| **Happy/negative path as Kafka sequences** | May inspire **Playwright titles** or manual QA lists — **not** schema. |

**App-level (optional, not canonical infrastructure):** in-memory React state, toast notifications, or **client-only** optimistic UI — must **reconcile** to DB on success/failure; they are **not** additional sources of truth.

---

## 5. Future event-bus / orchestrator concepts explicitly out of scope

Until [`V1_SCOPE.md`](V1_SCOPE.md) / MASTER is revised, **do not implement** as v1 product infrastructure:

- **Broker:** Kafka or any message bus, topics, partitions, consumer groups, DLQ replication patterns.  
- **Transactional outbox → broker**, exactly-once cross-service processing.  
- **Central orchestrator FSM** fed by a replayable domain-event log.  
- **Normalized audit event stream** (`audit.events` style) as a first-class replicated pipeline.  
- **Runtime assurance mesh** as event contracts (`runtime.signal_detected`, `drift.detected`, … as bus types).  
- **Full RFC §3 FSM** as an engine — [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §5; v1 stays **simple statuses** + DOCS.

---

## 6. How future Cursor work should use this doc

1. **Before** adding `lib/events`, outbox tables, `emitX`, or “domain events” packages: read this file and [`EVENTS_V1_EXTRACT.md`](EVENTS_V1_EXTRACT.md) §3 — default answer is **no**.  
2. **When** changing lifecycle or readiness: update **enum handling** in app code and keep **[`DATA_MODEL_V1.md`](DATA_MODEL_V1.md)** in sync if allowed values change; do **not** add parallel “event type” registries.  
3. **When** UX needs a timeline: prefer **querying rows** (`ORDER BY updated_at`) or a **thin read model** in the same Postgres — not a new topic.  
4. **Escalation / stop** flows: follow [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §4 and [`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) — surface blockers in UI + DOCS; **no** policy engine or event-driven stop service.  
5. After meaningful changes to state rules: update [`STATUS.md`](STATUS.md) / [`NEXT_STEP.md`](NEXT_STEP.md) per [`INDEX.md`](INDEX.md) §5.

---

## 7. Do not assume beyond this event model

- **Do not assume** a Kafka topic list, consumer deployment, or env-based broker config is part of v1.  
- **Do not assume** the exploratory event-schema document is an implementation checklist — it is **input history** only.  
- **Do not assume** every state change needs a persisted “event row” or changelog table; v1 **minimum** is **current row state** + timestamps ([`DATA_MODEL_V1.md`](DATA_MODEL_V1.md)).  
- **Do not assume** [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) `change_request` or execution tables exist to justify event sourcing — they are **out** for v1.  
- **Do assume** honesty gates (assumptions, acceptance, evidence, readiness) are enforced through **UI + DB fields** aligned with [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) and [`ARCHITECTURE_V1.md`](ARCHITECTURE_V1.md).

---

## Document control

- **Task:** **P4-4.3-events** — `DOCS/MASTER_TODO_CURSOR.md` §4.3 строка `EVENTS_V1.md`.  
- **§4.3 follow-on (other tasks):** [`UI_V1.md`](UI_V1.md), [`RELEASE_CRITERIA_V1.md`](RELEASE_CRITERIA_V1.md) — see [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §4.3; current **`NEXT_STEP.md`** for active phase.
