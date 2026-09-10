from io import BytesIO

from fastapi.testclient import TestClient
from PIL import Image

from api.main import app


client = TestClient(app)


def create_test_image():
    image = Image.new(
        "L",
        (28, 28),
        color=0,
    )

    buffer = BytesIO()

    image.save(
        buffer,
        format="PNG",
    )

    buffer.seek(0)

    return buffer


def test_health_check():

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_cnn_prediction():

    image = create_test_image()

    response = client.post(
        "/predict",
        files={
            "image": (
                "test.png",
                image,
                "image/png",
            )
        },
        data={
            "model": "cnn",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["model"] == "cnn"
    assert isinstance(data["class"], str)
    assert isinstance(data["confidence"], float)
    assert len(data["top_predictions"]) == 3


def test_mlp_prediction():

    image = create_test_image()

    response = client.post(
        "/predict",
        files={
            "image": (
                "test.png",
                image,
                "image/png",
            )
        },
        data={
            "model": "mlp",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["model"] == "mlp"
    assert isinstance(data["class"], str)
    assert isinstance(data["confidence"], float)
    assert len(data["top_predictions"]) == 3


def test_invalid_model():

    image = create_test_image()

    response = client.post(
        "/predict",
        files={
            "image": (
                "test.png",
                image,
                "image/png",
            )
        },
        data={
            "model": "invalid",
        },
    )

    assert response.status_code == 422


def test_invalid_file_type():

    response = client.post(
        "/predict",
        files={
            "image": (
                "test.txt",
                b"this is not an image",
                "text/plain",
            )
        },
        data={
            "model": "cnn",
        },
    )

    assert response.status_code == 400