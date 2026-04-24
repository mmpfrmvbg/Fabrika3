/** Route-level loading UI while `/outcomes` data resolves (P7-9-2). */
export default function OutcomesLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <div className="h-3 w-32 animate-pulse rounded bg-muted" />
        <div className="h-7 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
      </div>
      <div className="h-40 animate-pulse rounded-xl border border-border bg-muted/30" />
      <div className="h-32 animate-pulse rounded-xl border border-border bg-muted/20" />
    </div>
  );
}
