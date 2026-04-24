# Evidence checklist (template)

Tie proof to `DOCS/RELEASE_CRITERIA_V1.md` **L1–L3**. Use per outcome / vertical slice.

## L1 — Implemented
- [ ] Change in repo (code or material docs)
- [ ] Baseline checks when relevant: `typecheck` / `lint` / `test` / `build` _(see `DOCS/V1_SCOPE.md` §5)_

## L2 — Verified for preview
- [ ] All **L1** items
- [ ] Preview or manual repro path documented
- [ ] ≥1 non-draft **evidence** row (DB or appendix) for claimed behavior
- [ ] No required acceptance in `failed` without explicit waiver
- [ ] No open **critical** assumption for the demoed scope
- [ ] Known gaps written _(note / `release_readiness_note`)_

## L3 — Ready to ship (narrow slice)
- [ ] All **L2** items
- [ ] Required acceptance: `satisfied` or explicit `waived` with owner risk note
- [ ] High/critical assumptions: `approved` or `rejected` with resolution
- [ ] Evidence not `draft` for shipped claims; stale proof updated
- [ ] Owner explicitly chose **`verified`** only if every **L3** gate in `RELEASE_CRITERIA_V1` passes

## Proof log _(append)_
| ref | evidence_type | summary | artifact_ref |
|-----|-----------------|--------|----------------|
| _…_ | _link / test_result / …_ | _…_ | _…_ |
