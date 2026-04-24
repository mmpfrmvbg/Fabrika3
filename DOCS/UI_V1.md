# UI v1 — Fabrika3

**Canonical v1 UI surface** for implementation (routes, panels, visible states). This doc **narrows** [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md); it is **not** a rewrite of [`UI.MD`](UI.MD) and **not** a second full UI spec.

| Authority | Role |
|-----------|------|
| [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) | **Wins on screens** — which routes and tabs exist in v1. |
| [`V1_SCOPE.md`](V1_SCOPE.md) | **Product boundary** — behavior-first dashboard, no YAML/FSM product ([`V1_SCOPE.md`](V1_SCOPE.md) §3–§4). |
| [`ARCHITECTURE_V1.md`](ARCHITECTURE_V1.md) | **System map** — web app inside v1; governance in DOCS. |
| [`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) | **Interaction context only** — daily loop, stop classes, what not to dump on the user; **does not** add routes or tabs beyond this file. |

**Tension rule:** If [`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) suggests patterns that imply **new surfaces** (e.g. separate alerts desk, tri-mode toggles, rich coaching flows), **shrink to [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md)** — express behavior as **copy, banners, and gating** on **Today** and **Outcome** only.

---

## 1. Purpose of the v1 UI doc

- Define the **only** first-class v1 **screens** implementers should target until scope changes.
- Tie each surface to **primary actions** and **honest states** so Next.js routes and components stay aligned with [`V1_SCOPE.md`](V1_SCOPE.md) §4 vertical slice.
- Give enough detail for **layout and empty states** without importing the broad operating model from [`UI.MD`](UI.MD).

---

## 2. Canonical list of v1 screens / surfaces only

