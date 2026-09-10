import { StatusBadge } from "./StatusBadge";

interface SiteHeaderProps {
  status: "checking" | "online" | "offline";
  onRetry: () => void;
}

export function SiteHeader({ status, onRetry }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:flex sm:justify-between md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border-strong bg-surface-raised font-mono text-[13px] text-primary"
          >
            FV
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold tracking-[0.22em] text-foreground">
              FASHION VISION
            </p>
            <p className="label-mono mt-0.5">Model Lab</p>
          </div>
        </div>
        <StatusBadge status={status} onRetry={onRetry} />
      </div>
    </header>
  );
}
