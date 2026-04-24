# Event model → v1 minimal extract

**v1-only.** This document records what, if anything, from [`event schema для Kafka queue-оркестратора.md`](<event schema для Kafka queue-оркестратора.md>) applies to **Fabrika3 v1**, under [`V1_SCOPE.md`](V1_SCOPE.md) and [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md).

**Bottom line for v1:** there is **no** in-product **Kafka**, **topics**, **consumer groups**, **orchestrator service**, or **transactional outbox → broker** pipeline. The source document is **future-state control-plane architecture**, not a v1 backlog.

---

## 1. Purpose of the v1 “event model”

- Prevent accidental import of **bus / orchestrator** concepts into v1 code or schema “because the doc exists.”
- Preserve only **ideas that remain useful** as **naming and state discipline** when updating [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) entities and [`STATUS.md`](STATUS.md).
- Satisfy `MASTER_TODO_CURSOR.md` §4.2 — *extract from event schema only what v1 needs* — answer honestly: **v1 needs almost none of the catalog as infrastructure**; it needs **clarity**, not new runtime.

---

## 2. What event concepts are retained in v1

These are **retained as conventions / vocabulary**, not as Kafka payloads or services.

| Concept (from source doc) | Retained in v1 as |
|---------------------------|-------------------|
| **Command vs event** (§1.1) | **Documentation discipline:** *commands* = requested actions (may fail); *events* = facts that already happened (immutable record). In v1 this maps to **UI actions** + **DB row updates** / history tables later — **not** to message types on a bus. |
| **Domain-first names** (§1.3 examples) | **UX and log copy** — prefer names like “verification failed” over opaque pipeline steps when surfacing errors to the solo founder ([`V1_SCOPE.md`](V1_SCOPE.md) §4). |
| **Assumption / evidence / readiness language** | Aligns with [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) (`assumption`, `evidence_item`, `outcome.release_readiness_*`) and [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) escalation table — expressed as **fields and statuses**, not as `*.events` topics. |

**Not retained as v1 product artifacts:** universal JSON **envelope** (§2), `event_type` / `event_version` strings as shipped infrastructure, `partition_key`, `correlation_id` chains across services — **none** of that is required for v1.

---

## 3. What is explicitly out of scope for v1

All of the following come from the source document and are **out of v1** per [`V1_SCOPE.md`](V1_SCOPE.md) §3 (Kafka / orchestration / control plane) and [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §5:

| Source area | Out of v1 |
|-------------|-----------|
| **Topics / queues** (§3) — `orchestrator.commands`, `*.events`, DLQ, `audit.events` | No Kafka topics, no internal queue product. |
| **Full domain event catalog** (§4.1–4.12) — intent/contract/policy/change/execution/verification/release/runtime streams | Not implemented as event-sourced microservices or bus contracts. |
| **Orchestrator command set** (§5) — ResolveAssumptions, StartExecutionRun, DeployReleaseCandidate, … | No orchestrator; Cursor + DOCS + app CRUD replace this envelope. |
| **Partitioning / ordering strategy** (§6) | Irrelevant without a broker. |
| **Consumer idempotency tables** (§7) | Irrelevant without consumers. |
| **Happy / negative path as Kafka sequences** (§8–9) | May inspire **test narratives** or **manual checklists** only. |
| **Transactional outbox + Kafka publication** (§10) | Explicitly excluded. |
| **Consumer groups** (§11) | Excluded. |
| **Dedicated audit event stream** (§12) | Optional far future; v1 uses **git + DOCS + DB timestamps** at most. |
| **“12 mandatory events” + meta `change.state_transitioned`** (§13) | **Not** a v1 implementation checklist — it is an orchestrator completeness sketch for a **different** product generation. |

---

## 4. Minimal event/state transitions that matter **now**

For v1, “events” are **state transitions on persisted entities** (see [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md)), not broker messages. The **minimal** set that matters for honesty and UX:

| Transition (conceptual) | Where it lives in v1 |
|-------------------------|----------------------|
| Outcome **draft → active → blocked → done / abandoned** | `outcome.status` |
| Assumption **open / needs_human_decision → approved / rejected** | `assumption.status` (+ optional `resolution_note`) |
| Acceptance **pending → satisfied / failed / waived** | `acceptance_criterion.status` |
| Evidence item **draft → valid / stale** | `evidence_item.status` |
| Release readiness text / verdict on an outcome | `outcome.release_readiness` + `release_readiness_note` |

No separate **change_request** FSM table is required in v1 for these transitions to be meaningful ([`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) §4).

---

## 5. What stays **docs-only** conventions for now

- **Correlation / causation chains**, **idempotency keys**, **partition keys** — useful for a future bus; **docs-only** for v1.  
- **`change.state_transitioned` as a meta-event** — **docs-only** mental model; if replay/audit is needed later, design explicitly outside v1.  
- **Command catalog** (source §5) — **docs-only**; actual “commands” are user actions + server handlers, bounded by [`NEXT_STEP.md`](NEXT_STEP.md).  
- **Happy path / negative path event lists** (source §8–9) — optional **QA checklists** or Playwright scenario titles — **not** schema to implement as Kafka payloads.

---

## 6. Future event-bus concepts intentionally deferred

Defer to **post-v1** unless `V1_SCOPE` / MASTER is formally revised:

- Kafka (or any) **broker**, **topics**, **partitions**, **consumer groups**.  
- **Transactional outbox** and **exactly-once** side-effect processing across services.  
- **Orchestrator FSM** driven by a **central event log** with replay as product infrastructure.  
- **Runtime assurance** event mesh (`runtime.signal_detected`, `drift.detected`, `rollback.triggered` as bus contracts).  
- **Normalized `audit.events` stream** replicated from operational topics.

If any of the above becomes necessary, it belongs in a **new phase** with explicit architecture docs (`ARCHITECTURE_V1`, `EVENTS_V1` in MASTER §4.3 sense) — **not** in this extract.

---

## 7. Do not assume Kafka / orchestrator exists in v1

- **Do not assume** topics from the source doc exist or should be created “for cleanliness.”  
- **Do not assume** the “12 mandatory events” list is a v1 MVP requirement — it is **orchestrator completeness**, not Fabrika3 v1 scope.  
- **Do not assume** `workspace_id` / `change_request_id` from sample envelopes map to v1 DB tables — many IDs in the source doc map to **ERD control-plane** tables explicitly **omitted** in [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) §4.  
- **Do assume** [`V1_SCOPE.md`](V1_SCOPE.md) and [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §0: **no Kafka in running product v1**; **no platform-before-v1**.

When implementing persistence, use **[`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md)** — not the Kafka event catalog — as the data reference.

---

## Document control

- **Task:** **P4-4.2-event-extract** — `MASTER_TODO_CURSOR.md` §4.2 third checkbox.  
- **Does not start:** §4.2 UI / UX rows, §4.3 canonical `EVENTS_V1.md` (different artifact).
