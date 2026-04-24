# MASTER TODO FOR CURSOR — Solo Founder / Non-Coder Mode

Этот документ — главный последовательный backlog для Cursor.

Цель: довести v1 продукта до состояния, где он:

1. собирается и запускается локально и в preview;
2. работает по ключевым flow;
3. имеет evidence bundle;
4. показывает release readiness честно;
5. может развиваться дальше без потери контекста.

---

## 0. HARD RULES FOR CURSOR

1. Не менять стек без сильной причины.
2. Не делать "платформу на будущее" раньше работающего v1.
3. Каждый этап заканчивать артефактом, а не только кодом.
4. Не закрывать этап, если не обновлены DOCS.
5. Любой ambiguous выбор решать по таблице default decisions ниже.
6. Не внедрять Kafka, сложный multi-agent runtime, полноценный policy engine и production-grade distributed orchestration в v1.
7. Главный KPI — verified outcomes, а не количество файлов или абстрактная "готовность".
8. Если что-то не доказано — помечать как not verified / not release-ready.
9. UI делать behavior-first: пользователь видит outcomes, flows, blockers, evidence, release readiness.
10. Cursor работает по одному активному milestone за раз.

---

## 1. DEFAULT DECISIONS (чтобы не зависеть от человека)

Если в процессе разработки встречается недоопределённость, использовать эти дефолты без эскалации, если это не security-critical и не ломает текущую архитектуру.

### Product envelope defaults

- Тип продукта v1: internal tool / CRUD SaaS dashboard.
- Один проект, один workspace, один основной owner.
- Multi-tenant НЕ делать в v1.
- Billing/real payments НЕ делать в v1.
- Сложные third-party integrations НЕ делать в v1.
- Mobile-first native apps НЕ делать в v1.
- Public API versioning НЕ делать в v1.
- Marketplace complexity НЕ делать в v1.
- Realtime/WebSockets НЕ делать в v1, если не абсолютно необходимо.

### Tech stack defaults

- Frontend: Next.js 15 + TypeScript + App Router.
- UI: Tailwind + shadcn/ui.
- State/forms: React Hook Form + Zod.
- Backend/API: Next.js route handlers/server actions where reasonable.
- DB: Postgres.
- ORM: Drizzle.
- Auth: Supabase Auth.
- Storage: Supabase Storage.
- Hosting: Vercel.
- Tests: Vitest + React Testing Library + Playwright.
- Validation/contracts: Zod.
- Background jobs for v1: Postgres-backed job runner or simple server-side queue. No Kafka in running product v1.
- Observability for v1: structured logs + simple error reporting + minimal health checks.

### UX defaults

- Главный объект UI: Outcome Unit.
- Основной домашний экран: current objective + blockers + verified outcomes + next step + maturity stage.
- Пользователь никогда по умолчанию не видит YAML/FSM/event bus/raw logs.
- Основная кнопка review: "Approve behavior", а не PR/merge.

### Release defaults

- Нельзя считать change завершённым без evidence.
- Нельзя считать release-ready то, что не прошло required acceptance coverage.
- Если сомнение между "быстрее" и "честнее", выбирать честнее.

---

## 2. TARGET V1

Построить v1 "governed product-to-code" системы для solo founder/non-coder, которая:

- принимает idea/intent;
- превращает её в active outcome + assumptions + acceptance;
- ведёт реализацию через Cursor-safe workflow;
- собирает evidence;
- показывает release readiness;
- не даёт симулировать готовность.

### Core v1 objects

- Project
- Outcome
- Assumption
- Acceptance Criterion
- Cursor Run
- Evidence Bundle
- Release Check

### Core v1 screens

- Today / Overview
- Outcome Detail
- Assumptions
- Flows / Scenarios
- What Changed
- Evidence / Proof
- Release Readiness

---

## 3. REPOSITORY BOOTSTRAP

### 3.1 Create project structure

