# Data model v1 — Fabrika3

**Canonical v1 persistence model** for implementation (Drizzle + Postgres). This doc **narrows** [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md); it does **not** replace the extract’s rationale and **does not** copy the full ERD.

| Authority | Role |
|-----------|------|
| [`V1_SCOPE.md`](V1_SCOPE.md) | **Wins** on product boundary — no new persisted domains without scope change. |
| [`ARCHITECTURE_V1.md`](ARCHITECTURE_V1.md) | **System boundary** — what may exist as app vs docs vs forbidden. |
| [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) | **Entity baseline** — five tables; this file adds **implementation-facing** detail only. |

**Tension rule:** If anything here reads broader than [`V1_SCOPE.md`](V1_SCOPE.md) / [`ARCHITECTURE_V1.md`](ARCHITECTURE_V1.md), **shrink to the extract** and record the mismatch in [`STATUS.md`](STATUS.md).

---

## 1. Purpose of the v1 data model doc

- Define the **only** relational tables v1 product code should introduce for the governed loop (until scope changes).
- Give **enough** for migrations and application types: PK/FK shape, required indexes for honest queries, enum meanings — **without** importing control-plane tables from [`ERD - Data Model.md`](ERD%20-%20Data%20Model.md).
- Stay **implementation-facing**: Drizzle-style snake_case table names; adjust naming in one place here + migrations together when code lands.

---

## 2. Canonical list of included v1 entities only

Exactly **five** tables:

1. `project`  
2. `outcome`  
3. `assumption`  
4. `acceptance_criterion`  
5. `evidence_item`  

No `workspace`, `intent`, `change_request`, `evidence_bundle`, `user` (auth) tables are defined **by this v1 data model** — see §6.

---

## 3. Per-entity specification

### 3.1 `project`

| | |
|--|--|
| **Purpose in v1** | Root container for outcomes; typically **one** active row for solo-founder v1 ([`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) §2.1). |
| **Minimal fields** | `id` (PK, prefer `uuid` or `bigserial` — pick one convention per repo and keep stable), `name` (text, required), `slug` (text, nullable, **unique** when present), `status` (`active` \| `archived`), `created_at`, `updated_at` (timestamptz). |
| **Relationships** | 1:N → `outcome` (`outcome.project_id` → `project.id`). |
| **Not modeled yet** | Multi-project tenancy, org billing, soft-delete semantics beyond `archived`, audit `project` row history. |

---

### 3.2 `outcome`

| | |
|--|--|
| **Purpose in v1** | Outcome Unit + intent surface folded into one row ([`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) §2.2; [`V1_SCOPE.md`](V1_SCOPE.md) §4). |
| **Minimal fields** | `id` (PK), `project_id` (FK → `project.id`, **required**), `title` (text), `description` (text, nullable), `status` (`draft` \| `active` \| `blocked` \| `done` \| `abandoned`), `release_readiness` (`not_assessed` \| `not_release_ready` \| `working_in_preview` \| `verified`), `release_readiness_note` (text, nullable), `created_at`, `updated_at` (timestamptz). |
| **Relationships** | N:1 → `project`; 1:N → `assumption`, `acceptance_criterion`, `evidence_item`. |
| **Not modeled yet** | Separate `intent` / revision history, priority/ordering between outcomes, links to git SHAs or CI run IDs (use **evidence_item** or DOCS). |

---

### 3.3 `assumption`

| | |
|--|--|
| **Purpose in v1** | Explicit assumptions with criticality + resolution state ([`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §2). |
| **Minimal fields** | `id` (PK), `outcome_id` (FK → `outcome.id`, **required**), `code` (text, nullable), `description` (text), `criticality` (`low` \| `medium` \| `high` \| `critical`), `status` (`open` \| `auto_defaulted` \| `needs_human_decision` \| `approved` \| `rejected`), `resolution_note` (text, nullable), `resolved_at` (timestamptz, nullable), `created_at`, `updated_at`. |
| **Relationships** | N:1 → `outcome`. |
| **Not modeled yet** | `assumption_event` history table, M:N to contracts, actor/user FKs (use text note or future auth user id when product needs it). |

---

### 3.4 `acceptance_criterion`

| | |
|--|--|
| **Purpose in v1** | Human-readable acceptance lines per outcome ([`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) §2.4). |
| **Minimal fields** | `id` (PK), `outcome_id` (FK → `outcome.id`, **required**), `code` (text), `description` (text), `required` (boolean), `sort_order` (integer), `status` (`pending` \| `satisfied` \| `waived` \| `failed`), `created_at`, `updated_at`. |
| **Relationships** | N:1 → `outcome`. |
| **Not modeled yet** | FK from `evidence_item` → `acceptance_criterion` (coverage mapping) — **optional later**; not part of v1 minimum. |

