# UI → v1 minimal extract

**v1-only.** Narrows [`UI.MD`](UI.MD) and the solo-founder panels described in [`User Expiriens.md`](<User Expiriens.md>) into a **small routable surface** aligned with [`V1_SCOPE.md`](V1_SCOPE.md) §4, [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §1–§2, [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md), and [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md).

**Companion:** solo-founder **flow / stops / automation** — [`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) (do not duplicate that document here).

---

## 1. Purpose of the v1 UI

- Give the **solo founder / non-coder** a **behavior-first** surface: intent, outcomes, blockers, proof, and release honesty — **not** code, YAML, FSM, or raw logs ([`UI.MD`](UI.MD) §1, §9; [`User Expiriens.md`](<User Expiriens.md>) §1–§3).
- Map directly to the **vertical slice** in [`V1_SCOPE.md`](V1_SCOPE.md) §4 (overview → outcome work → evidence → readiness).
- Stay implementable as a **handful of routes** + clear empty states; defer the full **“UI operating model”** from [`UI.MD`](UI.MD) (multi-tab product space, rich timeline, tri-mode Explore/Build/Ship, etc.).

---

## 2. Core v1 screens only

v1 ships **two primary routes** plus **one optional stub** (third route) if navigation clarity needs it. Everything else is **omitted** (§4).

| # | Screen | Route idea |
|---|--------|--------------|
| 1 | **Today** | `/` or `/today` |
| 2 | **Outcome** (single object + tabs) | `/outcomes/[id]` |
| 3 | *(Optional stub)* **Outcomes index** | `/outcomes` — lightweight list when Today does not list enough |

**Default:** use **two routes** (`Today` + `Outcome`) if the product can deep-link into an outcome from Today.

---

## 3. For each included screen

### 3.1 Today / Overview

| Aspect | v1 specification |
|--------|------------------|
| **Why in v1** | Daily “where are we?” per [`User Expiriens.md`](<User Expiriens.md>) §3.1 (blocks A–E) and [`V1_SCOPE.md`](V1_SCOPE.md) §4.1. |
| **Primary user action** | Pick the **one** thing to do next: open the highlighted outcome, resolve a blocker, or review proof. |
| **Key states** | `loading` · `ready` · `blocked` (cannot proceed without human input) · `empty` (no outcomes yet). |
| **What must be visible** | **(A)** Current focus / active outcome title · **(B)** Short list of outcomes with honest status (not all green by default) · **(C)** Blockers in **plain language** (assumption unresolved, missing evidence, etc.) · **(D)** **Single** “suggested next step” (mirror [`NEXT_STEP.md`](NEXT_STEP.md) in copy, not as raw doc) · **(E)** Maturity / readiness line (`not_release_ready`, `working_in_preview`, `verified`, …) per governance vocabulary. |

**Must not dominate v1:** repository file trees, chat transcripts, CI log dumps ([`UI.MD`](UI.MD) §9).

---

### 3.2 Outcome (detail — single screen, tabbed sections)

Treat **one outcome** as the main workspace. Use **tabs** or anchors (implementation detail) for sub-panels — **not** separate full product editors from [`UI.MD`](UI.MD) §2.

| Tab / section | Why | Primary action | Key states | Must be visible |
|---------------|-----|----------------|------------|------------------|
| **Summary** | Replaces a separate “What you’re building / scenarios” product space for v1. | Edit title/description; set outcome `status` within allowed enum. | `draft` · `active` · `blocked` · `done` · `abandoned` | Plain-language **goal**, **last update**, link to open **Evidence** tab. |
| **Assumptions** | [`UI.MD`](UI.MD) §3 + [`User Expiriens.md`](<User Expiriens.md>) §5.1. | Answer / approve / reject assumptions (`needs_human_decision` → resolved). | Assumption statuses per [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md). | Blocking items first; **no YAML**. |
| **Acceptance** | [`V1_SCOPE.md`](V1_SCOPE.md) §4.2 — human-readable AC. | Add/edit/reorder minimal criteria; mark satisfied / failed / waived. | `pending` · `satisfied` · `failed` · `waived` | Short **AC list**; required vs optional. |
| **Evidence** | [`V1_SCOPE.md`](V1_SCOPE.md) §4.4 + [`UI.MD`](UI.MD) §5 (subset). | Add evidence rows (link, note, test summary text, optional screenshot ref). | `draft` · `valid` · `stale` | “What we proved” — **minimal** list, not full CI dashboard. |
| **Readiness** | [`V1_SCOPE.md`](V1_SCOPE.md) §4.5. | Set / view `release_readiness` + short note on the **outcome** (per ERD extract). | `not_assessed` · `not_release_ready` · `working_in_preview` · `verified` | Honest verdict + **one** paragraph; **no fake green**. |

---

### 3.3 *(Optional)* Outcomes index

| Aspect | v1 specification |
|--------|------------------|
| **Why** | If Today is too crowded: simple sortable/filterable list of outcomes. |
| **Primary action** | Open an outcome. |
| **Key states** | `empty` · `has_items`. |
| **Visible** | Title, status, blocker badge, last updated. |

---

## 4. Explicitly omitted UI areas (outside v1)

| Source idea | Why omitted for v1 |
|-------------|---------------------|
| **Full “Product Space”** with **Scenarios**, **Rules**, **Roles & permissions**, **Design** editors as rich tabs ([`UI.MD`](UI.MD) §2.2) | Requires contract/rules engines and design tooling — **out** per [`V1_SCOPE.md`](V1_SCOPE.md) §3. v1 uses **text** on the outcome + minimal acceptance list instead. |
| **Dedicated “Changes” hub** with diff narrative, live preview, full evidence dashboard ([`UI.MD`](UI.MD) §4) | Maps to `change_request` / execution plane — **omitted** per [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) §4. Surface **“last change”** as a **single line or card** on Today or outcome summary only. |
| **Standalone Evidence hub** with security/perf/a11y tabs as first-class ([`UI.MD`](UI.MD) §5) | Collapsed into **Outcome → Evidence** tab with **minimal** types ([`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md)). |
| **System Behavior Timeline** as rich product feature ([`UI.MD`](UI.MD) §6) | Nice for trust — **defer**; optional **short activity list** under outcome summary in v1. |
| **Explore / Production mode switch** + full hardening UI ([`UI.MD`](UI.MD) §7; [`User Expiriens.md`](<User Expiriens.md>) §8) | Modes multiply state; v1 uses **readiness + blockers** instead of mode machinery. |
| **Alerts & escalations** as a separate surface ([`UI.MD`](UI.MD) §8) | Use **inline banners** on Today / Outcome; full escalation desk **deferred**. |
| **Advanced mode** exposing logs/stack ([`UI.MD`](UI.MD) §9) | **Out** for v1 default; power users use repo tools. |
| **UI → YAML mapping table** ([`UI.MD`](UI.MD) §10) | **Never** show to end users in v1; implementation uses DB + DOCS, not `flows.yaml`. |
| **Separate screens** for every MASTER §2 name (Flows, What Changed, …) | MASTER list remains **north star**; v1 **stubs** their *ideas* inside **Today** + **Outcome** only ([`V1_SCOPE.md`](V1_SCOPE.md) §2 last paragraph). |

