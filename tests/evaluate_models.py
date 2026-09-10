import pandas as pd
import torch
from PIL import Image

from src.inference.predictor import predict


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

TEST_DATA_PATH = "data/fashion-mnist_test.csv"


df = pd.read_csv(TEST_DATA_PATH)

cnn_correct = 0
mlp_correct = 0
agreement = 0

total = len(df)

print("=" * 70)
print("FULL FASHION-MNIST TEST SET EVALUATION")
print("=" * 70)

for i, row in df.iterrows():

    actual_index = int(row.iloc[0])
    actual_class = CLASS_NAMES[actual_index]

    pixels = row.iloc[1:].values

    image = Image.fromarray(
        pixels.astype("uint8").reshape(28, 28)
    )

    cnn_result = predict(image, "cnn")
    mlp_result = predict(image, "mlp")

    cnn_class = cnn_result["class"]
    mlp_class = mlp_result["class"]

    if cnn_class == actual_class:
        cnn_correct += 1

    if mlp_class == actual_class:
        mlp_correct += 1

    if cnn_class == mlp_class:
        agreement += 1

    if (i + 1) % 500 == 0:
        print(f"Processed {i + 1}/{total}")


cnn_accuracy = cnn_correct / total
mlp_accuracy = mlp_correct / total
agreement_rate = agreement / total


print("\n" + "=" * 70)
print("FINAL RESULTS")
print("=" * 70)

print(f"Total samples       : {total}")
print(f"CNN accuracy        : {cnn_accuracy:.4%}")
print(f"MLP accuracy        : {mlp_accuracy:.4%}")
print(f"Model agreement     : {agreement_rate:.4%}")
print(f"Model disagreement  : {total - agreement}")

print("=" * 70)