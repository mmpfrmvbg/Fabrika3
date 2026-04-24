# Fabrika3

Fabrika3 is a **single-repo** workspace building a v1 **governed product-to-code** system for a solo founder / non-coder: intent becomes an explicit outcome with assumptions and acceptance, execution stays bounded, evidence is collected, and release readiness is stated honestly (see target v1 in [`DOCS/MASTER_TODO_CURSOR.md`](DOCS/MASTER_TODO_CURSOR.md) §2).

## Source of truth

Work order, phases, and definitions of done live in **`DOCS/`**, not in this README.

| Document | Role |
|----------|------|
| [`DOCS/MASTER_TODO_CURSOR.md`](DOCS/MASTER_TODO_CURSOR.md) | Canonical backlog and execution order (read this first). |
| [`DOCS/STATUS.md`](DOCS/STATUS.md) | Current phase, task, and honest progress. |
| [`DOCS/NEXT_STEP.md`](DOCS/NEXT_STEP.md) | Exactly one recommended next action. |
| [`DOCS/DECISIONS.md`](DOCS/DECISIONS.md) | Recorded decisions (e.g. repo layout). |

Operational entrypoint for Cursor: [`KICKOFF.md`](KICKOFF.md). Solo-founder behavior rules: [`AGENTS.md`](AGENTS.md).

## What is already in this repository

- **`DOCS/`** — master todo, status, next step, decisions, RFC and other conceptual docs.
- **`KICKOFF.md`**, **`AGENTS.md`** — how Cursor should run the project without inventing parallel plans.
- **`.cursor/rules/`**, **`.cursor/agents/`** — Cursor rules and optional subagent prompts (supporting docs-first workflow).
- **`package.json`** — Next.js **15** + **React 19** + **TypeScript** + **Tailwind v4** (App Router) per [`DOCS/MASTER_TODO_CURSOR.md`](DOCS/MASTER_TODO_CURSOR.md) §3.2; shadcn/ui (base-nova); **Drizzle ORM + `pg`** ([`db/`](db/), [`drizzle.config.ts`](drizzle.config.ts)); **Supabase Auth wiring** — [`lib/supabase/client.ts`](lib/supabase/client.ts), [`lib/supabase/server.ts`](lib/supabase/server.ts), session refresh in [`lib/supabase/middleware.ts`](lib/supabase/middleware.ts) + root [`middleware.ts`](middleware.ts) (no auth UI). Env template: [`.env.example`](.env.example).
- **`playwright/`** — e2e smoke specs (`playwright/e2e/`) + root `playwright.config.ts` (system **Microsoft Edge** via `channel: 'msedge'` to avoid downloading Playwright’s Chromium when disk is tight; use bundled browsers + `npx playwright install` if you prefer).

## What is not here yet (honest status)

- **§3.2 stack bootstrap** — Next, shadcn, Drizzle, Supabase wiring, Vitest, and Playwright smoke are in place (see `DOCS/STATUS.md` for evidence). **Prettier** is still intentionally absent.
- **§3.3 repo quality floor** — npm scripts for `dev` / `build` / `lint` / `typecheck` / `test` / `test:e2e` / `db:generate` / `db:migrate` are present; **clean bootstrap from zero** is documented below and was verified with **`npm ci`** plus `typecheck`, `lint`, `test`, and `build` on a Windows dev machine (see `DOCS/STATUS.md`). **Husky / lint-staged** are **intentionally deferred** for v1 (see **DEC-004** in `DOCS/DECISIONS.md`).
- **No product features** beyond the default Next home page; **no release evidence** beyond a local `next build` smoke check.

Do **not** treat this README as “production ready” or “feature complete”; follow **`DOCS/STATUS.md`** for the real state.

## Local run (bootstrap)

**Prerequisites:** Node.js **20+** (LTS recommended) and **npm** (comes with Node). Commit **`package-lock.json`** is part of the repo — use a clean install when you want a reproducible tree.

### Clean install from zero (reproducible)

From the repository root, in order:

