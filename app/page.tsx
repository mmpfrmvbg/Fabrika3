import Link from "next/link";

import { MetaLabel } from "@/components/v1/meta-label";
import { SectionCard } from "@/components/v1/section-card";
import {
  MATURITY_BADGES,
  RISK_BADGES,
  StatusBadge,
  WORK_STATUS_BADGES,
} from "@/components/v1/status-badge";

/**
 * Today on `/` per `UI_V1.md` §3.1 + `MASTER` §8.1 (six static overview blocks).
 * Honest copy only — no API, no forms, no product flows (`MASTER` §8.2: no false green).
 */
export default function Home() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <SectionCard
        id="overview"
        eyebrow="Today (overview)"
        title="Where we are — static orientation"
      >
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          This page is the v1 <strong className="text-foreground">Today</strong> shell described in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">DOCS/UI_V1.md</code> §3.1.
          The six blocks below mirror <code className="rounded bg-muted px-1 py-0.5">MASTER</code> §8.1;
          copy is static and aligned with <code className="rounded bg-muted px-1 py-0.5">DOCS/STATUS.md</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5">RELEASE_CRITERIA_V1.md</code>, and{" "}
          <code className="rounded bg-muted px-1 py-0.5">UX_V1_EXTRACT.md</code> (governance backstop in{" "}
          <code className="rounded bg-muted px-1 py-0.5">DOCS/</code> until the UI is wired).
        </p>
        <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <span>UI data layer:</span>
          <StatusBadge variant="no_api" />
          <span className="text-muted-foreground">Backend HTTP baseline exists separately — not fetched here.</span>
        </p>

        <div className="space-y-4 border-t border-border pt-5">
          <SectionCard
            className="bg-muted/20 p-4 shadow-none"
            eyebrow="MASTER §8.1 — block 1"
            title="Current objective (one active outcome)"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ship an honest Phase 7 <strong className="text-foreground">Today</strong> surface (shell + §8.1
              blocks) before the browser calls <code className="rounded bg-muted px-1 py-0.5">/api/*</code>.{" "}
              <strong className="text-foreground">No outcome row</strong> is loaded, highlighted, or set{" "}
              <code className="rounded bg-muted px-1 py-0.5">active</code> in this UI yet — that requires later
              work (see <code className="rounded bg-muted px-1 py-0.5">MASTER</code> order: Outcomes).
            </p>
          </SectionCard>

          <SectionCard
            className="bg-muted/20 p-4 shadow-none"
            eyebrow="MASTER §8.1 — block 2"
            title="Verified outcomes summary"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              There is <strong className="text-foreground">no live list</strong> of outcomes here, so this cannot
              show counts, filters, or per-row readiness. Separately, the repo has a{" "}
              <strong className="text-foreground">verified HTTP baseline</strong> for the five{" "}
              <code className="rounded bg-muted px-1 py-0.5">DATA_MODEL_V1</code> entities (scripts +{" "}
              <code className="rounded bg-muted px-1 py-0.5">DOCS/STATUS.md</code>) — that proves API + DB wiring
              for engineers, <strong className="text-foreground">not</strong> an L2/L3 “verified shipping
              outcome” claim for end users per{" "}
              <code className="rounded bg-muted px-1 py-0.5">RELEASE_CRITERIA_V1.md</code>.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <MetaLabel className="text-[10px] sm:text-[11px]">Work posture (honest)</MetaLabel>
              <StatusBadge variant="building" />
              <StatusBadge variant="not_release_ready" />
            </div>
          </SectionCard>

          <SectionCard
            className="bg-muted/20 p-4 shadow-none"
            eyebrow="MASTER §8.1 — block 3"
            title="Blockers summary"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              <code className="rounded bg-muted px-1 py-0.5">DOCS/STATUS.md</code> reports{" "}
              <strong className="text-foreground">no open engineering blockers</strong> for this milestone.
              Product-style blockers (unresolved assumptions, missing evidence, readiness stops per{" "}
              <code className="rounded bg-muted px-1 py-0.5">UX_V1_EXTRACT.md</code> §4) are{" "}
              <strong className="text-foreground">not surfaced here</strong> because Outcome data is not bound to
              the UI yet.
            </p>
          </SectionCard>

          <SectionCard
            className="bg-muted/20 p-4 shadow-none"
            eyebrow="MASTER §8.1 — block 4"
            title="Last change summary"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              This block is <strong className="text-foreground">not connected</strong> to git, CI, or the
              database. For a human-readable timeline, use <code className="rounded bg-muted px-1 py-0.5">DOCS/STATUS.md</code>{" "}
              (<span className="italic">What Was Completed</span>) and commit history;{" "}
              <code className="rounded bg-muted px-1 py-0.5">UI_V1.md</code> allows only a short honesty line until
              real inputs exist.
            </p>
          </SectionCard>

          <SectionCard
            className="bg-muted/20 p-4 shadow-none"
            eyebrow="MASTER §8.1 — block 5"
            title="Release maturity stage"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              Whole-product release is <strong className="text-foreground">not</strong> the bar at this layer.
              Maturity for what you see in the browser: <strong className="text-foreground">prototype</strong> shell,{" "}
              <code className="rounded bg-muted px-1 py-0.5">not_release_ready</code> for a vertical slice, and no
              implied L2/L3 gates from this page alone (<code className="rounded bg-muted px-1 py-0.5">RELEASE_CRITERIA_V1.md</code>).
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              <StatusBadge variant="prototype" />
              <StatusBadge variant="not_release_ready" />
              <StatusBadge variant="building" />
            </div>
          </SectionCard>

          <SectionCard
            className="bg-muted/20 p-4 shadow-none"
            eyebrow="MASTER §8.1 — block 6"
            title="One next recommended step"
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              Follow the <strong className="text-foreground">single</strong> action in{" "}
              <code className="rounded bg-muted px-1 py-0.5">DOCS/NEXT_STEP.md</code> after each merge (mirrors the
              UX rule: one concrete next move, not a pile of parallel “you should…” items). This UI does not read
              that file — maintainers still open the doc.
            </p>
          </SectionCard>
        </div>
      </SectionCard>

      <SectionCard id="outcomes" title="Outcomes">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Per <code className="rounded bg-muted px-1 py-0.5">UI_V1</code>, deep work eventually moves to{" "}
          <code className="rounded bg-muted px-1 py-0.5">/outcomes/[id]</code> with tabs (Summary, Assumptions,
          Acceptance, Evidence, Readiness). That detail route is <strong className="text-foreground">not</strong> built
          yet.
        </p>
        <p className="text-sm text-muted-foreground">
          Optional index surface:{" "}
          <Link href="/outcomes" className="font-medium text-primary underline-offset-4 hover:underline">
            /outcomes
          </Link>{" "}
          — read-only index: server-side GET to existing APIs (sample project); no CRUD UI, no detail route. This Today
          section still does not load outcomes itself.
        </p>
        <p className="text-xs text-muted-foreground">
          Reserved for v1 — not implemented beyond shell + read-only index.
        </p>
      </SectionCard>
      <PlaceholderSection
        id="assumptions"
        title="Assumptions"
        body="Assumption lists and resolution flows stay inside the Outcome workspace in v1 — not a standalone product area in this shell step."
      />
      <PlaceholderSection
        id="evidence"
        title="Evidence"
        body="Evidence stays under Outcome → Evidence in v1. No proof gallery or uploads in this milestone."
      />
      <PlaceholderSection
        id="release-readiness"
        title="Release Readiness"
        body="Readiness mirrors DATA_MODEL_V1 enums and RELEASE_CRITERIA_V1 — UI is not implemented here yet."
      />
      <PlaceholderSection
        id="docs-timeline"
        title="Docs / Timeline"
        body="Docs-first workflow continues in the repository DOCS/ tree; an in-app timeline is out of scope for this minimal shell."
      />

      <SectionCard
        eyebrow="Design system (static demo)"
        title="MASTER §7.2 — badge vocabulary"
      >
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Display-only reference for later screens. Not connected to API or database. See{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">DOCS/MASTER_TODO_CURSOR.md</code> §7.2.
        </p>
        <div className="space-y-5 border-t border-border pt-4">
          <div>
            <MetaLabel className="mb-2 block">Work status</MetaLabel>
            <div className="flex flex-wrap gap-1.5">
              {WORK_STATUS_BADGES.map((v) => (
                <StatusBadge key={v} variant={v} />
              ))}
            </div>
          </div>
          <div>
            <MetaLabel className="mb-2 block">Maturity</MetaLabel>
            <div className="flex flex-wrap gap-1.5">
              {MATURITY_BADGES.map((v) => (
                <StatusBadge key={v} variant={v} />
              ))}
            </div>
          </div>
          <div>
            <MetaLabel className="mb-2 block">Risk (minimal ladder)</MetaLabel>
            <div className="flex flex-wrap gap-1.5">
              {RISK_BADGES.map((v) => (
                <StatusBadge key={v} variant={v} />
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function PlaceholderSection({
  id,
  title,
  body,
}: {
  id: string;
  title: string;
  body: string;
}) {
  return (
    <SectionCard id={id} title={title}>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
      <p className="text-xs text-muted-foreground">
        Reserved for v1 — not implemented beyond shell + design primitives.
      </p>
    </SectionCard>
  );
}