- Create monorepo or single-repo structure for app + docs. *(**single-repo** per **DEC-001**; `DOCS/` at repo root.)*
- Create folders:
  - `app/`
  - `components/`
  - `lib/`
  - `db/`
  - `tests/`
  - `playwright/`
  - `DOCS/`
  - `.cursor/`
  - `.cursor/rules/`
- Add `AGENTS.md` at repo root.
- Copy the existing conceptual docs into `DOCS/` if not already present. *(RFC, ERD, templates, etc. present under `DOCS/`.)*
- Add `README.md` with local run instructions.

### 3.2 Initialize stack

- Initialize Next.js + TypeScript + Tailwind. *(Next **15**, React **19**, Tailwind **v4** via `@tailwindcss/postcss`; see `package.json`.)*
- Install shadcn/ui and base primitives. *(`components.json` **base-nova**; `components/ui/`.)*
- Install Drizzle and configure Postgres. *(`drizzle-orm`, `drizzle-kit`, `drizzle.config.ts` → PostgreSQL, `./db/schema.ts`, `./db/migrations`.)*
- Configure Supabase client/server auth. *(`lib/supabase/client.ts`, `server.ts`, `middleware.ts`; root `middleware.ts`.)*
- Configure lint/format/typecheck. *(ESLint + `tsc --noEmit`; **Prettier intentionally not installed** — see `DOCS/STATUS.md` Notes.)*
- Configure Vitest. *(`vitest` **2.1.9**, `vitest.config.ts`, `tests/`.)*
- Configure Playwright. *(`@playwright/test`, `playwright.config.ts`, `playwright/e2e/`; system Edge per **DEC-003**.)*
- Add environment template `.env.example`.

### 3.3 Repo quality floor

- Add `pnpm` or `npm` scripts for:
  - `dev`
  - `build`
  - `lint`
  - `typecheck`
  - `test`
  - `test:e2e`
  - `db:generate`
  - `db:migrate`
- Add Husky/lint-staged only if it does not slow down v1 too much. *(Resolved by explicit deferral: **DEC-004** — Husky not added in v1 bootstrap.)*
- Ensure clean local bootstrap from zero. *(Verified: `npm ci` then `typecheck` / `lint` / `test` / `build`; documented in README + STATUS.)*

### Definition of done

- Repo runs locally.
- Auth and DB wiring compile.
- Test framework boots.
- Cursor can open repo and understand structure.

---

## 4. DOCS AS SOURCE OF TRUTH

### 4.1 Normalize documentation set

- Create canonical docs index: `DOCS/INDEX.md`. *(Present in repo; navigation + reading order.)*
- Create `DOCS/V1_SCOPE.md`. *(Present in repo; canonical v1 boundary per phase-4 work.)*
- Create `DOCS/DECISIONS.md`. *(Present in repo; DEC-001 … DEC-004.)*
- Create `DOCS/MASTER_TODO_CURSOR.md` (this file). *(This file.)*
- Create `DOCS/STATUS.md`. *(Present in repo; live phase/task state.)*

### 4.2 Convert conceptual docs into implementation docs

- Extract from RFC the v1 scope, layers, invariants, supported envelope, escalation rules. *(See `DOCS/RFC_V1_EXTRACT.md` — v1-only operational slice; `RFC.md` remains broad source.)*
- Extract from ERD the minimal v1 schema only. *(See `DOCS/ERD_V1_EXTRACT.md` — five core entities; full ERD control plane omitted.)*
- Extract from event schema only the events needed for v1. *(See `DOCS/EVENTS_V1_EXTRACT.md` — v1 retains naming/state discipline only; no Kafka/orchestrator.)*
- Extract from UI doc the v1 screens and UX rules. *(See `DOCS/UI_V1_EXTRACT.md` — Today + tabbed Outcome (+ optional list); broad UI.MD operating model omitted.)*
- Extract from user experience doc the solo founder workflow and blocking rules. *(See `DOCS/UX_V1_EXTRACT.md` — daily loop, stops, automation bounds, anti-self-deception; modes/orchestrator UX omitted.)*

