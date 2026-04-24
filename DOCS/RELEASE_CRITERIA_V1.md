# Release criteria v1 — Fabrika3

**Canonical v1 release-readiness rules** — narrow, operational checklists for **honest** status labels. This is **not** an enterprise release policy, **not** a copy of [`RFC.md`](RFC.md) FSM §3, and **not** YAML contract enforcement.

| Authority | Role |
|-----------|------|
| [`V1_SCOPE.md`](V1_SCOPE.md) | **Wins** on product bar — “complete enough” = credible slice + honesty ([`V1_SCOPE.md`](V1_SCOPE.md) §6.2), not full RFC platform. |
| [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §1 **Release defaults** | **Defaults:** no “done” without evidence; no release-ready without required acceptance coverage; prefer honesty over speed. |
| [`DATA_MODEL_V1.md`](DATA_MODEL_V1.md) | **`outcome.release_readiness`** enum is the **product-facing** latch (`not_assessed` … `verified`). |
| [`EVENTS_V1.md`](EVENTS_V1.md) | **Allowed transitions** — readiness moves only when gates below are respected. |
| [`UI_V1.md`](UI_V1.md) | **Readiness tab** must surface the same rules in plain language. |

**Tension rule:** [`RFC.md`](RFC.md) states like `evidence_collected`, `contract_approved`, `monitored` describe a **future** control plane. For v1, **map those ideas downward**: *critical assumptions resolved*, *required acceptance satisfied*, *minimal evidence present*, *owner-chosen readiness label* — **never** imply contract engines, drift mesh, or full FSM without a **scope change**.

---

## 1. Purpose of the v1 release criteria doc

- Give Cursor and humans a **shared vocabulary** for: *implemented* vs *safe to demo* vs *outcome marked ready to ship* — aligned with [`STATUS.md`](STATUS.md)-style honesty.
- Tie **labels** to **checkable conditions** so UI (`release_readiness`), DOCS, and commits do not contradict each other.
- Stay **implementation-facing**: what to verify locally or in preview, what to record as `evidence_item`, when a human must click “approve / waive / verified”.

---

## 2. Release decision levels for v1

These are **orthogonal** to `outcome.status` (draft/active/…). They describe **truth about evidence + acceptance**, not “code exists.”

| Level | Meaning (short) | Typical mapping to `outcome.release_readiness` |
|-------|------------------|--------------------------------------------------|
| **L1 — Implemented** | Change exists in repo; may be untested or unreviewed for **behavior**. | `not_assessed` or `not_release_ready` |
| **L2 — Verified for preview** | Behavior checked in a **preview** context; proof attached for **what you claim**; known gaps labeled. | `working_in_preview` |
| **L3 — Ready to ship (narrow)** | Required acceptance satisfied; **no** open **critical** assumptions; evidence covers the **claimed** behavior; **owner explicitly** accepts residual risk. | `verified` **only** when all L3 gates pass |

**`not_release_ready`** is always valid — use it whenever L2/L3 gates fail; **never** treat it as a failure state to hide ([`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §1, [`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §7).

---

## 3. What must be true for each level

### L1 — Implemented

- [ ] Code for the change is merged or intentionally staged per team practice.  
- [ ] Project **local** checks you already treat as baseline succeed when relevant: `typecheck` / `lint` / `test` / `build` (see [`V1_SCOPE.md`](V1_SCOPE.md) §5, [`STATUS.md`](STATUS.md) evidence).  
- [ ] UI/copy does **not** claim L2/L3 unless the rows below are true.

### L2 — Verified for preview

Everything in **L1**, plus:

- [ ] **Preview environment** or documented manual path exists to **see behavior** (not only “builds”).  
- [ ] At least **one** `evidence_item` of type `test_result`, `link`, or `screenshot` (or a **`manual_note`** that names *who* checked *what*) supports the claimed behavior ([`DATA_MODEL_V1.md`](DATA_MODEL_V1.md)).  
- [ ] **No required** `acceptance_criterion` in **`failed`** status for the scope you demo; waivers are explicit (`waived`) with reason.  
- [ ] **Critical** assumptions (`critical` / `criticality`) are **not** `open` or `needs_human_decision` for the demoed scope ([`RFC.md`](RFC.md) guard spirit → v1 assumption rows).  
- [ ] `release_readiness_note` states known gaps (“works for happy path only”, etc.).

### L3 — Ready to ship (outcome / slice)

Everything in **L2**, plus:

- [ ] **All** `acceptance_criterion` with `required = true` are **`satisfied`** (or explicitly **`waived`** with owner-acknowledged risk).  
- [ ] **All** assumptions with `criticality` ∈ {`high`, `critical`} are **`approved`** or **`rejected`** with resolution — not `open`.  
- [ ] Evidence set is **stale-checked**: no `evidence_item` still `draft` for claims you ship; superseded proof marked `stale` when behavior changed ([`EVENTS_V1.md`](EVENTS_V1.md)).  
- [ ] **Owner** (solo founder) explicitly sets `release_readiness` to `verified` and updates the short note — **not** inferred by automation alone ([`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §5).  

**Whole-product “we ship the company”** is **out of scope** for this checklist — v1 ships **vertical slices** per [`V1_SCOPE.md`](V1_SCOPE.md) §6.2.

---

## 4. Evidence requirements for v1

| Need | v1 rule |
|------|---------|
| **Minimum proof** | At least one **non-draft** `evidence_item` linked to the `outcome` before claiming **L2+**. |
| **Tests** | Prefer `test_result` or `link` to CI run; if unavailable, `manual_note` with **repro steps** — **no** fabricated green. |
| **Coverage of acceptance** | RFC idea “evidence covers acceptance” → v1: every **`required`** criterion is either satisfied with traceable proof **or** waived with text. |
| **Secrets / PII** | Evidence refs must not embed secrets; use storage keys or scrubbed logs. |
| **Freshness** | After material code change, prior `valid` evidence may need **`stale`** + new proof before raising readiness. |

---

## 5. Human approval requirements for v1

| Action | Human required |
|--------|----------------|
| Resolve **critical** assumption | **Yes** — approve/reject with note; no silent `auto_defaulted` for `critical` without explicit policy in product (default: treat as needing human). |
| Waive a **required** acceptance criterion | **Yes** — owner acknowledges risk in UI or DOCS. |
| Set `release_readiness` to **`verified`** | **Yes** — solo founder explicit action after L3 checklist. |
| Set to **`working_in_preview`** | **Yes** if any required AC still pending but preview is honest; automation may **suggest**, not **silently set** `verified`. |

---

## 6. Explicit blockers / no-go conditions

**Do not** claim L2/L3 if any apply to the **scope you claim**:

- Any **critical** assumption still `open` / `needs_human_decision`.  
- Any **required** acceptance criterion `pending` or `failed` without an explicit, owner-visible **waiver**.  
- **Zero** non-draft evidence while UI or copy implies behavior is proven.  
- **Scope violation** against [`V1_SCOPE.md`](V1_SCOPE.md) §3 (e.g. Kafka product path, multi-tenant billing, contract engine) — **hard no-go** ([`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) stop B).  
- **Contradiction** with [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §0 hard rules.  
- Claiming **`verified`** while [`STATUS.md`](STATUS.md) / known defects record unresolved blockers for the same outcome (governance inconsistency).

---

## 7. Known limitations accepted for v1

Aligned with [`V1_SCOPE.md`](V1_SCOPE.md) §7 and repo reality:

| Limitation | Accepted for v1 |
|------------|-------------------|
| **No** Husky / mandatory Prettier | Quality floor = documented commands + discipline; not git-hook enforcement (**DEC-004**, Notes in [`STATUS.md`](STATUS.md)). |
| **Playwright / disk** | Local e2e may rely on **system Edge** (**DEC-003**); CI browser story may differ — record where you verified. |
| **No** runtime assurance mesh, drift engines, passport | RFC “monitored / drift” **not** gates for v1. |
| **Thin product** | [`STATUS.md`](STATUS.md) / [`NEXT_STEP.md`](NEXT_STEP.md) remain **backstop** when in-app summaries are incomplete ([`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §9). |
| **Solo bandwidth** | One active outcome focus in copy/defaults; deep parallel release trains **out**. |

---

## 8. Do not assume release readiness beyond these criteria

- **Do not assume** [`RFC.md`](RFC.md) §3 FSM states are backlog — they are **not** v1 release stages.  
- **Do not assume** “green CI” alone satisfies **L3** — behavior and acceptance must align ([`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §1 UX defaults: approve **behavior**, not merge).  
- **Do not assume** `verified` on an outcome means the **entire repo** is audit-grade — only the **declared slice** attached to that outcome.  
- **Do not assume** automated agents can set **`verified`** without human confirmation ([`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §5, §7).  
- **Do assume** when in doubt, label **`not_release_ready`** and document **why** in `release_readiness_note` + [`STATUS.md`](STATUS.md).

---

## Document control

- **Task:** **P4-4.3-release-criteria** — `DOCS/MASTER_TODO_CURSOR.md` §4.3 строка `RELEASE_CRITERIA_V1.md`.  
- **Next (outside this task):** закрытие фазы 4 по **`MASTER`** Definition of done §4 + **`STATUS.md`**; затем первая незакрытая работа **§5** — только после явного согласования фазы в **`STATUS`**.
