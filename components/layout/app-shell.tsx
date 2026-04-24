import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * P7-app-shell-7-1-minimal: global shell per `MASTER` §7.1 + `UI_V1.md` —
 * left nav (workflow sections), top status bar (static honesty line).
 * No data fetching, no auth, no API calls.
 */
const SHELL_NAV = [
  { href: "/#overview", label: "Overview" },
  { href: "/#outcomes", label: "Outcomes" },
  { href: "/#assumptions", label: "Assumptions" },
  { href: "/#evidence", label: "Evidence" },
  { href: "/#release-readiness", label: "Release Readiness" },
  { href: "/#docs-timeline", label: "Docs / Timeline" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <aside
        className="flex w-full shrink-0 flex-col border-b border-border bg-sidebar text-sidebar-foreground md:w-56 md:border-b-0 md:border-r"
        aria-label="Primary"
      >
        <div className="border-b border-sidebar-border px-4 py-4">
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-sidebar-foreground hover:text-sidebar-accent-foreground"
          >
            Fabrika3
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">
            v1 shell — navigation only
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-2" aria-label="Product sections">
          {SHELL_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/90",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header
          className="flex h-12 shrink-0 items-center border-b border-border bg-background px-4"
          role="banner"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:text-sm">
            <span className="font-medium text-foreground">Phase 7</span>
            <span aria-hidden>·</span>
            <span>App shell (§7.1)</span>
            <span aria-hidden>·</span>
            <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground">
              prototype
            </span>
            <span aria-hidden>·</span>
            <span className="rounded-md border border-border px-2 py-0.5">
              not_release_ready
            </span>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-auto bg-background">{children}</main>
      </div>
    </div>
  );
}