### 4.3 Create canonical v1 docs

- `DOCS/V1_SCOPE.md` *(Same artifact as §4.1; file exists — remaining rows below are not done.)*
- `DOCS/ARCHITECTURE_V1.md` *(Canonical v1 system map; consolidates `V1_SCOPE` + `*_V1_EXTRACT.md` — not a new platform proposal.)*
- `DOCS/DATA_MODEL_V1.md` *(Canonical v1 relational model — five tables; indexes/FK notes; `[ERD_V1_EXTRACT](ERD_V1_EXTRACT.md)` baseline, no control-plane entities.)*
- `DOCS/EVENTS_V1.md` *(Canonical v1 state discipline — DB row transitions + DOCS; no broker/outbox/orchestrator; narrows `[EVENTS_V1_EXTRACT](EVENTS_V1_EXTRACT.md)`.)*
- `DOCS/UI_V1.md` *(Canonical v1 routes + tabs — Today, Outcome (+ optional index); narrows `[UI_V1_EXTRACT](UI_V1_EXTRACT.md)`; UX extract = behavior context only.)*
- `DOCS/RELEASE_CRITERIA_V1.md` *(Canonical v1 readiness — L1 implemented / L2 preview / L3 narrow ship; evidence + human gates; narrows `[RFC.md](RFC.md)` FSM “guards” without enterprise policy.)*

### Definition of done

- There is one canonical place for v1 truth.
- Cursor can update docs as implementation evolves.
- No ambiguous "future platform" language remains in v1 docs.

---

## 5. CURSOR GOVERNANCE LAYER

### 5.1 Install Cursor project behavior

- `AGENTS.md` describing solo-founder mode. *(Present — repo root; reconciled **2026-04-23**.)*
- `.cursor/rules/outcome-planner.mdc`. *(Present.)*
- `.cursor/rules/cursor-executor.mdc`. *(Present.)*
- `.cursor/rules/evidence-reviewer.mdc`. *(Present.)*
- `.cursor/rules/release-readiness.mdc`. *(Present.)*
- *(Also in repo, not in the original five-line list:)* `.cursor/rules/subagents-delegation.mdc` — meta-rule for delegating to `.cursor/agents/` per **DEC-002**; complements the four role rules above.

### 5.2 Define strict execution protocol

**Vocabulary (do not mix layers):**


