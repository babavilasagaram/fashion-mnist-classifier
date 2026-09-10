import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Sparkles, Layers } from "lucide-react";

import { API_BASE_URL, ApiError, checkHealth, predict, type ModelId, type PredictionResult } from "@/lib/api";
import { MODELS, getModel } from "@/lib/models";
import { SiteHeader } from "@/components/lab/SiteHeader";
import { UploadPanel, type UploadedImage } from "@/components/lab/UploadPanel";
import { ModelCard } from "@/components/lab/ModelCard";
import { ResultPanel } from "@/components/lab/ResultPanel";
import { InferenceStatus } from "@/components/lab/InferenceStatus";
import { ComparisonPanel, type ComparisonState } from "@/components/lab/ComparisonPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fashion Vision Lab — CNN vs MLP on Fashion-MNIST" },
      {
        name: "description",
        content:
          "Upload an image and compare two trained neural networks — a CNN and an MLP — classifying Fashion-MNIST garments in real time.",
      },
      { property: "og:title", content: "Fashion Vision Lab — CNN vs MLP on Fashion-MNIST" },
      {
        property: "og:description",
        content:
          "A model lab for image classification: run a convolutional network and a multi-layer perceptron on the same image and compare predictions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Health = "checking" | "online" | "offline";
type Busy = false | { kind: "single" | "compare"; label: string };

function Index() {
  const [health, setHealth] = useState<Health>("checking");
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [model, setModel] = useState<ModelId>("cnn");
  const [busy, setBusy] = useState<Busy>(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [comparison, setComparison] = useState<ComparisonState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const imageRef = useRef<UploadedImage | null>(null);

  const runHealthCheck = useCallback(async () => {
    setHealth("checking");
    setHealth((await checkHealth()) ? "online" : "offline");
  }, []);

  useEffect(() => {
    void runHealthCheck();
  }, [runHealthCheck]);

  useEffect(() => {
    imageRef.current = image;
  }, [image]);

  useEffect(
    () => () => {
      if (imageRef.current) URL.revokeObjectURL(imageRef.current.url);
    },
    [],
  );

  const resetOutputs = () => {
    setResult(null);
    setComparison(null);
    setError(null);
  };

  const handleSelect = (next: UploadedImage) => {
    if (image) URL.revokeObjectURL(image.url);
    resetOutputs();
    setImage(next);
  };

  const handleClear = () => {
    if (image) URL.revokeObjectURL(image.url);
    setImage(null);
    resetOutputs();
  };

  const describeError = (err: unknown) =>
    err instanceof ApiError ? err.message : "Something went wrong while running inference.";

  const analyze = async () => {
    if (!image || busy) return;
    setError(null);
    setComparison(null);
    setBusy({ kind: "single", label: `${getModel(model).name} · ${getModel(model).description}` });
    try {
      const res = await predict(image.file, model);
      setResult(res);
      setHealth("online");
    } catch (err) {
      setResult(null);
      setError(describeError(err));
      if (err instanceof ApiError && err.kind === "offline") setHealth("offline");
    } finally {
      setBusy(false);
    }
  };

  const compare = async () => {
    if (!image || busy) return;
    setError(null);
    setResult(null);
    setBusy({ kind: "compare", label: "CNN + MLP · side-by-side evaluation" });
    try {
      const [cnn, mlp] = await Promise.all([
        predict(image.file, "cnn"),
        predict(image.file, "mlp"),
      ]);
      setComparison({ cnn, mlp });
      setHealth("online");
    } catch (err) {
      setComparison(null);
      setError(describeError(err));
      if (err instanceof ApiError && err.kind === "offline") setHealth("offline");
    } finally {
      setBusy(false);
    }
  };

  const disabled = !image || busy !== false;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader status={health} onRetry={() => void runHealthCheck()} />

      <main>
        <section className="grid-backdrop border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <p className="label-mono">Fashion-MNIST · 10 classes · PyTorch</p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
              See what the model sees.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Compare two neural network architectures on Fashion-MNIST.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
            <UploadPanel
              image={image}
              onSelect={handleSelect}
              onClear={handleClear}
              onError={setError}
              scanning={busy !== false}
            />

            <div className="flex flex-col gap-6">
              <section aria-label="Model selection" className="panel rounded-2xl p-5">
                <p className="label-mono">Architecture</p>
                <div
                  role="radiogroup"
                  aria-label="Select a model"
                  className="mt-4 grid gap-4 sm:grid-cols-2"
                >
                  {MODELS.map((m) => (
                    <ModelCard
                      key={m.id}
                      model={m}
                      selected={model === m.id}
                      disabled={busy !== false}
                      onSelect={() => setModel(m.id)}
                    />
                  ))}
                </div>
              </section>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void analyze()}
                  disabled={disabled}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-display text-sm font-semibold tracking-wide text-primary-foreground transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                >
                  <Sparkles className="h-4 w-4" aria-hidden />
                  {busy && busy.kind === "single" ? "Analyzing…" : "Analyze Image"}
                </button>
                <button
                  type="button"
                  onClick={() => void compare()}
                  disabled={disabled}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-strong bg-surface px-6 py-4 font-display text-sm font-semibold tracking-wide text-foreground transition-colors hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Layers className="h-4 w-4" aria-hidden />
                  {busy && busy.kind === "compare" ? "Comparing…" : "Compare Models"}
                </button>
              </div>

              {!image && (
                <p className="font-mono text-[11px] tracking-wider text-muted-foreground">
                  Upload an image to enable inference · endpoint {API_BASE_URL}/predict
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-destructive/35 bg-destructive/10 p-5"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden />
                <div className="min-w-0">
                  <p className="font-display text-sm font-semibold text-foreground">
                    Inference could not complete
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            )}

            {busy && <InferenceStatus label={busy.label} />}
            {!busy && result && <ResultPanel result={result} />}
            {!busy && comparison && <ComparisonPanel comparison={comparison} />}
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="label-mono">Fashion Vision · Model Lab</p>
          <p className="font-mono text-[11px] text-muted-foreground">
            Inference served by a local FastAPI backend — no results are simulated.
          </p>
        </div>
      </footer>
    </div>
  );
}
