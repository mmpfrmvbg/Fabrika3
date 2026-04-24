# DOCS index — Fabrika3

This file is the **entrypoint** to the documentation system under `DOCS/`. Use it at the start of each work session so execution stays aligned with the canonical backlog and honest project state.

---

## 1. Purpose of `DOCS/`

- Hold the **ordered backlog**, **current status**, **single next action**, and **decision log** for the repo.
- Hold **templates** and **conceptual drafts** (RFC, ERD, UX notes) that feed later v1 specs — they are **not** execution truth until extracted into canonical v1 docs (see `MASTER_TODO_CURSOR.md` §4.2–§4.3).
- Give Cursor and humans one place to see **what to read first** and **what to update after meaningful progress**.

---

## 2. Source of truth vs supporting references

| Tier | Role | Files |
|------|------|--------|
| **Primary (source of truth for execution)** | Backlog order, current phase/task, next action, recorded decisions, **v1 scope + system + persistence + state + UI + release honesty** | [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md), [`V1_SCOPE.md`](V1_SCOPE.md), [`ARCHITECTURE_V1.md`](ARCHITECTURE_V1.md), [`DATA_MODEL_V1.md`](DATA_MODEL_V1.md), [`EVENTS_V1.md`](EVENTS_V1.md), [`UI_V1.md`](UI_V1.md), [`RELEASE_CRITERIA_V1.md`](RELEASE_CRITERIA_V1.md), [`STATUS.md`](STATUS.md), [`NEXT_STEP.md`](NEXT_STEP.md), [`DECISIONS.md`](DECISIONS.md) |
| **Navigation (meta)** | How to use `DOCS/`; reading order | [`INDEX.md`](INDEX.md) *(this file)* |
| **Templates** | Copy/paste starters; not live state | [`STATUS_TEMPLATE.md`](STATUS_TEMPLATE.md), [`NEXT_STEP_TEMPLATE.md`](NEXT_STEP_TEMPLATE.md), [`DECISIONS_TEMPLATE.md`](DECISIONS_TEMPLATE.md) |
| **Conceptual / pre-v1** | Ideas and sketches **until** promoted by §4.2–§4.3 | `RFC.md`, `ERD - Data Model.md`, `UI.MD`, `User Expiriens.md`, `event schema для Kafka queue-оркестратора.md` |

**Repo root (outside `DOCS/`)** that still governs Cursor behavior: [`../KICKOFF.md`](../KICKOFF.md), [`../AGENTS.md`](../AGENTS.md), [`.cursor/rules/`](../.cursor/rules/).

---

## 3. Recommended reading order before each Cursor session

Read **in this order** (stop early only if the task explicitly limits scope to a subset):