---

### 3.5 `evidence_item`

| | |
|--|--|
| **Purpose in v1** | Minimal proof attachments ([`V1_SCOPE.md`](V1_SCOPE.md) §4; [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §1). |
| **Minimal fields** | `id` (PK), `outcome_id` (FK → `outcome.id`, **required**), `evidence_type` (`test_result` \| `link` \| `screenshot` \| `log` \| `manual_note` \| `other`), `title` (text), `artifact_ref` (text — URL or storage key), `summary` (text, nullable), `status` (`draft` \| `valid` \| `stale`), `created_at`, `updated_at`. |
| **Relationships** | N:1 → `outcome`. |
| **Not modeled yet** | `evidence_bundle` aggregate row, binary object storage schema (use Supabase Storage + ref string when needed — **outside** table shape here). |

---

## 4. Concepts that stay **docs-only** for now (not v1 DB tables)

Aligned with [`V1_SCOPE.md`](V1_SCOPE.md) §2 (conceptual objects) + [`ARCHITECTURE_V1.md`](ARCHITECTURE_V1.md) §5:

| MASTER / UX concept | v1 treatment |
|---------------------|--------------|
| **Cursor Run** | Tracked in [`STATUS.md`](STATUS.md) / git / CI — **no** `cursor_run` table required for v1 slice. |
| **Evidence Bundle** (aggregate) | **Implicit:** all `evidence_item` rows for an `outcome_id`. |
| **Release Check** (separate entity) | **Folded** into `outcome.release_readiness` + `release_readiness_note`. |
| **Project / workspace** beyond single `project` | No `workspace` table. |
| **User / owner identity** | Supabase `auth.users` exists for auth wiring; **no** mirrored `app_user` table in this v1 model unless product explicitly adds profiles later. |

---

## 5. Suggested implementation order

1. **`project`** table + seed row (optional).  
2. **`outcome`** + FK to `project`.  
3. **`assumption`** + FK to `outcome`.  
4. **`acceptance_criterion`** + FK to `outcome`.  
5. **`evidence_item`** + FK to `outcome`.

**Indexes (recommended minimum):**

- `outcome (project_id)`  
- `assumption (outcome_id)`  
- `assumption (outcome_id, status)` — filter blockers quickly  
- `acceptance_criterion (outcome_id, sort_order)`  
- `evidence_item (outcome_id, created_at DESC)` — recent proof first  

**FK delete policy:** default **RESTRICT** or **NO ACTION** on `project` ← `outcome`; on `outcome` ← children prefer **CASCADE** only if product explicitly wants orphan cleanup — **v1 default recommendation:** `ON DELETE CASCADE` from `outcome` to child tables, `ON DELETE RESTRICT` from `project` to `outcome` while at least one outcome exists (product choice; document in migration comments).

---

## 6. Explicit out-of-scope entities / groups

Same boundary as [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) §4, summarized:

- Workspace; intent / intent_revision; full **product_contract** graph; control plane (**passport**, **policy_bundle**, **policy_rule**, **scope_guard**, document registry, inventory, drift).  
- Change / execution / release / deployment normalized tables (`change_request`, `execution_run`, …).  
- **Kafka** topics, outbox, consumer state tables — [`ARCHITECTURE_V1.md`](ARCHITECTURE_V1.md) §2, [`EVENTS_V1_EXTRACT.md`](EVENTS_V1_EXTRACT.md).  
- Runtime assurance tables.

---

## 7. Do not assume beyond this data model

- **Do not assume** [`ERD - Data Model.md`](ERD%20-%20Data%20Model.md) “20-table skeleton” is allowed — it is **not** v1.  
- **Do not assume** every MASTER §2 object has a table — only the five above are v1 **persisted** core.  
- **Do not assume** enums are Postgres native enums vs text+check — pick **one** approach per migration set; this doc lists **allowed values**, not SQL dialect.  
- **Do assume** schema changes that **add tables** require **`V1_SCOPE.md`** / MASTER update first.

---

## Document control

- **Task:** **P4-4.3-data-model** — `DOCS/MASTER_TODO_CURSOR.md` §4.3 строка `DATA_MODEL_V1.md`.  
- **Next §4.3 artifact:** `EVENTS_V1.md` (see [`NEXT_STEP.md`](NEXT_STEP.md)) — **not** started in this task.
