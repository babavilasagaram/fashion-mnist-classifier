# Fashion-MNIST Image Classifier

An end-to-end image classification application built with **PyTorch, FastAPI, React, and Docker**.

The project compares a **Multilayer Perceptron (MLP)** with a **Convolutional Neural Network (CNN)**

Users can upload an image through the web interface, select a model, and receive the predicted class, confidence score, and top-3 predictions.

---

## 🚀 Project Overview

This project demonstrates the complete machine learning workflow — from model development and hyperparameter tuning to API development, frontend integration, testing, and containerization.

### Machine Learning

- Fashion-MNIST dataset
- Train/validation/test split
- Image preprocessing and normalization
- Custom PyTorch models
- MLP implementation
- CNN implementation
- Training and validation
- Hyperparameter tuning with Optuna
- Model checkpointing
- Classification metrics
- Full test-set evaluation
- Model comparison

### Engineering

- FastAPI inference API
- Pydantic response schemas
- Image upload validation
- CNN / MLP model selection
- React frontend
- Docker containerization
- API testing with pytest

---

## 🧠 Models

### MLP

The MLP receives the flattened `28 × 28` grayscale image as a 784-dimensional input.

```text
Input: 784
    ↓
Linear(784 → 128)
    ↓
BatchNorm + ReLU + Dropout
    ↓
Linear(128 → 128)
    ↓
BatchNorm + ReLU + Dropout
    ↓
Linear(128 → 128)
    ↓
BatchNorm + ReLU + Dropout
    ↓
Linear(128 → 10)
    ↓
Output

The MLP was optimized using Optuna.
```
### CNN

The CNN preserves the spatial structure of the image.
```text

Input: 1 × 28 × 28
        ↓
Conv2D(1 → 32)
        ↓
ReLU + BatchNorm
        ↓
MaxPool
        ↓
Conv2D(32 → 64)
        ↓
ReLU + BatchNorm
        ↓
MaxPool
        ↓
Flatten
        ↓
Linear(3136 → 128)
        ↓
ReLU + Dropout
        ↓
Linear(128 → 64)
        ↓
ReLU + Dropout
        ↓
Linear(64 → 10)
        ↓
Output
```
The CNN achieved the best overall test performance.

## 📊 Results

Both models were evaluated on the official 10,000-image Fashion-MNIST test set.

| Model | Test Accuracy |
|---|---:|
| CNN | **92.42%** |
| MLP | **88.82%** |

The CNN outperformed the MLP by **3.60 percentage points**.

### Model Comparison

- Test samples: **10,000**
- CNN accuracy: **92.42%**
- MLP accuracy: **88.82%**
- Model agreement: **90.28%**
- Model disagreement: **972 samples**

## 🔬 CNN Classification Performance

The CNN achieved approximately **92% overall test accuracy** on the official Fashion-MNIST test set.

The strongest-performing classes included:

- Trouser
- Sandal
- Bag
- Sneaker
- Ankle boot

The most challenging class was **Shirt**:

| Metric | Score |
|---|---:|
| Precision | 0.81 |
| Recall | 0.74 |
| F1-score | 0.78 |

The lower performance on Shirt reflects the difficulty of distinguishing visually similar clothing categories in Fashion-MNIST.

## 🎯 Hyperparameter Tuning

**Optuna** was used to optimize the training configuration for both models.

### CNN Search Space

The CNN hyperparameter search included:

- Optimizer
- Learning rate
- Batch size
- Dropout
- Weight decay
- Number of training epochs

The best configuration found for the CNN was:

| Hyperparameter | Value |
|---|---:|
| Optimizer | AdamW |
| Batch Size | 128 |
| Learning Rate | 0.003276 |
| Dropout | 0.3288 |
| Weight Decay | 3.07e-05 |

The MLP was also optimized using Optuna.

Hyperparameter tuning was performed using validation accuracy, while the final model performance was evaluated on the separate official test set.

## 🗂️ Dataset

The project uses the **Fashion-MNIST** dataset for image classification.

Fashion-MNIST contains:

- **60,000** training images
- **10,000** test images
- **28 × 28** grayscale images
- **10** clothing categories

The official training set was divided into:

```text
48,000 → Training
12,000 → Validation

10,000 → Official Test Set
```

## 🏗️ Application Architecture

