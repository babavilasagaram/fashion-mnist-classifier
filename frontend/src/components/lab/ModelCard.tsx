import { Check } from "lucide-react";
import type { ModelMeta } from "@/lib/models";

interface ModelCardProps {
  model: ModelMeta;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function ModelCard({ model, selected, onSelect, disabled }: ModelCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={`group relative flex w-full flex-col rounded-xl border p-5 text-left transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
        selected
          ? "border-primary/45 bg-surface-raised shadow-[var(--shadow-accent)]"
          : "border-border bg-surface/70 hover:border-border-strong hover:bg-surface-raised/70"
      }`}
    >
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block font-display text-2xl font-semibold tracking-tight text-foreground">
            {model.name}
          </span>
          <span className="mt-0.5 block text-sm text-muted-foreground">{model.description}</span>
        </span>
        <span
          aria-hidden
          className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-colors ${
            selected ? "border-primary bg-primary" : "border-border-strong"
          }`}
        >
          {selected && <Check className="h-3 w-3 text-primary-foreground" />}
        </span>
      </span>

      <span className="mt-4 block text-sm leading-relaxed text-foreground/70">
        {model.explanation}
      </span>

      <span className="mt-5 flex items-end justify-between border-t border-border pt-4">
        <span>
          <span className="label-mono block">Test accuracy</span>
          <span className="mt-1 block font-mono text-xl text-foreground">
            {model.testAccuracy.toFixed(2)}%
          </span>
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">{model.params}</span>
      </span>
    </button>
  );
}
