import { cn } from "@/lib/utils";

/** Small uppercase label for section eyebrows / metadata (P7-7-2). */
export function MetaLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs",
        className,
      )}
    >
      {children}
    </p>
  );
}
