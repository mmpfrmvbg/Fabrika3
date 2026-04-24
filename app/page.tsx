/**
 * P7-app-shell-7-1-minimal: “Today” placeholder on `/` per `UI_V1.md` (§3.1).
 * Honest empty / not-built-yet copy only — no API, no forms, no product flows.
 */
export default function Home() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <section id="overview" className="scroll-mt-16 space-y-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Today (overview) — placeholder
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Where we are
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          This route will become the v1 <strong className="text-foreground">Today</strong> surface
          described in <code className="rounded bg-muted px-1 py-0.5 text-foreground">DOCS/UI_V1.md</code>{" "}
          (orientation, one next focus, blockers, readiness in plain language). Right now it is only
          the global shell: sidebar and top bar per <code className="rounded bg-muted px-1 py-0.5">MASTER</code>{" "}
          §7.1 — no live project data, no API calls from the browser, and no auth UI.
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
          <li>Release posture: <span className="text-foreground">not_release_ready</span>.</li>
        </ul>
      </section>

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
    <section id={id} className="scroll-mt-16 space-y-2 border-t border-border pt-8">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
      <p className="text-xs text-muted-foreground">Reserved for v1 — not implemented in P7-app-shell-7-1-minimal.</p>
    </section>
  );
}
