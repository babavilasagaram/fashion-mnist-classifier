import pandas as pd
import torch
from PIL import Image

from src.inference.predictor import predict

# Configuration

TEST_DATA_PATH = "data/fashion-mnist_test.csv"

CLASS_NAMES = [
    "T-shirt/top",
    "Trouser",
    "Pullover",
    "Dress",
    "Coat",
    "Sandal",
    "Shirt",
    "Sneaker",
    "Bag",
    "Ankle boot"
]

NUM_SAMPLES = 20



# Load test data

df = pd.read_csv(TEST_DATA_PATH)

samples = df.sample(
    n=NUM_SAMPLES,
    random_state=42
).reset_index(drop=True)

# Compare models

cnn_correct = 0
mlp_correct = 0
agreement = 0

print("\n" + "=" * 80)
print("CNN vs MLP MODEL COMPARISON")
print("=" * 80)

for i, row in samples.iterrows():

    # Actual label
    actual_index = int(row.iloc[0])
    actual_class = CLASS_NAMES[actual_index]

    # Extract 784 pixels
    pixels = row.iloc[1:].values

    # Convert pixels → image
    image = Image.fromarray(
        pixels.astype("uint8").reshape(28, 28)
    )

    # Predictions
    cnn_result = predict(image, "cnn")
    mlp_result = predict(image, "mlp")

    cnn_class = cnn_result["class"]
    mlp_class = mlp_result["class"]

    cnn_confidence = cnn_result["confidence"]
    mlp_confidence = mlp_result["confidence"]

    # Correctness
    cnn_is_correct = cnn_class == actual_class
    mlp_is_correct = mlp_class == actual_class

    # Agreement
    models_agree = cnn_class == mlp_class

    if cnn_is_correct:
        cnn_correct += 1

    if mlp_is_correct:
        mlp_correct += 1

    if models_agree:
        agreement += 1

    # Print result
    print(f"\nImage {i + 1}")
    print("-" * 80)

    print(f"Actual : {actual_class}")

    print(
        f"CNN    : {cnn_class:<15} "
        f"confidence={cnn_confidence:.2%} "
        f"{'✓' if cnn_is_correct else '✗'}"
    )

    print(
        f"MLP    : {mlp_class:<15} "
        f"confidence={mlp_confidence:.2%} "
        f"{'✓' if mlp_is_correct else '✗'}"
    )

    print(
        f"Models : {'AGREE ✓' if models_agree else 'DISAGREE ⚠️'}"
    )


# Summary

cnn_accuracy = cnn_correct / NUM_SAMPLES
mlp_accuracy = mlp_correct / NUM_SAMPLES
agreement_rate = agreement / NUM_SAMPLES

print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)

print(f"CNN accuracy     : {cnn_accuracy:.2%}")
print(f"MLP accuracy     : {mlp_accuracy:.2%}")
print(f"Model agreement  : {agreement_rate:.2%}")

print("=" * 80)