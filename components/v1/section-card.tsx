import { cn } from "@/lib/utils";

import { MetaLabel } from "./meta-label";

type SectionCardProps = {
  id?: string;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

/** Bordered surface for shell / placeholder sections (P7-7-2). */
export function SectionCard({
  id,
  eyebrow,
  title,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 space-y-3 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm",
        className,
      )}
    >
      {eyebrow != null ? (
        typeof eyebrow === "string" ? (
          <MetaLabel>{eyebrow}</MetaLabel>
        ) : (
          eyebrow
        )
      ) : null}
      {title ? (
        <h2 className="text-balance text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      ) : null}
      <div className={cn("space-y-3", title && "pt-0.5")}>{children}</div>
    </section>
  );
}
