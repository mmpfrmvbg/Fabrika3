# UX → v1 minimal operating model

**v1-only.** Extracts the **solo-founder interaction model** from [`User Expiriens.md`](<User Expiriens.md>) without copying its full philosophy. **Screens and layout** live in [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md); **this file** covers **flows, stops, automation boundaries, and honesty rules**.

| Companion | Role |
|-----------|------|
| [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) | **Where** the user works (Today + Outcome tabs). |
| [`V1_SCOPE.md`](V1_SCOPE.md) | **Boundary** — no multi-mode product platform, no “teach the founder to be a developer.” |
| [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) | **Escalation spirit** without bus/orchestrator. |

---

## 1. Purpose of the v1 UX model

- Describe **how** the solo founder moves through a day: open → orient → decide → verify honesty — in **plain operations**, not a second UI spec.
- Encode **mandatory stops** and **what the product must not dump on the human** for v1, aligned with [`V1_SCOPE.md`](V1_SCOPE.md) §4 and [`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md) §4.
- Stay **narrow**: one active focus, one next action, evidence-aware language — **not** the full Explore/Build/Ship product mode system from the source doc.

---

## 2. Who the primary v1 user is

- **Solo founder / non-coder** who is strong at **product intent**, scenarios, and judging usefulness — and **does not** want to become responsible for code review, migrations, deep security/perf analysis, or release engineering discipline alone ([`User Expiriens.md`](<User Expiriens.md>) §2).
- The product is a **co-builder + governor + anti-self-deception layer** in **intent**, not a replacement IDE ([`User Expiriens.md`](<User Expiriens.md>) §1) — **within v1** that means: guided outcomes + blockers + evidence + readiness, **not** autonomous “black box that ships.”

---

## 3. The daily loop for the solo founder in v1

**Morning — “Where are we?”** (≈30 seconds)  
User confirms from **Today** ([`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) §3.1): what is active, what is blocked, what is suggested next, how honest readiness is — **without** opening files or logs ([`User Expiriens.md`](<User Expiriens.md>) §4 intro).

**Midday — “What do I decide?”**  
User works inside **Outcome** ([`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) §3.2): product clarifications (assumptions), acceptance lines, **behavior** approval language — **not** merge/PR semantics ([`User Expiriens.md`](<User Expiriens.md>) §4 “Днём”).

**Evening — “What moved?”**  
User reads a **short human summary** (on Today or outcome summary): what changed, what is still unproven, what new risk appeared — **not** raw CI ([`User Expiriens.md`](<User Expiriens.md>) §4 “Вечером”).

*(If the app cannot yet generate summaries, the loop still holds via **manual** updates + [`STATUS.md`](STATUS.md) discipline until product work exists.)*

---

## 4. Where the system must stop the user

Operational mapping of **Stop classes A–D** from [`User Expiriens.md`](<User Expiriens.md>) §6, **reduced** to what v1 can enforce without a policy engine:

| Stop | v1 meaning | User-facing signal |
|------|------------|---------------------|
| **A — Product unclear** | Critical assumptions open / ill-defined outcome / no clear expected result | Block forward actions on that outcome; show **one** plain blocker + link to **Assumptions** tab. |
| **B — Outside safe envelope** | Change would violate [`V1_SCOPE.md`](V1_SCOPE.md) (e.g. multi-tenant, billing, Kafka, “platform” work) | Hard stop with **why** in product language; suggest doc/owner decision — **not** auto-continue. |
| **C — Not proven** | Missing evidence or failed acceptance for claims like “verified” | Forbid promoting readiness; keep `not_release_ready` / `working_in_preview` honest ([`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) Readiness tab). |
| **D — High risk** | Security-sensitive area, payments touched, repeated failures (conceptual) | Require explicit acknowledgment + stricter evidence **before** optimistic copy — still **no** auto policy engine. |

**Framing rule:** every stop explains **what blocks**, **why it matters**, **one next move** ([`User Expiriens.md`](<User Expiriens.md>) §5.4) — implemented as copy + links to the right **Outcome** tab, not a new “alerts product.”

---

## 5. Where the system must carry the work itself

