# Project subagents (Fabrika3)

Prompts in `.cursor/agents/*.md` **support** `DOCS/MASTER_TODO_CURSOR.md`; they do **not** replace `DOCS/` or root `AGENTS.md`.

## Invocation

- Use the Cursor agent UI if it lists project agents from `.cursor/agents/`.
- Otherwise: @-mention one file + paste current `DOCS/STATUS.md` / `DOCS/NEXT_STEP.md`, and instruct the model to follow **only** that file’s role for one turn.

**Version caveat:** IDE surfaces differ by Cursor release; prompts remain portable.

## Subagents (final roles)

| `name` | Does | Never |
|--------|------|-------|
| **repo-researcher** | Read-only facts: tree, configs, deps, mechanical map from `NEXT_STEP` to paths | Writes files; outcomes/acceptance/proof/ship verdicts |
| **outcome-planner** | One outcome, assumptions, required acceptance, scope + **ALLOWED_PATHS** contract for implementer | Code; repo deep-scan; proof or lane decisions |
| **outcome-implementer** | Minimal change **only** inside **ALLOWED_PATHS**; stops on `scope_exceeded` | Product decisions; edits outside allowlist; “verified”/“release-ready” |
| **evidence-reviewer** | Table: required acceptance → cited evidence; **`go` only if all required `covered` and zero `failed`** | Code; scope planning; release **PASS/FAIL** |
| **release-gate** | **`DECISION(lane): PASS`** or **`FAIL`** per lane + **one** next step | Code; per-acceptance evidence tables (use evidence-reviewer first) |

## Main agent

Read `DOCS/` first; one phase, one task, one next step; update `STATUS` / `NEXT_STEP` / `DECISIONS` after meaningful progress.

## Rules sibling

See `.cursor/rules/subagents-delegation.mdc` for when to delegate vs update docs.