| # | Surface | Suggested route | Required in v1? |
|---|---------|-----------------|-----------------|
| 1 | **Today** (overview) | `/` or `/today` | **Yes** |
| 2 | **Outcome** (single outcome, tabbed workspace) | `/outcomes/[id]` | **Yes** |
| 3 | **Outcomes index** (lightweight list) | `/outcomes` | **Optional** — only if navigation from Today is insufficient ([`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) §2). |

**Default product path:** **two routes** (Today + Outcome) when Today can deep-link into an outcome.

---

## 3. Per-surface specification

### 3.1 Today (overview)

| | |
|--|--|
| **Purpose** | “Where are we?” — orientation, one next focus, blockers and readiness in plain language ([`V1_SCOPE.md`](V1_SCOPE.md) §4.1; [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) §3.1). |
| **Primary action** | Open the **highlighted** or chosen outcome; or act on the **single** suggested next step (resolve blocker, review evidence). |
| **Required visible elements** | **Active / focus outcome** title; **short list** of outcomes with honest status (not all green); **blockers** in human language (unresolved assumptions, missing evidence, etc.); **one** primary “next step” line (mirror intent of [`NEXT_STEP.md`](NEXT_STEP.md) in product copy, not raw file); **maturity / readiness** line using governance vocabulary (`not_release_ready`, `working_in_preview`, `verified`, …). |
| **Key states** | `loading` · `ready` · `empty` (no outcomes) · `blocked` (user cannot proceed without input — align messaging with [`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §4). |

**Implementation note:** Inline banners preferred over a separate “alerts” app ([`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) §4). Do **not** lead with repo trees, chat transcripts, or CI dumps ([`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) §3.1).

---

### 3.2 Outcome (detail — tabs or anchors)

| | |
|--|--|
| **Purpose** | Deep work on **one** outcome row — intent, honesty gates, proof, shipping verdict ([`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) §3.2; primary object §5). |
| **Primary action** | Edit summary fields; work **Assumptions** → **Acceptance** → **Evidence** → **Readiness** in whatever order the user needs; persist per [`DATA_MODEL_V1.md`](DATA_MODEL_V1.md). |
| **Required visible elements** | **Shell:** outcome title, overall `status`, link/tab to each section below. **Summary:** plain-language goal, last updated, link to Evidence. **Assumptions:** list ordered with blocking items first; actions to resolve (`needs_human_decision` → approved/rejected); **no YAML**. **Acceptance:** short list, required vs optional, status per row. **Evidence:** minimal list (types per data model — link, note, test summary, optional screenshot ref). **Readiness:** `release_readiness` + short note; must allow **`not_release_ready`** visibly ([`EVENTS_V1.md`](EVENTS_V1.md), [`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §7). |
| **Key states** | **Outcome:** `draft` · `active` · `blocked` · `done` · `abandoned`. **Tabs:** reflect child row statuses from [`DATA_MODEL_V1.md`](DATA_MODEL_V1.md) (`assumption`, `acceptance_criterion`, `evidence_item`, readiness enums). **UI chrome:** per-tab `loading` / `ready` / section-level `empty`. |

**Sub-panels (same route, not separate v1 apps):** Summary · Assumptions · Acceptance · Evidence · Readiness — names and responsibilities match [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) table in §3.2.

---

### 3.3 Outcomes index (optional)

| | |
|--|--|
| **Purpose** | Reduce crowding on Today when many outcomes exist — simple jump-off list only ([`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) §3.3). |
| **Primary action** | Open one outcome (`/outcomes/[id]`). |
| **Required visible elements** | Title, outcome status, blocker indicator if any, last updated (sort/filter **nice-to-have**, not a data-grid product). |
| **Key states** | `empty` · `has_items`. |

---

## 4. How this UI supports the solo-founder workflow

[`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) describes **when** and **why** the user moves; v1 **maps** that to **two places**:

| UX moment | v1 UI mapping |
|-----------|----------------|
| Morning — orient ([`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §3) | **Today** — blockers, readiness, one next step. |
| Midday — decide / clarify ([`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §3–§4) | **Outcome** — Assumptions + Acceptance; stops **A / C** as inline blocks + deep links to tabs ([`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §4). |
| Evening — what moved ([`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §3) | **Today** or **Outcome → Summary** — short human summary when data exists; until then, owner may use [`STATUS.md`](STATUS.md) outside the app. |
| Stop **B** (outside envelope) | **Hard stop** copy on relevant action — human + DOCS path per UX/RFC spirit, **no** new “policy” screen ([`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §4, [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §4). |
| Anti-self-deception ([`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §7) | **Readiness** tab + **Evidence** tab enforce honesty; **no** success theater for generation-only steps ([`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) §6). |

**WIP / focus:** UX extract’s “one active focus” and “one next action” are **defaults for copy and prominence** on Today — not a mandate for three simultaneous “primary” outcomes in UI chrome unless trivially implemented.

---

## 5. Explicitly out-of-scope UI areas

Consolidated from [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) §4 and [`ARCHITECTURE_V1.md`](ARCHITECTURE_V1.md) §7 — **do not** ship as v1 product UI:

- Full **Product Space** (scenarios, rules, roles, design editors) from [`UI.MD`](UI.MD) §2 — use **text + lists** on Outcome instead.  
- **Dedicated Changes hub** with diff narrative, live preview, full evidence dashboard — **Outcome → Evidence** + optional **one line** “last change” on Today/Summary only.  
- **Standalone Evidence hub** with security/perf/a11y as top-level IA — stays under **Outcome → Evidence**.  
- **Rich system behavior timeline** as a product — optional **short activity** under Summary at most.  
- **Explore / Build / Ship** mode switch and parallel “hardening” UI — replaced by **readiness + blockers**.  
- **Separate escalations desk** — **inline** only.  
- **Advanced / engineer mode** (logs, stack) as default paths — power users use repo tools ([`V1_SCOPE.md`](V1_SCOPE.md) §4 behavior-first).  
- **YAML / contract mapping** UI for end users.  
- **One full-screen per MASTER §2 name** — MASTER remains north star; **ideas** fold into Today + Outcome only ([`V1_SCOPE.md`](V1_SCOPE.md) §2).

---

## 6. Build within this UI — do not assume beyond it

- **Do not assume** [`UI.MD`](UI.MD) tabs, timelines, or tri-mode navigation are backlog for v1 — they are **pre-v1** unless promoted by a **scope change**.  
- **Do not assume** [`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) authorizes **new routes** — only this file + [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) do.  
- **Do not assume** solo founders read `User Expiriens.md` — **Today + Outcome** must stand alone ([`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §9).  
- **Do not assume** release **criteria** live here — they belong in [`RELEASE_CRITERIA_V1.md`](RELEASE_CRITERIA_V1.md).  
- **Do assume** [`NEXT_STEP.md`](NEXT_STEP.md) / [`STATUS.md`](STATUS.md) remain the **governance backstop** when the app is still thin ([`UX_V1_EXTRACT.md`](UX_V1_EXTRACT.md) §9).

---

## Document control

- **Task:** **P4-4.3-ui** — `DOCS/MASTER_TODO_CURSOR.md` §4.3 строка `UI_V1.md`.  
- **Following §4.3:** [`RELEASE_CRITERIA_V1.md`](RELEASE_CRITERIA_V1.md) — **done**; phase closure per [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §4 + [`STATUS.md`](STATUS.md).
