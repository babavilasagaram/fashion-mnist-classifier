import type { ModelId } from "./api";

export interface ModelMeta {
  id: ModelId;
  name: string;
  description: string;
  explanation: string;
  testAccuracy: number;
  params: string;
}

export const MODELS: ModelMeta[] = [
  {
    id: "cnn",
    name: "CNN",
    description: "Convolutional Neural Network",
    explanation: "Learns spatial patterns from image structure.",
    testAccuracy: 92.42,
    params: "conv → pool → fc",
  },
  {
    id: "mlp",
    name: "MLP",
    description: "Multi-Layer Perceptron",
    explanation: "Learns patterns from flattened pixel features.",
    testAccuracy: 88.82,
    params: "784 → dense → 10",
  },
];

export const getModel = (id: ModelId): ModelMeta => MODELS.find((m) => m.id === id)!;

export const formatPercent = (value: number, fractionDigits = 2) =>
  `${(value * 100).toFixed(fractionDigits)}%`;
