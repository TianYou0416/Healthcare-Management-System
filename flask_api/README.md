# Flask Prediction API

This API loads the final LightGBM model and returns prolonged LOS prediction results with SHAP-based explanations.

## Setup

Open a terminal in the project root:

```bash
cd flask_api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

If `python` is not found on Windows, install Python from https://www.python.org/downloads/ and reopen VS Code.

## Run

```bash
python app.py
```

The API will run at:

```text
http://127.0.0.1:5000
```

## Useful Endpoints

```text
GET  /health
GET  /features
GET  /sample-input
POST /predict
```

## Test Prediction

1. Open `http://127.0.0.1:5000/sample-input` to get a valid sample JSON.
2. Send the returned `features` object to `POST http://127.0.0.1:5000/predict`.

Expected response format:

```json
{
  "prolonged_los": "No",
  "risk_level": "Medium",
  "probability": 0.4766,
  "threshold": 0.6,
  "top_factors": [],
  "clinical_recommendations": []
}
```
