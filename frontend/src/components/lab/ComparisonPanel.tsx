import type { PredictionResult } from "@/lib/api";
import { MODELS, formatPercent } from "@/lib/models";
import { ConfidenceBar } from "./ConfidenceBar";

export interface ComparisonState {
  cnn?: PredictionResult;
  mlp?: PredictionResult;
}

interface ComparisonPanelProps {
  comparison: ComparisonState;
}

export function ComparisonPanel({ comparison }: ComparisonPanelProps) {
  const cnn = comparison.cnn;
  const mlp = comparison.mlp;

  const predictionsAvailable = cnn && mlp;
  const modelsAgree = predictionsAvailable && cnn.label === mlp.label;

  const higherConfidenceModel =
    predictionsAvailable
      ? cnn.confidence >= mlp.confidence
        ? "cnn"
        : "mlp"
      : null;

  return (
    <section
      aria-label="Model comparison"
      className="panel animate-rise rounded-2xl p-6 sm:p-8"
    >
      <p className="label-mono">Model comparison</p>

      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Two independently trained models evaluated on the same input image.
        Differences in output reflect differences in architecture, not in the
        image.
      </p>

      {/* ============================================================
          Agreement / Disagreement
          ============================================================ */}

      {predictionsAvailable && (
        <div
          className={`mt-6 rounded-xl border p-4 ${
            modelsAgree
              ? "border-success/30 bg-success/5"
              : "border-primary/30 bg-primary/5"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                modelsAgree
                  ? "bg-success/15 text-success"
                  : "bg-primary/15 text-primary"
              }`}
              aria-hidden
            >
              {modelsAgree ? "✓" : "↔"}
            </span>

            <div>
              <p className="label-mono">
                {modelsAgree
                  ? "Models agree"
                  : "Models disagree"}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {modelsAgree
                  ? `Both models predict ${cnn.label}.`
                  : `CNN predicts ${cnn.label}, while MLP predicts ${mlp.label}.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          Model cards
          ============================================================ */}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {MODELS.map((meta) => {
          const result = comparison[meta.id];

          const isHigherConfidence =
            result && higherConfidenceModel === meta.id;

          return (
            <article
              key={meta.id}
              className={`rounded-xl border bg-background/40 p-5 ${
                isHigherConfidence
                  ? "border-primary/40"
                  : "border-border"
              }`}
            >
              <header className="flex items-baseline justify-between gap-3">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {meta.name}
                  </h3>

                  {isHigherConfidence && (
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                      Higher confidence
                    </p>
                  )}
                </div>

                <span className="font-mono text-[11px] text-muted-foreground">
                  {meta.description}
                </span>
              </header>

              <div className="mt-5 space-y-4">
                {/* Prediction */}

                <div>
                  <p className="label-mono">Prediction</p>

                  <p className="mt-1 font-display text-2xl text-foreground">
                    {result ? result.label : "—"}
                  </p>
                </div>

                {/* Confidence */}

                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="label-mono">Confidence</p>

                    <p className="font-mono text-lg text-primary">
                      {result
                        ? formatPercent(result.confidence)
                        : "—"}
                    </p>
                  </div>

                  <div className="mt-2">
                    <ConfidenceBar
                      value={result?.confidence ?? 0}
                      compact
                    />
                  </div>
                </div>

                {/* Test accuracy */}

                <div className="flex items-baseline justify-between gap-3 border-t border-border pt-4">
                  <p className="label-mono">Test accuracy</p>

                  <p className="font-mono text-sm text-foreground/85">
                    {meta.testAccuracy.toFixed(2)}%
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}