1. [`../KICKOFF.md`](../KICKOFF.md) — execution contract for Cursor.
2. **`DOCS/INDEX.md`** (this file) — orientation.
3. [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) — phases, definitions of done, default decisions.
4. [`STATUS.md`](STATUS.md) — current phase, task, blockers, evidence.
5. [`NEXT_STEP.md`](NEXT_STEP.md) — exactly one recommended next action.
6. [`DECISIONS.md`](DECISIONS.md) — defaults and constraints already chosen.
7. [`V1_SCOPE.md`](V1_SCOPE.md) — what v1 includes / excludes before **product** implementation work.
8. [`ARCHITECTURE_V1.md`](ARCHITECTURE_V1.md) — **after `V1_SCOPE`**, before deep feature work: canonical **v1 system** map (consolidates extracts).
9. [`DATA_MODEL_V1.md`](DATA_MODEL_V1.md) — **when writing migrations / Drizzle schema** for product data: canonical **five tables** + indexes (narrows `ERD_V1_EXTRACT`).
10. [`EVENTS_V1.md`](EVENTS_V1.md) — **when adding lifecycle, readiness, or tempted by buses/outbox**: canonical **v1 state transitions** (no Kafka product path).
11. [`UI_V1.md`](UI_V1.md) — **when implementing routes / screens**: canonical **Today + Outcome** (+ optional index); narrows `UI_V1_EXTRACT`.
12. [`RELEASE_CRITERIA_V1.md`](RELEASE_CRITERIA_V1.md) — **when setting readiness / claiming verified / preview**: L1–L3 gates, evidence, human approvals.
13. [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) — when work touches intent/assumptions/evidence/escalation: narrowed RFC operational rules (not full RFC).
14. [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) — **after `RFC_V1_EXTRACT`**, when persisting or migrating **data**: minimal v1 entities vs full [`ERD - Data Model.md`](ERD%20-%20Data%20Model.md).
15. [`EVENTS_V1_EXTRACT.md`](EVENTS_V1_EXTRACT.md) — **after `EVENTS_V1`**, for **why** the Kafka sketch was stripped (supporting read, not duplicate of `EVENTS_V1`).
16. [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) — **after `UI_V1`**, for **rationale** behind minimal routes vs full [`UI.MD`](UI.MD).
17. [`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) — **after `UI_V1_EXTRACT`**: solo-founder **flow**, mandatory stops, what the app automates vs human.

Then open **only** the conceptual files (`RFC`, `ERD`, etc.) needed for the **current** task. Do not “read everything” by default.

---

## 4. Short description of each file in `DOCS/`

| File | Description |
|------|-------------|
| **INDEX.md** | Canonical map of `DOCS/`; reading order; what to update after progress. |
| **V1_SCOPE.md** | Canonical **v1** envelope: purpose, in-scope stack, explicit non-goals, gates, “do not assume”. |
| **ARCHITECTURE_V1.md** | Canonical **v1** system architecture — consolidates scope + extracts; boundary + building blocks + rules for implementation. |
| **DATA_MODEL_V1.md** | Canonical **v1** relational model — five tables, indexes/FK guidance; implementation-facing companion to `ERD_V1_EXTRACT`. |
| **EVENTS_V1.md** | Canonical **v1** event/state discipline — row-level transitions + DOCS; no broker; companion to `EVENTS_V1_EXTRACT`. |
| **UI_V1.md** | Canonical **v1** UI — routes, tabs, visible states, out-of-scope surfaces; companion to `UI_V1_EXTRACT` + behavior context from `UX_V1_EXTRACT`. |
| **RELEASE_CRITERIA_V1.md** | Canonical **v1** release-readiness — L1/L2/L3, evidence, human gates, no-gos; narrows `RFC.md` “guards” without enterprise policy. |
| **MASTER_TODO_CURSOR.md** | Solo-founder master backlog: phases §0–…, definitions of done, stack defaults. |
| **STATUS.md** | Live snapshot: phase status, current task, done criteria, risks, evidence pointers. |
| **NEXT_STEP.md** | Single next step for the owner or Cursor; unblocks ambiguity. |
| **DECISIONS.md** | Append-only-style log of accepted decisions (e.g. repo layout, tooling tradeoffs). |
| **STATUS_TEMPLATE.md** | Blank structure for `STATUS.md` when bootstrapping. |
| **NEXT_STEP_TEMPLATE.md** | Blank structure for `NEXT_STEP.md`. |
| **DECISIONS_TEMPLATE.md** | Blank structure for `DECISIONS.md`. |
| **`templates/`** | Run briefs: [`OUTCOME_BRIEF.md`](templates/OUTCOME_BRIEF.md), [`EVIDENCE_CHECKLIST.md`](templates/EVIDENCE_CHECKLIST.md), [`RELEASE_REVIEW.md`](templates/RELEASE_REVIEW.md), [`SESSION_SUMMARY.md`](templates/SESSION_SUMMARY.md) — see `MASTER` §5.3. |
| **RFC.md** | Product/architecture RFC draft — pre-v1 input; v1 “done” spirit is operationalized in [`RELEASE_CRITERIA_V1.md`](RELEASE_CRITERIA_V1.md) + extracts. |
| **RFC_V1_EXTRACT.md** | v1-only slice of RFC: layers, invariants, envelope, escalation — omits YAML contract / control plane / runtime assurance for v1. |
| **ERD_V1_EXTRACT.md** | v1-only minimal entities (`project`, `outcome`, `assumption`, `acceptance_criterion`, `evidence_item`) derived from ERD; omits control plane / FSM / execution graphs. |
| **EVENTS_V1_EXTRACT.md** | Supporting extract from Kafka-oriented source — rationale for omissions; operational truth is **`EVENTS_V1.md`**. |
| **UI_V1_EXTRACT.md** | Supporting extract — minimal routes rationale; operational UI truth is **`UI_V1.md`**. |
| **UX_V1_EXTRACT.md** | Solo-founder **operating model**: daily loop, stop/carry boundaries, anti-self-deception; companion to `UI_V1_EXTRACT.md`. |
| **ERD - Data Model.md** | Data model draft — pre-v1 input; v1 implementation shape is [`DATA_MODEL_V1.md`](DATA_MODEL_V1.md) + [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md). |
| **UI.MD** | UI notes draft — pre-v1 input; v1 screen list is [`UI_V1.md`](UI_V1.md) + [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md). |
| **User Expiriens.md** | UX / solo-founder workflow notes (typo in filename preserved) — input for future UX v1 docs. |
| **event schema для Kafka queue-оркестратора.md** | Event/Kafka-oriented concept note; **not** in v1 product path per `MASTER_TODO_CURSOR.md` hard rules — historical / exploratory context only. |

---

## 5. What must be updated after meaningful progress

After any **meaningful** step (task done, blocker found, phase advanced, decision made):

| Situation | Update |
|-----------|--------|
| Always | [`STATUS.md`](STATUS.md), [`NEXT_STEP.md`](NEXT_STEP.md) |
| A new or revised decision | [`DECISIONS.md`](DECISIONS.md) |
| A MASTER checkbox / phase reality changed | [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) |
| New long-lived doc added under `DOCS/` | [`INDEX.md`](INDEX.md) §4 table (this file) |

Do not claim a phase closed without updating **`STATUS.md`** and aligning **`MASTER_TODO_CURSOR.md`** where applicable.

---

## 6. Do not skip

**Do not skip** reading and keeping in sync:

- [`STATUS.md`](STATUS.md) — otherwise you work on the wrong task or duplicate completed work.
- [`NEXT_STEP.md`](NEXT_STEP.md) — otherwise the repo loses its single agreed “what now”.
- [`DECISIONS.md`](DECISIONS.md) — otherwise you re-litigate settled defaults.
- [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) — otherwise you invent a parallel plan or wrong phase order.

If any of these are missing or stale, **fix docs first** or record an explicit blocker in `STATUS.md` / `NEXT_STEP.md`.

---

## 7. Phase navigation

| Question | Where it is answered |
|----------|----------------------|
| **Overall roadmap** (phases, order, definitions of done, stack rules) | [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) |
| **What we are doing *now*** (phase, task, honesty, evidence) | [`STATUS.md`](STATUS.md) |
| **The single next concrete step** | [`NEXT_STEP.md`](NEXT_STEP.md) |
| **Why past choices constrain the present** | [`DECISIONS.md`](DECISIONS.md) |
| **How to enter the doc system** | [`../KICKOFF.md`](../KICKOFF.md) + this **`INDEX.md`** |
| **What the v1 system is allowed to be** (boundary + blocks) | [`ARCHITECTURE_V1.md`](ARCHITECTURE_V1.md) + [`V1_SCOPE.md`](V1_SCOPE.md) |
| **What v1 may persist in Postgres** (five tables) | [`DATA_MODEL_V1.md`](DATA_MODEL_V1.md) + [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) |
| **What counts as an “event” / allowed state flow in v1** | [`EVENTS_V1.md`](EVENTS_V1.md) + [`EVENTS_V1_EXTRACT.md`](EVENTS_V1_EXTRACT.md) |
| **What screens / routes v1 ships** | [`UI_V1.md`](UI_V1.md) + [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) |
| **When an outcome is “preview OK” or “verified”** | [`RELEASE_CRITERIA_V1.md`](RELEASE_CRITERIA_V1.md) + [`DATA_MODEL_V1.md`](DATA_MODEL_V1.md) (`release_readiness`) |

Phase **number and name** always come from **`MASTER_TODO_CURSOR.md`** section headers; **`STATUS.md`** states which phase is active and whether it is `planned`, `in_progress`, or `done`.

---

## Related

- Application bootstrap and commands: [`../README.md`](../README.md) (operational; not a substitute for `STATUS.md`).
