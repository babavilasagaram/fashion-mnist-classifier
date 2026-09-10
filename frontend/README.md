# Fashion Vision Lab

Build a premium, portfolio-quality web application called "Fashion Vision Lab".

This is the frontend for a real machine-learning image classification project. The backend will be a FastAPI API running locally and will perform inference using two trained PyTorch models: CNN and MLP.

IMPORTANT:

This must be a functional application UI, not a fake AI demo. Do not implement fake prediction logic or hardcoded prediction results.

TECH STACK:

- React

- TypeScript

- Tailwind CSS

- Modern component architecture

- Responsive design

- Clean, maintainable code

VISUAL DIRECTION:

Create a sophisticated dark-mode interface inspired by premium developer tools, ML research dashboards, and modern SaaS products.

The design should feel:

- technical

- minimal

- premium

- futuristic but restrained

- professional

- portfolio-worthy

Avoid:

- generic AI landing-page designs

- excessive neon

- excessive gradients

- stock images

- cartoon illustrations

- "AI brain" graphics

- overly complicated dashboards

Use:

- dark charcoal background

- subtle borders

- off-white typography

- one restrained accent color

- subtle glass effects where appropriate

- large typography

- generous spacing

- smooth micro-interactions

- polished hover/focus states

APPLICATION STRUCTURE:

HEADER:

- Brand: "FASHION VISION"

- Small label: "MODEL LAB"

- API status indicator on the right

- Status should visually indicate whether the backend is reachable

HERO:

Large heading:

"See what the model sees."

Subtitle:

"Compare two neural network architectures on Fashion-MNIST."

IMAGE ANALYSIS AREA:

Create a large drag-and-drop upload panel.

Before upload:

- Show an elegant upload icon

- Text: "Drop an image here"

- Secondary text: "or browse from your device"

- Mention that Fashion-MNIST images are 28×28 grayscale

After upload:

- Display the uploaded image prominently

- Show filename

- Show image dimensions

- Provide a remove/reset action

MODEL SELECTION:

Create two visually distinct model cards.

CNN card:

- Name: CNN

- Description: "Convolutional Neural Network"

- Short explanation: "Learns spatial patterns from image structure."

- Display test accuracy: 92.42%

MLP card:

- Name: MLP

- Description: "Multi-Layer Perceptron"

- Short explanation: "Learns patterns from flattened pixel features."

- Display its test accuracy around 89%

Allow the user to select exactly one model.

The selected model should have a strong but tasteful visual state.

PREDICT BUTTON:

Create a prominent "Analyze Image" button.

The button should:

- remain disabled until an image is uploaded

- show a loading state while the request is running

- have a polished transition

- prevent duplicate requests while inference is running

API INTEGRATION:

The frontend will communicate with:

POST http://127.0.0.1:8000/predict

Send:

- image as multipart/form-data

- model as multipart/form-data

The model value must be exactly:

- "cnn"

or

- "mlp"

Expected backend response:

{

  "model": "cnn",

  "class": "T-shirt/top",

  "confidence": 0.9460471868515015

}

Do not hardcode prediction results.

Create a small API service/helper layer so API communication is separated from UI components.

RESULT AREA:

After successful prediction, reveal a polished analysis section.

Display:

"ANALYSIS COMPLETE"

Large predicted class name.

Confidence displayed prominently as a percentage.

Example:

94.60%

Create a beautiful confidence visualization.

Also show a "Top predictions" section if the backend later provides probability data. Structure the frontend so this can easily be extended without rewriting the UI.

MODEL COMPARISON:

Include a "Compare Models" feature.

Allow the user to run both CNN and MLP on the same uploaded image.

Show the results side by side:

CNN

Prediction

Confidence

Test Accuracy

MLP

Prediction

Confidence

Test Accuracy

Clearly communicate that these are predictions from two different trained models.

LOADING EXPERIENCE:

During inference, show a sophisticated ML-analysis animation.

For example:

- subtle scanning effect

- animated progress indicator

- "Running inference..."

- model name

- small technical status indicators

Do not fake actual inference progress. The animation should simply indicate that the API request is in progress.

ERROR HANDLING:

Handle:

- backend unavailable

- invalid image

- API errors

- unsupported file types

- prediction failures

Display clean user-friendly error messages.

API STATUS:

On page load, check:

GET http://127.0.0.1:8000/health

Expected response:

{

  "status": "healthy"

}

Show:

"API ONLINE"

or

"API OFFLINE"

Do not fake this status.

RESPONSIVE DESIGN:

Desktop:

- wide two-column analysis layout

Tablet:

- adaptive layout

Mobile:

- single-column layout

- upload panel and model cards stack vertically

ACCESSIBILITY:

- keyboard accessible controls

- visible focus states

- semantic HTML

- accessible buttons and labels

- sufficient contrast

CODE QUALITY:

- reusable React components

- clean separation between API logic and UI

- no unnecessary dependencies

- no hardcoded prediction results

- environment variable for API base URL

Create a polished first version that looks like a real machine-learning product rather than a tutorial project.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/eacdbf16-484c-494c-bd23-ccd85b37011b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
