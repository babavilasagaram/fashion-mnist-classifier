/**
 * API layer for the Fashion Vision Lab backend (FastAPI + PyTorch).
 * All network access lives here so UI components stay presentational.
 */

export const API_BASE_URL =
  (import.meta.env['VITE_API_BASE_URL'] as string | undefined)?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

export type ModelId = "cnn" | "mlp";

export interface TopPrediction {
  label: string;
  confidence: number;
}

export interface PredictionResult {
  model: ModelId;
  label: string;
  confidence: number;
  /** Optional — populated only if the backend returns probability data. */
  topPredictions?: TopPrediction[];
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly kind: "offline" | "http" | "invalid" = "http",
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const TIMEOUT_MS = 20000;

async function request(path: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(`${API_BASE_URL}${path}`, { ...init, signal: controller.signal });
  } catch {
    throw new ApiError(
      `Could not reach the inference API at ${API_BASE_URL}. Make sure the backend is running.`,
      "offline",
    );
  } finally {
    clearTimeout(timer);
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await request("/health");
    if (!res.ok) return false;
    const data = (await res.json()) as { status?: string };
    return data?.status === "healthy";
  } catch {
    return false;
  }
}

interface RawPrediction {
  model?: string;
  class?: string;
  label?: string;
  confidence?: number;
  probabilities?: Record<string, number> | Array<{ label: string; confidence: number }>;
  top_predictions?: Array<{
  class?: string;
  label?: string;
  probability: number;
}>;
}

function normalize(raw: RawPrediction, fallbackModel: ModelId): PredictionResult {
  const label = raw.class ?? raw.label;
  if (!label || typeof raw.confidence !== "number") {
    throw new ApiError("The API returned an unexpected response.", "invalid");
  }

  let topPredictions: TopPrediction[] | undefined;
  if (Array.isArray(raw.top_predictions)) {
    topPredictions = raw.top_predictions.map((p) => ({
  label: p.class ?? p.label ?? "—",
  confidence: p.probability,
}));
  } else if (Array.isArray(raw.probabilities)) {
    topPredictions = raw.probabilities;
  } else if (raw.probabilities && typeof raw.probabilities === "object") {
    topPredictions = Object.entries(raw.probabilities).map(([k, v]) => ({
      label: k,
      confidence: v,
    }));
  }

  topPredictions = topPredictions?.sort((a, b) => b.confidence - a.confidence).slice(0, 5);

  return {
    model: (raw.model as ModelId) ?? fallbackModel,
    label,
    confidence: raw.confidence,
    ...(topPredictions?.length ? { topPredictions } : {}),
  };
}

export async function predict(file: File, model: ModelId): Promise<PredictionResult> {
  const form = new FormData();
  form.append("image", file);
  form.append("model", model);

  const res = await request("/predict", { method: "POST", body: form });

  if (!res.ok) {
    let detail = "";
    try {
      const body = (await res.json()) as { detail?: string; message?: string };
      detail = body.detail ?? body.message ?? "";
    } catch {
      /* non-JSON error body */
    }
    if (res.status === 422 || res.status === 400) {
      throw new ApiError(detail || "The image could not be processed by the model.", "invalid");
    }
    throw new ApiError(detail || `Inference failed (HTTP ${res.status}).`, "http");
  }

  const raw = (await res.json().catch(() => {
    throw new ApiError("The API returned an unreadable response.", "invalid");
  })) as RawPrediction;

  return normalize(raw, model);
}
