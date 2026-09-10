import type { PredictionResult } from "@/lib/api";
import { formatPercent, getModel } from "@/lib/models";
import { ConfidenceBar } from "./ConfidenceBar";

interface ResultPanelProps {
  result: PredictionResult;
}

export function ResultPanel({ result }: ResultPanelProps) {
  const meta = getModel(result.model);

  return (
    <section
      aria-label="Prediction result"
      className="panel animate-rise rounded-2xl p-6 sm:p-8"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
        <p className="label-mono">Analysis complete</p>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
        <div className="min-w-0">
          <p className="label-mono">Predicted class</p>
          <h3 className="mt-2 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {result.label}
          </h3>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {meta.name} · {meta.description} · test accuracy {meta.testAccuracy.toFixed(2)}%
          </p>
        </div>

        <div className="min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <p className="label-mono">Confidence</p>
            <p className="font-mono text-3xl text-primary sm:text-4xl">
              {formatPercent(result.confidence)}
            </p>
          </div>
          <div className="mt-3">
            <ConfidenceBar value={result.confidence} />
          </div>
        </div>
      </div>

      {result.topPredictions && result.topPredictions.length > 1 && (
        <div className="mt-8 border-t border-border pt-6">
          <p className="label-mono">Top predictions</p>
          <ul className="mt-4 space-y-3">
            {result.topPredictions.map((p) => (
              <li key={p.label}>
                <ConfidenceBar value={p.confidence} label={p.label} compact />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
