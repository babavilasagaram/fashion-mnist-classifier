interface ConfidenceBarProps {
  value: number; // 0..1
  label?: string;
  compact?: boolean;
}

export function ConfidenceBar({ value, label, compact = false }: ConfidenceBarProps) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="min-w-0 truncate text-sm text-foreground/80">{label}</span>
          <span className="shrink-0 font-mono text-xs text-muted-foreground">
            {pct.toFixed(2)}%
          </span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Number(pct.toFixed(2))}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ? `${label} confidence` : "Confidence"}
        className={`w-full overflow-hidden rounded-full bg-background/80 ${compact ? "h-1.5" : "h-2.5"}`}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
