# V1 scope — Fabrika3

**Canonical boundary** for the first product version. This document narrows execution: if a feature is not listed here as in-scope, default to **out of scope** until a later version explicitly adopts it.

**Supersedes for execution:** conceptual drafts (`RFC.md`, `ERD - Data Model.md`, UI/UX notes, event-schema explorations) are **inputs only** until promoted by [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §4.2–§4.3. Where RFC imagines control planes, YAML contracts, or orchestration, **v1 does not implement that vision wholesale** — see §3 and §8.

**Related:** [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §0–§2 (hard rules, defaults, target v1), [`DECISIONS.md`](DECISIONS.md), [`INDEX.md`](INDEX.md).

---

## 1. Purpose of v1

Deliver a **minimal, honest “governed product-to-code” loop** for a **solo founder / non-coder** operator:

- Turn **idea / intent** into a small number of explicit **outcomes**, **assumptions**, and **acceptance** expectations.
- Drive implementation through a **Cursor-safe, docs-first workflow** (single active task, evidence, no false “done”).
- Collect **evidence** that behavior matches what was accepted — at a **credibly minimal** depth for v1, not enterprise audit depth.
- Surface **release readiness** in plain language users understand — **behavior-first UI**, not raw engineering artifacts by default ([`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §1 UX defaults).

**v1 is a proof of the governance loop**, not a full “intent operating system” as described in all layers of [`RFC.md`](RFC.md).

---

## 2. Supported envelope for v1

Aligned with [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §1 **Product envelope defaults** and **Tech stack defaults**, v1 assumes:

| Area | In scope for v1 |
|------|------------------|
| **Product shape** | Internal tool / **CRUD-style dashboard**; single project/workspace; **single primary owner** (no multi-tenant product model). |
| **Stack** | **Next.js 15** + **TypeScript** + **App Router**; **Tailwind** + **shadcn/ui**; **Postgres** + **Drizzle**; **Supabase Auth** (and **Supabase Storage** when file storage is needed); hosting target **Vercel**. |
| **Quality** | **ESLint** + **TypeScript** (`tsc --noEmit`); **Vitest** + **Playwright** smoke path (local constraints per [`DECISIONS.md`](DECISIONS.md) **DEC-003** / **DEC-004**). |
| **Conceptual objects** | The **names and relationships** in MASTER §2 (*Project, Outcome, Assumption, Acceptance Criterion, Cursor Run, Evidence Bundle, Release Check*) guide UX and data design; v1 implements **enough** of each to complete **one credible vertical slice** (see §6), not necessarily full enterprise CRUD for every object on day one. |
| **Screens (directional)** | MASTER §2 *Core v1 screens* are the **north star** for navigation and information architecture; v1 may **stub or simplify** some screens if the vertical slice does not require them yet, but must not contradict the outcome-first / evidence / readiness story. |

---

## 3. Explicit non-goals / excluded work

The following are **out of scope for v1** unless [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) is explicitly revised in a later phase:

| Excluded | Rationale |
|----------|-----------|
| **Kafka**, heavy event platforms, **distributed orchestration**, “production-grade” multi-service saga choreography | [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §0.6; see also exploratory `event schema …` doc — not v1 product path. |
| **Full RFC “Product Contract” stack** (`product.yaml`, `flows.yaml`, `rules.yaml`, `acceptance.yaml`, `design.yaml`) and **Project Control Plane** (passport, policy trees, FSM, locks) as a running product subsystem | RFC §2.3–§2.4 describe a **future** shape; v1 uses **simpler** representations (UI + DB + DOCS), not a machine YAML contract engine. |
| **Full policy engine**, automated multi-agent runtime, runtime assurance platform | MASTER §0.6; beyond solo v1 proof. |
| **Multi-tenant** product, **billing / real payments**, **public API versioning**, **marketplace** complexity, **mobile-native** apps | MASTER §1 product envelope defaults. |
| **Realtime / WebSockets** | Unless a later outcome proves absolute necessity; default **no**. |
| **Pre-commit Husky / lint-staged** | **DEC-004** — intentionally deferred for bootstrap velocity. |
| **Prettier as mandatory formatter** | Documented deferral in [`STATUS.md`](STATUS.md) Notes — ESLint + TS remain the floor. |

---

## 4. Core user outcomes expected in v1

End users (solo founder) should be able to — at minimum for the **vertical slice** defined in §6:

1. **See where they are:** a **Today / overview**-style view with current objective, **next step**, **blockers**, and **maturity** signal (even if some data is sparse at first).
2. **Work with an outcome:** create or open an **Outcome**, attach **assumptions** and **acceptance** in human-readable form (not YAML-first).
3. **Trust execution:** see that work runs under a **bounded** process (references to DOCS / single next step / honest statuses — surfaced in UI language, not developer jargon by default).
4. **See proof:** access an **evidence** view or section tied to an outcome (logs, links, test summaries, screenshots — **minimal** but real, not decorative badges).
5. **See honesty about shipping:** a **release readiness** view that can say **not release ready** without shame — aligned with MASTER §1 release defaults.

**Explicitly not required in v1:** full coverage of every screen in MASTER §2 at maximum depth; perfect automation of “Cursor Run” as an internal product replica of Cursor itself.

---

## 5. Minimum technical baseline already required before product work

The following must already be true (see [`STATUS.md`](STATUS.md) / closed phase **3**):

- Repository **builds locally**; **`npm run typecheck`**, **`npm run lint`**, **`npm test`**, **`npm run build`** succeed on a clean machine per documented bootstrap ([`README.md`](../README.md)).
- **Drizzle + Postgres** tooling is wired at repo level (`drizzle.config.ts`, scripts); **real migrations for product tables** may arrive with features — baseline is “tooling + honest env expectations”, not “production DB provisioned”.
- **Supabase Auth** client/server wiring exists at code level; running without Supabase env may remain possible for **non-auth** slices where middleware allows (see README / code).
- **Tests:** Vitest smoke + Playwright config exists; **e2e** may depend on **system Edge** locally (**DEC-003**).
- **DOCS governance:** [`INDEX.md`](INDEX.md), **`V1_SCOPE.md` (this file)**, [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md), [`STATUS.md`](STATUS.md), [`NEXT_STEP.md`](NEXT_STEP.md), [`DECISIONS.md`](DECISIONS.md) are the execution spine — product work must not bypass them.

---

## 6. Definition of “v1 complete enough to proceed”

Two gates — **documentation** and **product** — must be kept distinct.

### 6.1 Doc / governance gate (before broad feature implementation)

Proceed past “docs-only bootstrap” when:

- [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) **§4.1** is reconciled with the repo (which files exist vs checkboxes).
- §4.2 / §4.3 canonical docs (**`ARCHITECTURE_V1`**, **`DATA_MODEL_V1`**, etc.) are either **created** per MASTER or **explicitly deferred** with a recorded next step — **without** silently treating [`RFC.md`](RFC.md) as spec.

Until then, implementation stays **narrow** and traceable to [`NEXT_STEP.md`](NEXT_STEP.md).

### 6.2 Product v1 “complete enough” exit (narrow bar)

v1 product work is **complete enough to graduate** (e.g. to a “v1.1 / hardening” track) when **all** hold:

1. **At least one end-to-end vertical slice** in preview: intent → outcome + assumptions + acceptance → implementation → **evidence** → **release readiness** statement that can be **`not_release_ready`** honestly.
2. **No silent contradiction** with this `V1_SCOPE.md` or [`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §0 hard rules.
3. **Evidence exists** for the slice (MASTER §1 release defaults: no claiming “verified” without proof).
4. Default UI follows **behavior-first** rules (MASTER §1 UX defaults): user does not need to see YAML / raw FSM / event bus to succeed.

This is **not** “enterprise production complete”; it is **credible proof + honest readiness**.

---

## 7. Risks / known limitations accepted for v1

| Risk / limitation | Accepted mitigation |
|-------------------|----------------------|
| **RFC scope creep** if read as mandatory spec | **This file + §8**; §4.2 extraction task must cherry-pick, not copy RFC wholesale. |
| **Solo bandwidth** | Small surface area; one active [`NEXT_STEP.md`](NEXT_STEP.md) at a time. |
| **Disk / Playwright browsers** (**DEC-003**) | Local e2e may rely on **system Edge**; CI may need a different browser install story later. |
| **No Husky** (**DEC-004**) | Quality enforced by discipline + CI later, not local git hooks in v1. |
| **Supabase / env complexity** | Non-coder operators need clear env templates; “works without full prod Supabase” may be limited to certain flows — document honestly per [`STATUS.md`](STATUS.md). |
| **Prettier absent** | Style consistency is **not** a v1 release gate. |

---

## 8. Do not assume beyond this scope

- **Do not assume** [`RFC.md`](RFC.md) layers 2.3–2.5 (full contract YAML, control plane, execution pipeline features) are implemented or required in v1.
- **Do not assume** Kafka, complex orchestration, or multi-agent governance runtimes — MASTER §0 forbids them for v1.
- **Do not assume** multi-tenant SaaS, billing, marketplace, or public API consumers.
- **Do not assume** “green” release readiness without evidence — honesty beats optimism ([`MASTER_TODO_CURSOR.md`](MASTER_TODO_CURSOR.md) §1 release defaults).
- **Do not assume** this file replaces **`ARCHITECTURE_V1`**, **`DATA_MODEL_V1`**, **`UI_V1`**, or **`RELEASE_CRITERIA_V1`** — those remain to be created or explicitly scoped in later MASTER tasks (§4.3).

When in doubt: **narrow the change**, **update DOCS**, **record blockers**, and **prefer MASTER default decisions** over inventing product surface area.