The application follows a simple client-server architecture.

```text
                    ┌──────────────────┐
                    │  React Frontend  │
                    └────────┬─────────┘
                             │
                             │ HTTP
                             ▼
                    ┌──────────────────┐
                    │     FastAPI      │
                    │                  │
                    │   GET /health    │
                    │   POST /predict  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Predictor     │
                    └────────┬─────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
              ┌──────────┐      ┌──────────┐
              │   CNN    │      │   MLP    │
              │  .pth    │      │  .pth    │
              └────┬─────┘      └────┬─────┘
                   │                 │
                   └────────┬────────┘
                            ▼
                       Prediction

```
## 🌐 Web Application

The React frontend provides an interactive interface for model inference.

### Features

- Image upload
- CNN prediction
- MLP prediction
- Confidence score
- Top-3 predictions
- Model comparison
- Higher-confidence model indication

The application allows the same image to be evaluated using both models and provides a direct comparison of their predictions.

The frontend communicates with the FastAPI backend through HTTP requests.

## 🔌 API

The backend is implemented using **FastAPI**.

### Health Check

```http
GET /health
```

## 📁 Project Structure

```text
fashion-mnist-classifier/
│
├── api/
│   ├── main.py
│   └── schemas.py
│
├── src/
│   ├── models/
│   │   ├── cnn.py
│   │   └── mlp.py
│   │
│   └── inference/
│       └── predictor.py
│
├── models/
│   ├── cnn_best_model.pth
│   └── mlp_best_model.pth
│
├── notebooks/
│   ├── CNN_Mnist.ipynb
│   ├── Gpu_pytorch (1).ipynb
│   └── MINST.ipynb
│
├── tests/
│   ├── test_api.py
│   ├── evaluate_models.py
│   ├── compare_models.py
│   └── create_test_images.py
│
├── frontend/
│
├── Dockerfile
├── .dockerignore
├── requirements.txt
├── .gitignore
└── README.md
```

## ⚙️ Local Setup

### Prerequisites

- Python 3.11+
- Node.js and npm
- Git
- Docker Desktop (optional)

### 1. Clone the repository

```bash
git clone https://github.com/babavilasagaram/fashion-mnist-classifier.git
cd fashion-mnist-classifier
```

### 2. Create a Python environment

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the FastAPI backend

```bash
uvicorn api.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:8080
```

## 🐳 Docker

The FastAPI backend can be containerized using Docker.

### Build the image

From the project root:

```bash
docker build -t fashion-mnist-api .
```

### Run the container

```bash
docker run -p 8000:8000 fashion-mnist-api
```

The API will then be available at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```
pytest
```

The test suite covers:

- Health check
- CNN prediction
- MLP prediction
- Invalid model handling
- Invalid file type handling

Current result:

```text
5 passed
```
## ⚠️ Limitations

The models are trained specifically on Fashion-MNIST.

Fashion-MNIST images are:

- 28 × 28 pixels
- Grayscale
- Centered
- Simple-background images

Because of this, performance on arbitrary real-world photographs may be significantly lower.

The confidence displayed by the application represents the model's **softmax output** and should not be interpreted as a calibrated probability.

The application is primarily intended as a demonstration of an end-to-end machine learning inference system.


## 🚧 Future Improvements

Potential improvements include:

- Confidence calibration
- Better preprocessing for real-world images
- Data augmentation
- More advanced CNN architectures
- Grad-CAM and model explainability
- Batch prediction
- Prediction history
- CI/CD pipeline
- Production deployment
- Monitoring and logging

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Programming |
| PyTorch | Deep Learning |
| Optuna | Hyperparameter Optimization |
| FastAPI | Backend API |
| Pydantic | API Schemas and Validation |
| React | Frontend |
| Docker | Containerization |
| pytest | Testing |
| NumPy | Numerical Processing |
| Pillow | Image Processing |
| scikit-learn | Evaluation Metrics |

## 📌 Key Takeaway

This project demonstrates a complete machine learning application workflow:

```text
Dataset
   ↓
Preprocessing
   ↓
Model Development
   ↓
Hyperparameter Tuning
   ↓
Evaluation
   ↓
Model Comparison
   ↓
FastAPI
   ↓
React
   ↓
Docker
   ↓
Deployable ML Application

```