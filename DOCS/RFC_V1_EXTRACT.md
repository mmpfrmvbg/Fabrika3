# RFC → v1 operational extract

**v1-only.** This document is a **narrow operational slice** derived from [`RFC.md`](RFC.md). It is **not** a replacement for the RFC and **not** a full architecture specification.

| Authority | Role |
|-----------|------|
| [`V1_SCOPE.md`](V1_SCOPE.md) | **Hard boundary** — if this extract ever disagrees with `V1_SCOPE.md`, **`V1_SCOPE.md` wins.** |
| [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §0–§2 | **Hard rules and defaults** for stack and product envelope. |
| [`RFC.md`](RFC.md) | **Broad source** — use for vocabulary and intent; **do not** implement omitted layers in v1 “because RFC says so”. |

**Audience:** Cursor and maintainers during **v1** product and docs work — read after `V1_SCOPE.md`, before deep-diving RFC for historical context.

---

## 1. v1 layer model (what exists in the product *conceptually*)

RFC defines seven layers (§2.1–§2.7). For **v1**, only the following **conceptual** layers are in play; everything else is **out of scope** for implementation (see §5).

| v1 layer (name) | RFC origin | v1 meaning (operational, not YAML) |
|-----------------|------------|--------------------------------------|
| **Intent** | RFC §2.1 | Natural-language **idea / intent** in; structured **draft** out (outcome-oriented text in UI or DB — **not** a required `product.yaml` / contract machine). |
| **Assumptions** | RFC §2.2 | A **registry** of assumptions with identity, description, criticality, and status (`open`, `auto_defaulted`, `needs_human_decision`, `approved`, `rejected`). **Rule (narrowed):** work that claims “ready for acceptance / verified” must not ignore **critical** assumptions still `open` or `needs_human_decision` — align with [`V1_SCOPE.md`](V1_SCOPE.md) §4 (user must trust the loop). |
| **Outcome + acceptance (human-first)** | RFC §2.3 *concept only* | RFC’s **Product Contract** lists YAML artifacts (`product.yaml`, `flows.yaml`, …). **v1 does not implement** that stack. Instead: **Outcome**, **acceptance criteria**, and flows are expressed as **human-readable** records (and later minimal schema per `DATA_MODEL_V1` / app — **outside this file**). |
| **Bounded execution** | RFC §2.5 *spirit* | RFC: actions bounded by `scope` and `policy`. **v1:** execution is bounded by **`MASTER_TODO_CURSOR.md`**, **`NEXT_STEP.md`** (single active step), **`STATUS.md`**, and **`V1_SCOPE.md`** — not by a **passport / policy YAML** engine. |
| **Evidence (minimal)** | RFC §2.6 *subset* | RFC lists rich bundle types. **v1:** evidence means **credible minimum** per [`V1_SCOPE.md`](V1_SCOPE.md) §4 — e.g. test results where they exist, links, optional screenshots, short human-readable summary — **no** requirement for a full `evidence_bundle.yaml` schema in the running product. |

**Explicitly not v1 layers (no product implementation in v1):**

- RFC **§2.3** as machine-readable **Product Contract** file set.
- RFC **§2.4** **Project Control Plane** (passport, policy trees, FSM engine, locks, orchestration).
- RFC **§2.7** **Runtime Assurance** (monitoring / drift / rollback platform) beyond what the hosting provider and simple logs already give.

---

## 2. v1 invariants (rules that must hold)

Adapted from RFC §5.1; **stripped** of contract/policy-version machinery that v1 does not build.

1. **Critical assumptions:** Do not present an outcome as **verified** or **release-ready** while **critical** assumptions are unresolved (`open` or `needs_human_decision`) without an explicit human decision recorded (conceptually matches RFC; storage = app/DOCS, not YAML gate).
2. **Evidence before strong claims:** Do not claim **verified** or **release-ready** without **evidence** appropriate to the claim ([`V1_SCOPE.md`](V1_SCOPE.md) §4, [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §1 release defaults).
3. **Scope discipline:** Implementation work must follow the **current** [`NEXT_STEP.md`](NEXT_STEP.md) and must not expand beyond [`V1_SCOPE.md`](V1_SCOPE.md) (RFC’s “scope guards” → **governance docs + honesty**, not an automated guard subsystem in v1).
4. **Normative vs descriptive:** If user-facing copy or DOCS conflict on behavior, **stop** and resolve in DOCS / STATUS (RFC’s `policy_conflict` → **human resolution**, not an engine).
5. **Human “approve behavior” ≠ replacing tests:** Approving behavior does not remove the need for whatever **minimal automated checks** the slice already defines ([`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §1 UX defaults).

---

## 3. Supported envelope (v1 ∩ RFC)

From RFC §5.2 “Поддерживается”, **only** items that also fit [`V1_SCOPE.md`](V1_SCOPE.md) §2 are treated as **in scope** for v1 product shape:

- **Internal tools** and **CRUD / SaaS-style dashboards** for a **single primary owner** (no multi-tenant v1).
- **Workflow automation** only in the **lightweight** sense: guided steps, statuses, blockers — **not** a separate automation/orchestration platform.

RFC §5.2 “Не поддерживается” (low-level systems, safety-critical, heavy distributed systems, heavy infra) remains **true** and **reinforced** by [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §0–§1 (no Kafka, no “platform before v1”).

---

## 4. Escalation — when the system (or Cursor) must **stop** and surface a blocker

From RFC §5.3, **operationalized** for v1 without a policy engine:

| Stop / escalate when | v1 handling |
|------------------------|-------------|
| Assumption in **`needs_human_decision`** | Block forward progress on that outcome path; show **blocker** in UI or [`STATUS.md`](STATUS.md); **one** clear [`NEXT_STEP.md`](NEXT_STEP.md). |
| **Ambiguous scope** or conflict between DOCS | Do not implement; update [`STATUS.md`](STATUS.md) / [`NEXT_STEP.md`](NEXT_STEP.md); prefer [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) defaults. |
| **Insufficient evidence** for a claimed status | Downgrade honesty to `not_release_ready` / `not verified` — never silent green ([`V1_SCOPE.md`](V1_SCOPE.md) §6–§7). |
| **Security-sensitive** or **migration** change | Per [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md): treat as **high-risk** — stop for explicit owner decision; no autofix story in v1. |
| **Repeated failures** (same blocker) | Stop looping implementation; record root cause in [`STATUS.md`](STATUS.md) and one unblock step in [`NEXT_STEP.md`](NEXT_STEP.md). |

---

## 5. Intentionally omitted from this extract (outside v1 scope)

The following RFC sections describe **future-state or non-v1** architecture. **Do not carry them into v1 implementation.** If a future phase needs them, promote via a new MASTER task and a new doc (e.g. `ARCHITECTURE_V1`), not by expanding this file.

| RFC section / topic | Reason omitted for v1 |
|---------------------|-------------------------|
| **§2.3 Product Contract** — `product.yaml`, `flows.yaml`, `rules.yaml`, `acceptance.yaml`, `design.yaml` as mandatory machine artifacts | Replaced by **human-first** outcomes + acceptance + DOCS; see [`V1_SCOPE.md`](V1_SCOPE.md) §3. |
| **§2.4 Project Control Plane** — `passport.yaml`, `policies/*.yaml`, FSM engine, locks, orchestration | Full **control plane** out of v1 per `V1_SCOPE` / MASTER §0. |
| **§2.5** pipeline binding to **`contract_version`** / **policy** as runtime objects | v1 uses **DOCS + git + honest STATUS** as the binding surface. |
| **§2.6** full evidence bundle schema (`evidence_bundle.yaml` shape, contract/policy version pointers as product subsystems) | v1 uses **minimal evidence** per `V1_SCOPE` §4. |
| **§2.7 Runtime Assurance** (drift, rollback product subsystem) | Out of v1 per `V1_SCOPE` §3; basic hosting logs OK. |
| **§3 FSM** full state graph (`contract_drafted`, `contract_approved`, `monitored`, …) as implemented engine | Optional **mental model** only; v1 ships **simple statuses** in UI/DOCS aligned with [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) / governance vocabulary — **no** FSM-as-a-service. |
| **§4** YAML schemas (`assumptions.yaml`, `acceptance.yaml`, `passport.yaml` fragments) | **Illustrative** in RFC; **not** required file formats for v1. |
| **RFC “Финальное определение готово”** five bullets as literal product gate | **Spirit** applies (evidence, honesty); **literal** “Contract complete / Policy compliant / Runtime ready” as YAML-driven gates — **no**. |

---

## 6. How Cursor should use this document

1. After [`V1_SCOPE.md`](V1_SCOPE.md), use **this file** when reasoning about **intent → assumptions → outcome → bounded work → minimal evidence → honesty**.  
2. Use [`RFC.md`](RFC.md) only for **definitions** and long-range context — **never** as an implicit backlog.  
3. When tempted to add YAML contracts, passport, or Kafka-style events: read **§5** again and **stop**.  
4. After meaningful work, update [`STATUS.md`](STATUS.md), [`NEXT_STEP.md`](NEXT_STEP.md), and [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) when checkboxes truly change — per [`INDEX.md`](INDEX.md).

---

## Document control

- **Created for:** `MASTER_TODO_CURSOR.md` §4.2 — first checkbox (RFC extract), task **P4-4.2-rfc-extract**.  
- **Does not complete:** §4.2 items for ERD / event schema / UI / UX, nor any §4.3 canonical doc except what already exists (`V1_SCOPE.md`).
