interface StatusBadgeProps {
  status: "checking" | "online" | "offline";
  onRetry: () => void;
}

export function StatusBadge({ status, onRetry }: StatusBadgeProps) {
  const map = {
    checking: { text: "CHECKING API", dot: "bg-muted-foreground", ring: "border-border" },
    online: { text: "API ONLINE", dot: "bg-success", ring: "border-success/35" },
    offline: { text: "API OFFLINE", dot: "bg-destructive", ring: "border-destructive/40" },
  } as const;
  const s = map[status];

  return (
    <button
      type="button"
      onClick={onRetry}
      aria-live="polite"
      aria-label={`${s.text}. Click to re-check the backend connection.`}
      className={`group flex shrink-0 items-center gap-2.5 rounded-full border ${s.ring} bg-surface/70 px-3.5 py-1.5 transition-colors hover:bg-surface-raised`}
    >
      <span className="relative flex h-2 w-2">
        {status === "online" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${s.dot}`} />
      </span>
      <span className="font-mono text-[11px] tracking-[0.16em] text-foreground/80">{s.text}</span>
    </button>
  );
}
