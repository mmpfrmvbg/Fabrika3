# ERD → v1 minimal schema extract

**v1-only.** This is the **smallest data shape** inferred from [`ERD - Data Model.md`](ERD%20-%20Data%20Model.md) that still supports the solo-founder loop in [`V1_SCOPE.md`](V1_SCOPE.md) and the operational rules in [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md).

| Authority | Role |
|-----------|------|
| [`V1_SCOPE.md`](V1_SCOPE.md) | **Wins** on product boundary. |
| [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) | **Wins** on what layers exist in v1 (no control-plane DB). |
| [`ERD - Data Model.md`](ERD%20-%20Data%20Model.md) | **Broad source** — most entities here are **intentionally not** in v1 (see §4). |

This file is **not** `DATA_MODEL_V1.md` (§4.3) and **not** a migration spec — it is an **extract** for alignment before schema work.

---

## 1. Purpose of the v1 schema

- Persist **one workspace worth** of governed work: a **project**, **outcomes** (units of intent), **assumptions**, **acceptance criteria**, and **evidence items**.
- Enforce **human-first** records (text + enums), not the ERD’s **product_contract** / **passport** / **change_request** machinery ([`V1_SCOPE.md`](V1_SCOPE.md) §3).
- Stay small enough that a **first vertical slice** can be implemented without importing the full control-plane ERD (§12 “20 tables” list is **out of scope** for v1).

---

## 2. Included entities only

Five entities (six if you count optional `cursor_run` — kept **docs-first** by default; see §6).

---

### 2.1 `project`

| | |
|--|--|
| **Why in v1** | Single container for all outcomes; matches ERD **project** and MASTER **Project**; v1 assumes **one primary owner** — often **one row** for the whole app. |
| **Minimal fields** | `id` (PK), `name`, `slug` (optional, unique), `status` (`active` \| `archived`), `created_at`, `updated_at`. |
| **Primary relationships** | 1:N → `outcome`. |

---

### 2.2 `outcome`

| | |
|--|--|
| **Why in v1** | Central **Outcome Unit** ([`V1_SCOPE.md`](V1_SCOPE.md) §4); subsumes ERD **intent** *for v1* (no separate `intent` table required). Carries draft → active lifecycle and room for **release readiness** without a separate control-plane. |
| **Minimal fields** | `id` (PK), `project_id` (FK → `project`), `title`, `description` (free-text intent / spec), `status` (`draft` \| `active` \| `blocked` \| `done` \| `abandoned`), `release_readiness` (`not_assessed` \| `not_release_ready` \| `working_in_preview` \| `verified` — align with governance vocabulary in [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) / [`STATUS.md`](STATUS.md)), `release_readiness_note` (nullable, short text), `created_at`, `updated_at`. |
| **Primary relationships** | N:1 → `project`; 1:N → `assumption`, `acceptance_criterion`, `evidence_item`. |

---

### 2.3 `assumption`

