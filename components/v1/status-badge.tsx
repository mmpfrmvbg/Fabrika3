import { cn } from "@/lib/utils";

/**
 * Static pill tokens from `MASTER` §7.2 (work status, maturity, risk) + shell honesty labels.
 * Display-only — no data binding (P7-7-2).
 */
export type BadgeVariant =
  | "idea"
  | "specified"
  | "building"
  | "working_in_preview"
  | "verified"
  | "approved"
  | "live"
  | "blocked"
  | "prototype"
  | "usable"
  | "hardened"
  | "release-ready"
  | "risk-low"
  | "risk-medium"
  | "risk-high"
  | "risk-critical"
  | "not_release_ready"
  | "no_api"
  | "phase_7";

/** Tokens listed under `MASTER` §7.2 (work status). */
export const WORK_STATUS_BADGES = [
  "idea",
  "specified",
  "building",
  "working_in_preview",
  "verified",
  "approved",
  "live",
  "blocked",
] as const satisfies readonly BadgeVariant[];

/** Tokens listed under `MASTER` §7.2 (maturity). */
export const MATURITY_BADGES = [
  "prototype",
  "usable",
  "hardened",
  "release-ready",
  "live",
] as const satisfies readonly BadgeVariant[];

/** Minimal risk ladder (§7.2 names “risk badges” without enumerating — v1 display set). */
export const RISK_BADGES = [
  "risk-low",
  "risk-medium",
  "risk-high",
  "risk-critical",
] as const satisfies readonly BadgeVariant[];

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  idea: "border-border bg-muted/80 text-muted-foreground",
  specified: "border-border bg-secondary text-secondary-foreground",
  building: "border-primary/30 bg-primary/10 text-foreground",
  working_in_preview: "border-chart-2/40 bg-chart-2/15 text-foreground",
  verified: "border-emerald-600/40 bg-emerald-600/10 text-emerald-900 dark:text-emerald-100",
  approved: "border-emerald-700/50 bg-emerald-700/15 text-emerald-950 dark:text-emerald-50",
  live: "border-green-700/50 bg-green-700/15 text-green-950 dark:text-green-50",
  blocked: "border-destructive/40 bg-destructive/10 text-destructive",
  prototype: "border-border bg-muted text-muted-foreground",
  usable: "border-chart-3/40 bg-chart-3/10 text-foreground",
  hardened: "border-chart-4/40 bg-chart-4/15 text-foreground",
  "release-ready": "border-emerald-600/50 bg-emerald-600/15 text-emerald-950 dark:text-emerald-50",
  "risk-low": "border-border bg-muted/60 text-muted-foreground",
  "risk-medium": "border-amber-600/40 bg-amber-500/10 text-amber-950 dark:text-amber-50",
  "risk-high": "border-orange-600/45 bg-orange-500/12 text-orange-950 dark:text-orange-50",
  "risk-critical": "border-destructive/50 bg-destructive/15 text-destructive",
  not_release_ready: "border-border bg-background text-foreground",
  no_api: "border-dashed border-muted-foreground/50 bg-muted/40 text-muted-foreground",
  phase_7: "border-primary/25 bg-primary/5 text-foreground font-medium",
};

const VARIANT_LABEL: Record<BadgeVariant, string> = {
  idea: "idea",
  specified: "specified",
  building: "building",
  working_in_preview: "working_in_preview",
  verified: "verified",
  approved: "approved",
  live: "live",
  blocked: "blocked",
  prototype: "prototype",
  usable: "usable",
  hardened: "hardened",
  "release-ready": "release-ready",
  "risk-low": "risk · low",
  "risk-medium": "risk · medium",
  "risk-high": "risk · high",
  "risk-critical": "risk · critical",
  not_release_ready: "not_release_ready",
  no_api: "no API connected",
  phase_7: "Phase 7",
};

export function StatusBadge({
  variant,
  className,
  label,
}: {
  variant: BadgeVariant;
  className?: string;
  /** Override visible text (defaults to canonical token label). */
  label?: string;
}) {
  const text = label ?? VARIANT_LABEL[variant];
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-md border px-2 py-0.5 font-mono text-[11px] leading-none sm:text-xs",
        VARIANT_CLASS[variant],
        className,
      )}
    >
      {text}
    </span>
  );
}
