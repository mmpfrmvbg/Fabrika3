# KICKOFF.md

## Purpose

This file is the first command-scenario for Cursor. Its job is to start work from zero **without improvising**, **without skipping phases**, and **without declaring false readiness**.

Cursor must treat this file as the operational entrypoint for the whole project.

---

## Start Command for Cursor

Use the following as the first working instruction:

```text
You are starting this project from zero.

Work strictly by the documents in `DOCS/`.
Your source of truth is:
1. `DOCS/MASTER_TODO_CURSOR.md`
2. `DOCS/STATUS.md`
3. `DOCS/NEXT_STEP.md`
4. `DOCS/DECISIONS.md`
5. all architecture docs in `DOCS/`

Rules:
- Do not invent a parallel plan.
- Do not skip phases.
- Do not jump ahead to later architecture.
- Do not optimize for elegance over completion.
- Do not declare anything production-ready without evidence.
- Always keep exactly one active phase, one active task, and one next step.
- If something is ambiguous, prefer the default decisions already captured in docs.
- If a missing decision blocks the current phase, write the blocker clearly into `DOCS/STATUS.md` and `DOCS/NEXT_STEP.md`.

Execution protocol:
1. Read all files in `DOCS/`.
2. Summarize the current state in 10 bullets max.
3. Identify the first unfinished phase in `DOCS/MASTER_TODO_CURSOR.md`.
4. Choose exactly one active task inside that phase.
5. Execute only that task.
6. After the task, update:
   - `DOCS/STATUS.md`
   - `DOCS/NEXT_STEP.md`
   - `DOCS/DECISIONS.md` (only if a decision was made)
7. Then stop and report:
   - what was done,
   - what files changed,
   - whether the task is truly complete,
   - what the single next step is.

Definition of done for each step:
- code or docs changed if needed,
- local consistency checked,
- related docs updated,
- no fake claims of completeness,
- next step reduced to one concrete action.

Your first action now:
Read `DOCS/` and begin with the earliest unfinished phase.
```

---

## Required Behavior

Cursor must behave like a **disciplined execution engine**, not like an open-ended brainstorming assistant.

### Cursor must
- follow the order from `MASTER_TODO_CURSOR.md`
- treat `STATUS.md` as the current truth of project state
- treat `NEXT_STEP.md` as the only immediate action target
- update docs after every meaningful change
- keep progress visible in human language
- surface blockers immediately
- stop when the current task is done

### Cursor must not
- start redesigning the system before current phase is finished
- introduce new parallel workstreams
- silently broaden scope
- claim "done" when only happy-path works
- skip evidence/release gates
- ask the user to manually manage engineering discipline that the docs already define

---

## Output Format After Each Run

After each run, Cursor should report in this shape:

```text
Completed:
- ...

Changed files:
- ...

Current phase:
- ...

Current task status:
- done / blocked / partial

Why this is not fully done yet:
- ...

Single next step:
- ...
```

---

## Escalation Rule

If Cursor cannot continue, it must stop with a **single explicit blocker**, not a vague paragraph.

Format:

```text
BLOCKER:
<one sentence>

WHY IT BLOCKS:
<one sentence>

NEXT REQUIRED DECISION OR ACTION:
<one sentence>
```

---

## Intent

This file exists to prevent three failure modes:
1. false progress,
2. endless branching,
3. loss of project context.

If Cursor follows this file together with `MASTER_TODO_CURSOR.md`, it should behave like a controlled builder that can carry the project forward phase by phase with minimal dependence on the user.
