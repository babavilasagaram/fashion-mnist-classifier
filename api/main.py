import io
from enum import Enum

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from api.schemas import PredictionResponse
from src.inference.predictor import predict



class ModelName(str, Enum):
    CNN = "cnn"
    MLP = "mlp"

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}

app = FastAPI(
    title="Fashion-MNIST Classifier API",
    description=(
        "API for Fashion-MNIST image classification "
        "using CNN and MLP models."
    ),
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.post(
    "/predict",
    response_model=PredictionResponse,
)
async def predict_image(
    image: UploadFile = File(...),
    model: ModelName = Form(ModelName.CNN),
):


    if image.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG, and WebP images are supported.",
        )


    image_data = await image.read()


    if len(image_data) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image file is too large. Maximum size is 5 MB.",
        )


    try:
        import io

        pil_image = Image.open(
            io.BytesIO(image_data)
        )

        pil_image.load()

    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=400,
            detail="Invalid image file.",
        )


    try:
        result = predict(
            pil_image,
            model_name=model.value,
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Prediction failed.",
        )

    return result