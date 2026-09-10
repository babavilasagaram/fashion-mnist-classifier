from pathlib import Path

import torch
from PIL import Image
import numpy as np

from src.models.cnn import CNNModel
from src.models.mlp import MLPModel


# Paths

BASE_DIR = Path(__file__).resolve().parents[2]

CNN_MODEL_PATH = BASE_DIR / "models" / "cnn_best_model.pth"
MLP_MODEL_PATH = BASE_DIR / "models" / "mlp_best_model.pth"

# Device

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

# Class names

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
    "Ankle boot",
]



# Load models

def load_cnn_model() -> CNNModel:

    model = CNNModel()

    model.load_state_dict(
        torch.load(
            CNN_MODEL_PATH,
            map_location=device,
            weights_only=True,
        )
    )

    model.to(device)
    model.eval()

    return model


def load_mlp_model() -> MLPModel:

    model = MLPModel()

    model.load_state_dict(
        torch.load(
            MLP_MODEL_PATH,
            map_location=device,
            weights_only=True,
        )
    )

    model.to(device)
    model.eval()

    return model


# Load models once

cnn_model = load_cnn_model()
mlp_model = load_mlp_model()


# Image preprocessing
def preprocess_image(image: Image.Image) -> torch.Tensor:

    image = image.convert("L")
    image = image.resize((28, 28))

    image_array = np.array(image, dtype=np.float32)

    image_tensor = torch.from_numpy(image_array)

    image_tensor = image_tensor / 255.0

    return image_tensor

# Prediction

def predict(
    image: Image.Image,
    model_name: str = "cnn",
) -> dict:

    model_name = model_name.lower()

    models = {
        "cnn": cnn_model,
        "mlp": mlp_model,
    }

    if model_name not in models:
        raise ValueError(
            "model_name must be either 'cnn' or 'mlp'"
        )

    model = models[model_name]

    image_tensor = preprocess_image(image)

    # Prepare input shape

    if model_name == "cnn":

        image_tensor = image_tensor.reshape(
            1, 1, 28, 28
        )

    else:

        image_tensor = image_tensor.reshape(
            1, 784
        )

    image_tensor = image_tensor.to(device)

    # Inference

    with torch.no_grad():

        outputs = model(image_tensor)

        probabilities = torch.softmax(
            outputs,
            dim=1,
        )

        top_probabilities, top_indices = torch.topk(
            probabilities,
            k=3,
            dim=1,
        )

    # Build Top-3 predictions

    top_predictions = [
        {
            "class": CLASS_NAMES[index.item()],
            "probability": probability.item(),
        }
        for probability, index in zip(
            top_probabilities[0],
            top_indices[0],
        )
    ]

    # Return result

    return {
        "model": model_name,
        "class": top_predictions[0]["class"],
        "confidence": top_predictions[0]["probability"],
        "top_predictions": top_predictions,
    }