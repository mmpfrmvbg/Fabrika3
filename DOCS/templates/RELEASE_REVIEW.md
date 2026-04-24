# Release review (template)

Aligns with `DOCS/RELEASE_CRITERIA_V1.md` **§2–§3 (L1 / L2 / L3)**. Pick **one** claimed level and prove it; do not claim **L3** without every L3 gate.

## Outcome
- **id / title:** _…_

## Claimed readiness level _(one)_
- [ ] **L1 — Implemented**
- [ ] **L2 — Verified for preview**
- [ ] **L3 — Ready to ship (narrow slice)**

## Gate checklist
_Re-copy or tick the rows from `RELEASE_CRITERIA_V1` §3 for the level you claim._

### L1
- [ ] _…_

### L2 _(if claiming L2+)_
- [ ] _…_

### L3 _(if claiming L3 only)_
- [ ] _…_

## Blockers / no-go _(from `RELEASE_CRITERIA_V1` §6)_
_…_

## Session outcome status (`MASTER` §5.2 — exactly one)
`blocked` · `working_in_preview` · `verified` · `not_release_ready`

## Product readiness field _(if using DB)_
`outcome.release_readiness`: _not_assessed / not_release_ready / working_in_preview / verified_ — must match honesty above.