| Layer                      | Where it lives                                                           | What it is                                                                                                                         |
| -------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Phase**                  | `DOCS/MASTER_TODO_CURSOR.md` section headers (e.g. “## 4. …”, “## 5. …”) | Roadmap unit. `DOCS/STATUS.md` **Current Phase** must match a MASTER phase name/status — do not invent parallel “phases”.          |
| **Stage**                  | `AGENTS.md` (“Stage routing”)                                            | Session framing only: `clarify`, `build`, `prove`, `ship`, `recover`. Stages are **not** extra values in `STATUS.md` phase fields. |
| **Session outcome status** | End of a meaningful Cursor run (reported in `STATUS.md` / task notes)    | **Exactly one** of: `blocked`, `working_in_preview`, `verified`, `not_release_ready`. No other machine labels in that slot.        |


**Execution rules:**

- Cursor must always work from **one** active outcome (unless the user explicitly asks for portfolio planning — `AGENTS.md`).
- Cursor must always end a **meaningful** run with **exactly one** session outcome status from the table above.
- `**DOCS/STATUS.md` — update when:** code or governance docs changed meaningfully, phase/task/blocker/evidence honesty changed, or a run completes (even if outcome is “no diff” but truth changed). Touch `updated_at` when the snapshot meaningfully moved.
- `**DOCS/NEXT_STEP.md` — update when:** the **single** next action for the owner/agent **changes**, or immediately after the previously listed step is completed (replace with the next one). If nothing changes, leave file unchanged.
- `**DOCS/DECISIONS.md` — update when:** a **new** decision is accepted or an existing *DEC- entry is materially revised** — not for routine progress. Same bar as `DOCS/INDEX.md` §5.
- **Evidence / readiness canon — update when:** a **verification cycle** completes (prove/ship stage, or user explicitly asks for readiness review): align product evidence and `DOCS/RELEASE_CRITERIA_V1.md` / `STATUS` pointers — do not claim `verified` without meeting that doc’s gates.

### 5.3 Add run brief template

- `DOCS/templates/OUTCOME_BRIEF.md`. *(Present — **2026-04-23**; aligns §5.2 + one-outcome brief.)*
- `DOCS/templates/EVIDENCE_CHECKLIST.md`. *(Present — L1–L3 checkboxes per `RELEASE_CRITERIA_V1`.)*
- `DOCS/templates/RELEASE_REVIEW.md`. *(Present — release review vs L1/L2/L3 + §5.2 status.)*
- `DOCS/templates/SESSION_SUMMARY.md`. *(Present — six-field session pack per `cursor-executor` + §5.2.)*

### Definition of done

- Cursor can be pointed at one active TODO item and execute with minimal ambiguity.
- All future work is tied to outcome + done criteria + evidence.

---

## 6. DATA MODEL V1 (MINIMUM)

Do NOT implement the full ERD first. Implement only minimum entities required for working v1.

**Canonical v1 alignment (2026-04-23):** Product persistence for the governed loop is defined by `**DOCS/DATA_MODEL_V1.md*`* — **five** tables: `project`, `outcome`, `assumption`, `acceptance_criterion`, `evidence_item` (singular names, snake_case). The **§6.1–§6.2** bullets below are **older** scaffolding: plural names (`projects`, `outcomes`), extra tables (`cursor_runs`, `evidence_bundles`, `release_checks`, `flow_definitions`, `change_logs`), `evidence_items.bundle_id`, and fields not in `DATA_MODEL_V1` (e.g. `priority`, `current_stage`, `verification_type`) are **out of scope for v1** unless `V1_SCOPE` / this file is formally revised. For migrations and Drizzle types, **narrow to `DATA_MODEL_V1`**; §6.3 ergonomics (indexes, timestamps, seed) apply to **those five** tables.

### 6.1 Core tables

- `projects`
- `outcomes`
- `assumptions`
- `acceptance_criteria`
- `cursor_runs`
- `evidence_bundles`
- `evidence_items`
- `release_checks`
- `flow_definitions`
- `change_logs`

### 6.2 Fields

- For `projects`: id, name, slug, status.
- For `outcomes`: id, project_id, title, description, status, priority, current_stage.
- For `assumptions`: id, outcome_id, description, criticality, status, defaulted_by_system.
- For `acceptance_criteria`: id, outcome_id, code, description, required, verification_type.
- For `cursor_runs`: id, outcome_id, status, summary, started_at, finished_at.
- For `evidence_bundles`: id, outcome_id, run_id, status, coverage_status, summary.
- For `evidence_items`: id, bundle_id, type, artifact_url, status.
- For `release_checks`: id, outcome_id or project_id, check_name, status, blocking.
- For `flow_definitions`: id, outcome_id, code, actor, steps_json, success_outcome.
- For `change_logs`: id, outcome_id, run_id, what_changed, risks, next_step.

### 6.3 DB ergonomics

- Add indexes on status fields and foreign keys.
- Add created/updated timestamps.
- Add seed data for one sample project.

### Definition of done

- Minimal schema migrated successfully **for the five `DATA_MODEL_V1` entities** (plus indexes / timestamps / seed as in §6.3).
- CRUD for **those** core entities works.
- No full ERD overbuild yet.

---

## 7. APP SHELL + INFORMATION ARCHITECTURE

### 7.1 Global shell

- Build app shell with left nav and top status bar.
- Add sections:
  - Overview
  - Outcomes
  - Assumptions
  - Evidence
  - Release Readiness
  - Docs/Timeline

### 7.2 Shared design system

- Define typography and spacing.
- Add status badges:
  - idea
  - specified
  - building
  - working_in_preview
  - verified
  - approved
  - live
  - blocked
- Add risk badges.
- Add maturity stage badges:
  - prototype
  - usable
  - hardened
  - release-ready
  - live

### Definition of done

- Navigation reflects product workflow, not repo structure.
- UI can host all later screens consistently.

---

## 8. OVERVIEW SCREEN (THE DAILY SCREEN)

Build the most important screen first.

### 8.1 Required blocks

- Current objective (one active outcome)
- Verified outcomes summary
- Blockers summary
- Last change summary
- Release maturity stage
- One next recommended step

### 8.2 Behavior rules

- Never show false green state.
- If evidence incomplete, say so.
- If assumptions unresolved, surface them prominently.
- If risk area touched, surface it prominently.

### Definition of done

- Solo founder can open app and understand state in under 30 seconds.

---

## 9. OUTCOME MANAGEMENT

### 9.1 Outcomes list

- Build list/table of outcomes.
- Show status, risk, verified flag, last updated, next step.
- Allow only one `active` outcome at a time for v1.

### 9.2 Outcome detail page

- Summary
- Flow definition
- Acceptance criteria
- Linked assumptions
- Current run status
- Evidence summary
- Release readiness delta

### 9.3 WIP discipline

- Enforce one active milestone.
- Warn if too many parallel unfinished outcomes.

### Definition of done

- Product work can be driven outcome-by-outcome.
- Cursor always has a clear target.

---

## 10. ASSUMPTIONS SYSTEM

### 10.1 Assumptions CRUD

- Create assumptions list and detail state.
- Support statuses:
  - open
  - auto_defaulted
  - needs_human_decision
  - approved
  - rejected
- Support criticality.

### 10.2 Assumption generation logic

- Add service that generates candidate assumptions from outcome description.
- Mark assumptions as defaulted if they match default decisions.
- Only mark `needs_human_decision` for truly blocking/high-risk cases.

### 10.3 Blocking behavior

- Outcome cannot move to specified/contract-ready if critical assumptions unresolved.
- UI must explain blocker in human language.

### Definition of done

- System no longer silently guesses product behavior.
- Founder sees what the system assumed.

---

## 11. FLOWS AND ACCEPTANCE

### 11.1 Flows

- Build flow definitions per outcome.
- Store simple steps JSON.
- Render readable scenario cards.

### 11.2 Acceptance criteria

- Build acceptance list tied to each outcome.
- Support types:
  - test
  - visual
  - manual_review
  - runtime_check
- Show required vs optional.

### 11.3 Outcome completeness logic

- Outcome cannot be verified if required acceptance missing.

### Definition of done

- Each outcome has explicit done criteria.
- Cursor has target conditions beyond code generation.

---

## 12. CURSOR RUN INTAKE + EXECUTION BRIEF

### 12.1 Run brief generator

- Given one active outcome, generate brief containing:
  - objective
  - assumptions snapshot
  - acceptance criteria
  - allowed scope
  - forbidden zones
  - required checks
  - expected deliverables

### 12.2 Save run metadata

- Save each run request.
- Save generated brief.
- Save resulting summary from Cursor.

### 12.3 Cursor handoff doc

- Create `DOCS/CURRENT_RUN.md` that always contains the active run brief.
- Cursor must read and update it.

### Definition of done

- There is a clean bridge from app state to Cursor work.

---

## 13. "WHAT CHANGED" LAYER

### 13.1 Change summaries

- Build human-readable change card for each run:
  - what changed
  - affected outcomes/flows
  - risks
  - what was checked
  - what remains unproven

### 13.2 Before/after narrative

- Add before/after panel at outcome level.

### Definition of done

- User understands behavioral change without reading diff.

---

## 14. EVIDENCE SYSTEM

### 14.1 Evidence bundle model

- Create evidence bundle per meaningful run.
- Attach evidence items:
  - screenshot
  - video
  - test result
  - verification report
  - note

### 14.2 Evidence capture

- Save Playwright screenshots.
- Save Playwright videos or traces where useful.
- Save test results.
- Save generated summary.

### 14.3 Coverage matrix

- Build mapping: acceptance criterion -> evidence coverage.
- Statuses:
  - covered
  - partial
  - missing
  - failed

### 14.4 UI

- Scenarios tab
- Visual proof tab
- Checks tab
- Coverage tab

### Definition of done

- User can see proof, not just "it should work".

---

## 15. VERIFICATION + QUALITY GATES

### 15.1 Required checks for v1

- lint
- typecheck
- unit tests
- critical integration tests where relevant
- Playwright e2e for core flows

### 15.2 Optional-but-good if time permits

- accessibility spot checks
- basic performance smoke checks
- structured security checklist

### 15.3 Verification result model

- Add pass/fail/insufficient state.
- Explain failures in human language.

### Definition of done

- Verification is a product-facing truth layer, not hidden CI noise.

---

## 16. PREVIEW ENVIRONMENTS

### 16.1 Preview flow

- Generate deploy preview per meaningful change.
- Save preview URL.
- Show preview status in UI.

### 16.2 Preview review UX

- Add "Try it" CTA from outcome and changes screens.
- Link preview to evidence bundle.

### Definition of done

- User can validate behavior in a live environment before release.

---

## 17. RELEASE READINESS

### 17.1 Release screen

- Build dedicated release readiness page.
- Show:
  - unresolved assumptions
  - missing evidence
  - failed checks
  - unsupported risk areas
  - rollback readiness
  - final go/no-go

### 17.2 Rules

- Not release-ready if critical assumptions unresolved.
- Not release-ready if required acceptance uncovered.
- Not release-ready if required checks fail.
- Not release-ready if evidence incomplete.

### 17.3 Final review language

- Show exactly why release is blocked.
- Show one next step.

### Definition of done

- User cannot fool themselves into shipping an unproven outcome.

---

## 18. RUNTIME ASSURANCE (V1 LIGHT)

### 18.1 Minimal post-release layer

- Add deployment record.
- Add post-release checks placeholder.
- Add runtime incident/event table.
- Add rollback event model.

### 18.2 Minimal runtime UI

- Show last deployment status.
- Show active incidents.
- Show contract/runtime drift if detected.

### Definition of done

- The system doesn't stop caring after deploy.

---

## 19. EVENT MODEL V1 (SIMPLIFIED)

Do NOT build full Kafka infra first.

### 19.1 Implement application-level domain events in code

- `intent.created`
- `assumptions.resolved`
- `contract.drafted`
- `change.created`
- `execution.run_started`
- `verification.passed`
- `evidence.completed`
- `approval.granted`
- `deployment.succeeded`
- `drift.detected`
- `change.state_transitioned`

### 19.2 Store events in DB log first

- Add `event_log` table.
- Add event envelope fields.
- Add idempotency key.
- Add correlation id.

### 19.3 No Kafka until real need appears

- If async needed, use DB-backed outbox/worker.

### Definition of done

- System is event-aware and replayable enough for v1 without infra overkill.

---

## 20. FSM V1

Implement a simplified FSM for outcomes/change progression.

### States

- `idea`
- `specified`
- `building`
- `working_in_preview`
- `verified`
- `approved`
- `live`
- `blocked`
- `not_release_ready`

### Guards

- `specified` only if critical assumptions resolved.
- `working_in_preview` only if runnable preview exists.
- `verified` only if required checks + evidence pass.
- `approved` only if behavior review done.
- `live` only if release readiness passes.

### Definition of done

- Product status is computable, not vibes-based.

---

## 21. STATUS + TIMELINE

### 21.1 Timeline

- Build human-readable timeline:
  - you asked for X
  - assumptions clarified
  - feature built
  - tested
  - proof collected
  - approved / blocked

### 21.2 Status docs

- Keep `DOCS/STATUS.md` updated after each milestone.
- Keep `DOCS/NEXT_STEP.md` containing exactly one recommended next step.

### Definition of done

- After a break, founder can recover context in under 2 minutes.

---

## 22. SAMPLE SEED PROJECT / DEMO FLOW

Choose one canonical demo flow and finish it end-to-end.

### Recommended canonical demo

- Booking cancellation flow without real payments.

### Required demo outcomes

- User can create booking.
- User can cancel booking.
- Cancellation policy is explicit.
- System shows before/after change summary.
- Evidence covers critical acceptance criteria.
- Release readiness works.

### Definition of done

- There is one working demo flow proving the architecture.

---

## 23. TEST PLAN

### Unit tests

- core status computations
- assumption blocking logic
- release readiness logic
- evidence coverage aggregation

### Integration tests

- outcome creation -> assumptions -> acceptance creation
- run -> evidence -> verified
- blocked state on missing evidence

### E2E tests

- create project
- create outcome
- resolve assumptions
- run through preview
- open evidence screen
- view release readiness

### Definition of done

- Core trust model is test-covered.

---

## 24. DEPLOYMENT

### 24.1 Staging/preview

- Configure Vercel previews.
- Configure Supabase environments as needed.

### 24.2 Production

- Add production env variables.
- Add migration strategy.
- Add rollback basics.

### Definition of done

- App is deployable and recoverable.

---

## 25. POLISH ONLY AFTER TRUST LOOP WORKS

Do NOT polish before the trust loop works.

Polish allowed only after:

- one canonical flow is fully working;
- evidence bundle is real;
- release screen is honest;
- founder can recover context quickly.

Then and only then:

- Improve visual design.
- Improve flow editor UX.
- Improve timeline.
- Add richer docs indexing.
- Add more supported envelopes.

---

## 26. WHAT COUNTS AS V1 DONE

V1 is done only if all are true:

- one supported envelope is real and explicit;
- one end-to-end demo outcome is completed;
- assumptions are visible and block when needed;
- acceptance criteria exist and are enforced;
- Cursor can work from generated brief;
- evidence bundle is real, not fake;
- release readiness blocks unsafe shipping;
- UI is behavior-first;
- founder can tell in 30 seconds what is done, blocked, and next.

---

## 27. ORDER OF EXECUTION (STRICT)

Cursor should execute in this exact order:

1. Repo bootstrap
2. Docs normalization
3. Cursor governance files
4. Minimal DB schema
5. App shell
6. Overview screen
7. Outcomes
8. Assumptions
9. Flows + acceptance
10. Run brief generation
11. What changed layer
12. Evidence bundle
13. Verification gates
14. Preview integration
15. Release readiness
16. Minimal runtime assurance
17. Simplified event log
18. Simplified FSM
19. Demo flow
20. Tests
21. Deploy
22. Polish

Do not jump ahead unless an earlier step strictly depends on a tiny piece of a later step.

---

## 28. REQUIRED OUTPUT AFTER EACH MAJOR PHASE

After each major phase, Cursor must update:

- `DOCS/STATUS.md`
- `DOCS/NEXT_STEP.md`
- `DOCS/DECISIONS.md`

And must write:

- what is implemented;
- what is still fake/stubbed;
- what is blocked;
- what the next exact step is.

---

## 29. FINAL INSTRUCTION TO CURSOR

Work through this TODO sequentially.
Do not optimize for looking advanced.
Optimize for producing a trustworthy solo-founder workflow.
When in doubt, choose the smallest implementation that preserves:

- explicit assumptions,
- explicit acceptance,
- real evidence,
- honest release readiness.