1. **Clone and enter the repo** (replace URL with yours).
2. **Install dependencies** — prefer a lockfile-clean install:
   ```bash
   npm ci
   ```
   If you do not have a lockfile or hit tooling issues, `npm install` is acceptable; results may differ slightly from `npm ci`.
3. **Environment** — copy the template and edit values as needed for Drizzle / Supabase:
   ```bash
   cp .env.example .env.local   # Windows (cmd/PowerShell): copy .env.example .env.local
   ```
   Set `DATABASE_URL` for Drizzle CLI (`db:generate` / `db:migrate`) and server code when used; set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for Supabase. Middleware skips Supabase session refresh if the public vars are unset (local smoke without Supabase is OK).
4. **Verify the toolchain** (no DB required for these):
   ```bash
   npm run typecheck && npm run lint && npm test && npm run build
   ```
5. **Dev server** (optional after the above):
   ```bash
   npm run dev
   ```
   Dev server: [http://localhost:3000](http://localhost:3000) (Turbopack; see `package.json`). The default app route does **not** open a DB connection; `getDb()` is for upcoming server-side usage.

**E2E (`npm run test:e2e`):** not part of the minimal chain above. On **Windows**, the default Playwright config uses **system Microsoft Edge** so you are not required to run `npx playwright install` (see **DEC-003**). On **Linux / CI** without Edge, you may need bundled browsers (`npx playwright install chromium` or your chosen project) and/or config changes — see `playwright.config.ts` and `DOCS/DECISIONS.md`.

**Drizzle CLI:** `npm run db:generate` and `npm run db:migrate` need a valid **`DATABASE_URL`** (and a reachable Postgres for migrate). Failing or placeholder URLs are a **documented** blocker for those commands only, not for `typecheck` / `lint` / `test` / `build`.

**Sample data (phase 6):** after migrations, `npm run db:seed:sample-project` inserts **one** canonical `project` row (idempotent slug `fabrika-v1-sample`; see `scripts/seed-sample-project.mjs` and `DOCS/STATUS.md`).

### Quick path (daily dev)

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
# Edit .env.local — set DATABASE_URL (Drizzle), NEXT_PUBLIC_SUPABASE_URL and
# NEXT_PUBLIC_SUPABASE_ANON_KEY (Supabase). Middleware skips Supabase if those are unset.
npm run dev
```

Other useful commands:

```bash
npm run typecheck   # TypeScript (tsc --noEmit), no emit
npm test            # Vitest (unit smoke; `vitest run`)
npm run test:e2e    # Playwright smoke (starts `npm run dev` via webServer; system Edge)
npm run db:generate # Drizzle: emit SQL from ./db/schema.ts → ./db/migrations (needs env; see Drizzle docs)
npm run db:migrate  # Drizzle: apply migrations (requires DATABASE_URL and a reachable Postgres)
npm run db:seed:sample-project  # Inserts one sample project row (requires DATABASE_URL + migrated schema)
npm run build   # production build (Turbopack)
npm run start   # run production server (after build)
npm run lint    # ESLint (Next core-web-vitals + TypeScript)
```

Formatting: **Prettier is intentionally not installed** for this bootstrap — ESLint + TypeScript cover the minimum; add Prettier later only if the team needs stricter style automation (see `DOCS/STATUS.md` notes).

Always read [`DOCS/NEXT_STEP.md`](DOCS/NEXT_STEP.md) and [`DOCS/STATUS.md`](DOCS/STATUS.md) before picking work beyond this bootstrap.

## Cursor Ops Pack (legacy section)

The original ops pack mentioned optional root files such as `CURSOR_SYSTEM_PROMPT.md`; **that file is not in this repository**. State templates live under `DOCS/`:

- `DOCS/STATUS_TEMPLATE.md`, `DOCS/NEXT_STEP_TEMPLATE.md`, `DOCS/DECISIONS_TEMPLATE.md`

**How to use (summary):** keep `MASTER_TODO` in `DOCS/`, maintain `STATUS` / `NEXT_STEP` / `DECISIONS`, and instruct Cursor to follow **`DOCS/MASTER_TODO_CURSOR.md`** and update those files after each meaningful step.