From [`User Expiriens.md`](<User Expiriens.md>) §7 **Auto classes**, **only** what v1 can honestly automate **without** inventing hidden agents:

| Carry (v1) | Limit |
|------------|--------|
| **Structure intent** into outcome title/description drafts, suggested assumptions list, suggested acceptance lines | Suggestions are **editable**; never silent auto-approve. |
| **Engineering routine outside the founder’s attention** | Handled by **Cursor + repo + CI** per [`V1_SCOPE.md`](V1_SCOPE.md) stack — **not** simulated inside the app as fake “agents.” |
| **Translate technical facts to human summaries** | Only when **inputs exist** (test command output links, evidence items); **no** fabricated green. |
| **Track completeness signals** | Simple checks: “N required AC not satisfied”, “M critical assumptions open” — **not** drift engines or contract-vs-runtime analyzers in v1. |

Anything requiring **passport / policy bundles / inventory / drift** automation is **out** ([`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md) §4, [`EVENTS_V1_EXTRACT.md`](EVENTS_V1_EXTRACT.md)).

---

## 6. The primary unit of progress in v1

**Verified outcomes** — outcomes whose **behavior** is acceptable to the owner and backed by **minimal evidence** when the UI claims more than “draft” ([`User Expiriens.md`](<User Expiriens.md>) §9–§10).  
This matches **Outcome** as the primary object in [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) §5 and rows in [`ERD_V1_EXTRACT.md`](ERD_V1_EXTRACT.md).

---

## 7. The most important anti-self-deception rules

1. **No “success theater”** for generation-only steps — same as [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) §6; repeat here because it is **behavioral**, not layout.  
2. **One concrete next action** — never eight parallel “you should…” items ([`User Expiriens.md`](<User Expiriens.md>) §11 rule 4).  
3. **Blockers in human language** — never gate the user behind internal codes (rule 2–3 in source §11).  
4. **Honest incompleteness** — prefer “works in preview, not evidence-complete” over “almost done” ([`User Expiriens.md`](<User Expiriens.md>) §5.2, §11 rule 5).  
5. **WIP cap** — one active outcome focus for v1 UX copy and defaults; “three secondary tasks max” from source is **guidance** for later, not a hard v1 product requirement unless implemented trivially.

---

## 8. Explicitly omitted future-state UX patterns

| Source pattern | Why omitted for v1 |
|----------------|---------------------|
| **Three product modes** Explore / Build / Ship with distinct promises ([`User Expiriens.md`](<User Expiriens.md>) §8) | Replaced by **readiness + blockers** on existing screens ([`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) §4). |
| **Full “Auto Class” catalog** as if the app runs pipelines end-to-end ([`User Expiriens.md`](<User Expiriens.md>) §7) | v1 delegates engineering execution to **tooling outside** the UX spec; app tracks **intent + proof + honesty** only. |
| **Rich stuck-point playbook** (§5.1–5.5) as automated coaching | Keep **ideas** in support copy sparingly; **no** branching coach engine in v1. |
| **Stop B as live policy enforcement** | Becomes **human + DOCS** stop, not runtime policy ([`RFC_V1_EXTRACT.md`](RFC_V1_EXTRACT.md)). |
| **Long-form “solo founder manifesto” UX** (§12 prose) | **Marketing / vision** only; not operational requirements for v1 UI. |

---

## 9. Do not assume beyond this UX

- **Do not assume** this file adds new routes — **only** [`UI_V1_EXTRACT.md`](UI_V1_EXTRACT.md) defines screens.  
- **Do not assume** v1 ships Explore/Build/Ship toggles, timeline products, or auto drift surveillance.  
- **Do not assume** the founder reads [`User Expiriens.md`](<User Expiriens.md>) — product behavior must stand alone with **Today + Outcome**.  
- **Do assume** [`NEXT_STEP.md`](NEXT_STEP.md) / [`STATUS.md`](STATUS.md) remain the **governance backstop** when product UX is still thin.

---

## Document control

- **Task:** **P4-4.2-ux-extract** — closes `MASTER_TODO_CURSOR.md` §4.2 “user experience doc” checkbox.  
- **Does not start:** §4.3 canonical docs (`ARCHITECTURE_V1`, …).
