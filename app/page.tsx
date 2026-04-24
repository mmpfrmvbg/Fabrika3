import { MetaLabel } from "@/components/v1/meta-label";
import { SectionCard } from "@/components/v1/section-card";
import {
  MATURITY_BADGES,
  RISK_BADGES,
  StatusBadge,
  WORK_STATUS_BADGES,
} from "@/components/v1/status-badge";

/**
 * Today placeholder on `/` per `UI_V1.md` (§3.1) + static §7.2 badge reference (P7-7-2).
 * Honest copy only — no API, no forms, no product flows.
 */
export default function Home() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <SectionCard
        id="overview"
        eyebrow="Today (overview) — placeholder"
        title="Where we are"
      >
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          This route will become the v1 <strong className="text-foreground">Today</strong> surface
          described in <code className="rounded bg-muted px-1 py-0.5 text-foreground">DOCS/UI_V1.md</code>{" "}
          (orientation, one next focus, blockers, readiness in plain language). Right now it is only
          the global shell: sidebar and top bar per <code className="rounded bg-muted px-1 py-0.5">MASTER</code>{" "}
          §7.1 — no live project data,{" "}
          <strong className="text-foreground">no API calls from the browser</strong>, and no auth UI.
        </p>
        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li>
            Backend: canonical five-entity HTTP CRUD is exercised via scripts and documented in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-foreground">DOCS/STATUS.md</code> — not
            wired here by design in this milestone.
          </li>
          <li>
            Governance truth remains in <code className="rounded bg-muted px-1 py-0.5">DOCS/</code>{" "}
            (e.g. <code className="rounded bg-muted px-1 py-0.5">STATUS.md</code>,{" "}
            <code className="rounded bg-muted px-1 py-0.5">NEXT_STEP.md</code>) until product UI
            catches up.
          </li>
          <li className="flex flex-wrap items-center gap-2">
            <span>Release posture:</span>
            <StatusBadge variant="not_release_ready" />
          </li>
        </ul>
      </SectionCard>

      <PlaceholderSection
        id="outcomes"
        title="Outcomes"
        body="Per UI_V1, primary deep work moves to /outcomes/[id] with tabs (Summary, Assumptions, Acceptance, Evidence, Readiness). None of that is built in this step."
      />
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
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">DOCS/MASTER_TODO_CURSOR.md</code>{" "}
          §7.2.
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
