import pandas as pd
from PIL import Image
from pathlib import Path

TEST_DATA_PATH = "data/fashion-mnist_test.csv"

CLASS_NAMES = [
    "T-shirt_top",
    "Trouser",
    "Pullover",
    "Dress",
    "Coat",
    "Sandal",
    "Shirt",
    "Sneaker",
    "Bag",
    "Ankle_boot",
]

OUTPUT_DIR = Path("tests/sample_images")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

df = pd.read_csv(TEST_DATA_PATH)

# Pick one sample from each class
for class_index, class_name in enumerate(CLASS_NAMES):

    sample = df[df.iloc[:, 0] == class_index].iloc[0]

    pixels = sample.iloc[1:].values.astype("uint8")

    image = Image.fromarray(
        pixels.reshape(28, 28)
    )

    output_path = OUTPUT_DIR / f"{class_index}_{class_name}.png"

    image.save(output_path)

    print(f"Created: {output_path}")

print("\nDone!")