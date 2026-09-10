from pydantic import BaseModel, Field


class TopPrediction(BaseModel):
    class_name: str = Field(alias="class")
    probability: float

    model_config = {
        "populate_by_name": True
    }


class PredictionResponse(BaseModel):
    model: str
    class_name: str = Field(alias="class")
    confidence: float
    top_predictions: list[TopPrediction]

    model_config = {
        "populate_by_name": True
    }