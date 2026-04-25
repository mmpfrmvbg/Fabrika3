import Link from "next/link";

import { MetaLabel } from "@/components/v1/meta-label";
import { SectionCard } from "@/components/v1/section-card";
import { StatusBadge } from "@/components/v1/status-badge";

export const metadata = {
  title: "Outcome detail — Fabrika3",
};

type OutcomeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OutcomeDetailPage({ params }: OutcomeDetailPageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <SectionCard eyebrow="Outcome detail (read-only skeleton)" title="Outcome workspace">
        <p className="text-sm leading-relaxed text-muted-foreground">
          This route is a <strong className="text-foreground">read-only skeleton</strong> for MASTER §9.2. It does
          not fetch live outcome detail yet, does not include forms or mutation controls, and must not be interpreted
          as release readiness proof.
        </p>
        <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>State:</span>
          <StatusBadge variant="building" />
          <span>Read-only skeleton</span>
          <StatusBadge variant="not_release_ready" />
          <StatusBadge variant="prototype" />
        </p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <MetaLabel>Route parameter (display only, no fetch)</MetaLabel>
          <p className="break-all font-mono">id: {id}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          <Link href="/outcomes" className="font-medium text-primary underline-offset-4 hover:underline">
            ← Back to outcomes list
          </Link>
        </p>
      </SectionCard>

      <SectionCard eyebrow="Summary" title="Summary (placeholder)">
        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li>Title, description, and current status will be shown here after read-only detail loading is implemented.</li>
          <li>This skeleton intentionally avoids fake dynamic data.</li>
        </ul>
      </SectionCard>

      <SectionCard eyebrow="Assumptions" title="Assumptions (placeholder)">
        <p className="text-sm text-muted-foreground">
          Placeholder only: no assumptions are loaded on this route yet.
        </p>
      </SectionCard>

      <SectionCard eyebrow="Acceptance" title="Acceptance criteria (placeholder)">
        <p className="text-sm text-muted-foreground">
          Placeholder only: no acceptance criteria are loaded on this route yet.
        </p>
      </SectionCard>

      <SectionCard eyebrow="Evidence" title="Evidence (placeholder)">
        <p className="text-sm text-muted-foreground">
          Placeholder only: no evidence bundle is loaded on this route yet.
        </p>
      </SectionCard>

      <SectionCard eyebrow="Release readiness delta" title="Readiness (placeholder)">
        <p className="text-sm text-muted-foreground">
          Placeholder only: this page does not compute release readiness and remains <code className="rounded bg-muted px-1">not_release_ready</code>.
        </p>
      </SectionCard>
    </div>
  );
}