---

## 5. The primary object of progress in v1 UI

**The Outcome** (Outcome Unit language from [`User Expiriens.md`](<User Expiriens.md>) §9) — one row in [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) `outcome` is the **navigational center**. Today aggregates many outcomes; deep work happens on **Outcome**.

Progress KPI for UI copy: **verified, evidence-backed outcomes** — not files, tokens, or PR count ([`User Expiriens.md`](<User Expiriens.md>) §10).

---

## 6. The one most important UI rule for solo founders

**Do not show “success” for generation or intent capture alone** — only for **behavior** the user can recognize, backed by **minimal evidence** when the UI claims “verified” or “ready” ([`User Expiriens.md`](<User Expiriens.md>) §11 rule 1; [`UI.MD`](UI.MD) §4 “Approve **behavior**”, not merge/PR).

Secondary (already enforced by docs, reinforce in UI): **one clear next action** — never eight parallel CTAs ([`User Expiriens.md`](<User Expiriens.md>) §11 rule 4).

---

## 7. Do not assume beyond this UI

- **Do not assume** block-scenario editors, rules DSL toggles, or role matrices from [`UI.MD`](UI.MD) §2 exist in v1.  
- **Do not assume** a **timeline** product, **tri-mode** Explore/Build/Ship, or **orchestrator alerts** surface.  
- **Do not assume** this file replaces a future **`UI_V1.md`** (MASTER §4.3) or the dedicated **UX extract** task — workflow/stop-class detail stays for **User Expiriens** pass.  
- **Do assume** users can always fall back to **[`STATUS.md`](STATUS.md) / [`NEXT_STEP.md`](NEXT_STEP.md)** outside the app if the UI is still thin.

---

## Document control

- **Task:** **P4-4.2-ui-extract** — `MASTER_TODO_CURSOR.md` §4.2 “UI doc” checkbox.  
- **Sources folded:** [`UI.MD`](UI.MD), [`User Expiriens.md`](<User Expiriens.md>) (principles + Today blocks + Outcome Unit only — **not** a full UX extract).  
- **Next §4.2 item:** `User Expiriens.md` workflow extract **separate** file/task.