| | |
|--|--|
| **Why in v1** | RFC / ERD **assumption** registry; blocks dishonest “verified” when **critical** items are open ([`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §2). |
| **Minimal fields** | `id` (PK), `outcome_id` (FK → `outcome`), `code` (optional, e.g. `A-001`), `description`, `criticality` (`low` \| `medium` \| `high` \| `critical`), `status` (`open` \| `auto_defaulted` \| `needs_human_decision` \| `approved` \| `rejected`), `resolution_note` (nullable), `resolved_at` (nullable), `created_at`, `updated_at`. |
| **Primary relationships** | N:1 → `outcome`. *(ERD M:N to contract revision — **omitted** for v1.)* |

---

### 2.4 `acceptance_criterion`

| | |
|--|--|
| **Why in v1** | Human-readable acceptance tied to an outcome; replaces ERD’s **acceptance_criterion** living only inside **product_contract_revision**. |
| **Minimal fields** | `id` (PK), `outcome_id` (FK → `outcome`), `code` (e.g. `AC-001`), `description`, `required` (bool), `sort_order` (int), `status` (`pending` \| `satisfied` \| `waived` \| `failed`), `created_at`, `updated_at`. |
| **Primary relationships** | N:1 → `outcome`. |

---

### 2.5 `evidence_item`

| | |
|--|--|
| **Why in v1** | **Minimal evidence** per [`V1_SCOPE.md`](V1_SCOPE.md) §4 and [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §1 — links, test output refs, screenshots, notes — **without** `evidence_bundle` / `acceptance_coverage` join machinery in v1. |
| **Minimal fields** | `id` (PK), `outcome_id` (FK → `outcome`), `evidence_type` (`test_result` \| `link` \| `screenshot` \| `log` \| `manual_note` \| `other`), `title`, `artifact_ref` (URL or storage key; string), `summary` (nullable), `status` (`draft` \| `valid` \| `stale`), `created_at`, `updated_at`. |
| **Primary relationships** | N:1 → `outcome`. *(Optional later: nullable FK to `acceptance_criterion` for coverage mapping — **not required** for v1 extract.)* |

---

## 3. Primary relationships (diagram in text)

```text
project 1 ── * outcome 1 ── * assumption
                    ├── * acceptance_criterion
                    └── * evidence_item
```

---

## 4. Explicitly omitted entities / groups (out of v1 scope)

| ERD area (see source doc) | Why omitted for v1 |
|---------------------------|---------------------|
| **workspace** (ERD §2.1) | v1 assumes **single implicit workspace**; `project` is enough unless multi-workspace is explicitly added later. |
| **intent**, **intent_revision** as separate tables | **Folded into `outcome`** to avoid duplicate “idea” surfaces; ERD’s `converted_to_contract` path replaced by outcome status + DOCS. |
| **product_contract**, **product_contract_revision**, **product_spec**, **flow_definition**, **business_rule**, **design_spec_reference** (ERD §3.3) | Full **contract aggregate** — explicitly out per [`V1_SCOPE.md`](V1_SCOPE.md) §3 / [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §5. |
| **assumption_event** | Audit trail **nice-to-have**; v1 can log in app or DOCS first. |
| **Entire Control Plane** — `project_passport`, `policy_bundle`, `policy_rule`, `scope_guard`, **document** registry graph, **inventory_***, **drift_event** (ERD §4) | Control plane / policy engine **out of v1**. |
| **Change management** — `change_request`, `change_state_transition`, `task`, `approval_request`, `lock_record` (ERD §5) | FSM / orchestration **out of v1**; governance is **DOCS + STATUS + NEXT_STEP** until a later version. |
| **Execution** — `execution_run`, `execution_manifest`, `agent_action`, `code_change_set`, `changed_file`, `test_case`, `test_execution`, `verification_report`, `preview_environment`, `release_candidate`, `deployment` (ERD §6) | **Far beyond** v1 vertical slice; CI/hosting/git cover execution; product stores **evidence_item**, not full run manifests. |
| **Evidence extras** — `evidence_bundle` as aggregate, `acceptance_coverage`, `human_behavior_review` (ERD §7.1) | v1 uses **flat `evidence_item`** + optional `release_readiness` on `outcome`; behavior approval can be a **manual_note** evidence or future add-on — not separate tables in this extract. |
| **Runtime assurance** — `runtime_signal`, `runtime_check`, `rollback_event` (ERD §7.2) | Out per [`V1_SCOPE.md`](V1_SCOPE.md) §3. |

---

## 5. Suggested implementation order

1. **`project`** — bootstrap row(s).  
2. **`outcome`** — user-visible backbone.  
3. **`assumption`** — unblockers / honesty gates.  
4. **`acceptance_criterion`** — define “done means what”.  
5. **`evidence_item`** — attach proof after work exists.

Use migrations only when product work actually needs persistence; until then, **DOCS + STATUS** can still demo the loop.

---

## 6. What stays **docs-only** for now (not required as DB tables in v1)

- **Cursor Run** as a first-class persisted object (MASTER §2) — track runs in **`STATUS.md`**, git history, or CI links; **optional** thin `cursor_run` table later if UX requires history in-app.  
- **Explicit “Evidence Bundle” aggregate** — v1 groups evidence by **`outcome_id`** only.  
- **Workspace**, **Intent revision**, **Policy / passport**, **inventory**, **drift**, **deployment graph** — remain **documentation or platform concerns**, not this schema.  
- **NEXT_STEP / DECISIONS** content — stays in markdown files per repo rules; **do not duplicate** as normative DB tables in v1 unless a clear UX need appears.

---

## 7. Do not assume beyond this schema

- **Do not assume** normalized **change_request** / **execution_run** / **evidence_bundle** trees from the ERD — they are **explicitly excluded** in §4.  
- **Do not assume** multi-tenant `workspace` isolation, policy bundles, or scope guards in the database.  
- **Do not assume** this extract lists all columns production will ever need — only **v1 minimum**.  
- **Do not assume** [`ERD - Data Model.md`](ERD%20-%20Data%20Model.md) §12 “20 tables” skeleton is v1 scope — it is a **future** production-minded set.  
- **`DATA_MODEL_V1.md`** (MASTER §4.3) may later **refine naming, indexes, and JSON columns** — this extract must not silently become the full canonical doc without a dedicated task.

---

## Document control

- **Task:** **P4-4.2-erd-extract** — `MASTER_TODO_CURSOR.md` §4.2 second checkbox.  
- **Does not start:** remaining §4.2 items (event schema, UI, UX) or §4.3 canonical docs.
