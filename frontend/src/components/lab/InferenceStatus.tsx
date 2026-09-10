interface InferenceStatusProps {
  label: string;
}

const STEPS = ["preprocess", "normalize", "forward pass", "softmax"];

export function InferenceStatus({ label }: InferenceStatusProps) {
  return (
    <section
      aria-live="polite"
      className="panel animate-rise relative overflow-hidden rounded-2xl p-6 sm:p-8"
    >
      <div className="flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden />
        <p className="label-mono">Running inference…</p>
      </div>

      <p className="mt-4 font-display text-2xl text-foreground">{label}</p>

      <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-background/80">
        <div className="h-full w-1/3 animate-[scan_1.4s_ease-in-out_infinite] rounded-full bg-primary/80 [animation-name:slide]" />
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
        {STEPS.map((step, i) => (
          <li
            key={step}
            className="label-mono flex items-center gap-2"
            style={{ animation: `pulse 1.6s ease-in-out ${i * 0.2}s infinite` }}
          >
            <span className="h-1 w-1 rounded-full bg-primary/70" aria-hidden />
            {step}
          </li>
        ))}
      </ul>

      <style>{`@keyframes slide{0%{transform:translateX(-110%)}100%{transform:translateX(320%)}}`}</style>
    </section>
  );
}
