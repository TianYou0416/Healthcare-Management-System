from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import shap
from flask import Flask, jsonify, request
from flask_cors import CORS


BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models" / "final"

PIPELINE_PATH = MODEL_DIR / "lightgbm_sparcs_los_pipeline.joblib"
METADATA_PATH = MODEL_DIR / "lightgbm_sparcs_metadata.joblib"
FEATURE_SCHEMA_PATH = MODEL_DIR / "feature_schema.joblib"


app = Flask(__name__)
CORS(app)

pipeline = joblib.load(PIPELINE_PATH)
metadata = joblib.load(METADATA_PATH)
feature_schema = joblib.load(FEATURE_SCHEMA_PATH)

FEATURE_COLUMNS = metadata.get("feature_columns") or list(feature_schema.keys())
SELECTED_THRESHOLD = float(metadata.get("selected_threshold", 0.6))


def get_pipeline_parts():
    if not hasattr(pipeline, "steps"):
        return None, pipeline

    steps = list(pipeline.steps)
    model = steps[-1][1]
    preprocessor = steps[0][1] if len(steps) > 1 else None
    return preprocessor, model


preprocessor, model = get_pipeline_parts()
explainer = shap.TreeExplainer(model)


def risk_level(probability):
    if probability >= SELECTED_THRESHOLD:
        return "High"
    if probability >= 0.3:
        return "Medium"
    return "Low"


def clean_value(value):
    if value is None:
        return "Not Available"
    if isinstance(value, float) and np.isnan(value):
        return "Not Available"
    text = str(value).strip()
    return text if text else "Not Available"


def get_request_features(payload):
    submitted_features = payload.get("features", payload)

    missing_features = [
        feature for feature in FEATURE_COLUMNS
        if clean_value(submitted_features.get(feature)) == "Not Available"
    ]

    if missing_features:
        raise ValueError(f"Missing required features: {', '.join(missing_features)}")

    return {
        feature: clean_value(submitted_features.get(feature))
        for feature in FEATURE_COLUMNS
    }


def get_transformed_data(input_df):
    if preprocessor is None:
        return input_df
    transformed = preprocessor.transform(input_df)
    if hasattr(transformed, "toarray"):
        transformed = transformed.toarray()
    return transformed


def get_transformed_feature_names():
    if preprocessor is None:
        return FEATURE_COLUMNS

    try:
        return list(preprocessor.get_feature_names_out())
    except Exception:
        return FEATURE_COLUMNS


def map_to_original_feature(transformed_feature):
    clean_name = transformed_feature.split("__", 1)[-1]

    for feature in FEATURE_COLUMNS:
        if clean_name == feature or clean_name.startswith(f"{feature}_"):
            return feature

    return clean_name


def positive_class_shap_values(transformed_data):
    shap_values = explainer.shap_values(transformed_data)

    if isinstance(shap_values, list):
        return shap_values[1]

    if len(shap_values.shape) == 3:
        return shap_values[:, :, 1]

    return shap_values


def build_shap_explanation(input_df):
    transformed_data = get_transformed_data(input_df)
    shap_values = positive_class_shap_values(transformed_data)[0]
    transformed_feature_names = get_transformed_feature_names()

    contributions = {feature: 0.0 for feature in FEATURE_COLUMNS}

    if len(shap_values) == len(FEATURE_COLUMNS):
        for index, feature in enumerate(FEATURE_COLUMNS):
            contributions[feature] += abs(float(shap_values[index]))
    else:
        for index, value in enumerate(shap_values):
            if index >= len(transformed_feature_names):
                continue
            original_feature = map_to_original_feature(transformed_feature_names[index])
            contributions.setdefault(original_feature, 0.0)
            contributions[original_feature] += abs(float(value))

    total_contribution = sum(contributions.values())
    explanation_rows = []

    for feature, contribution in contributions.items():
        schema = feature_schema.get(feature, {})
        impact_percentage = 0.0
        if total_contribution > 0:
            impact_percentage = (contribution / total_contribution) * 100

        explanation_rows.append({
            "feature": feature,
            "label": schema.get("label", feature),
            "value": clean_value(input_df.iloc[0].get(feature)),
            "impact_percentage": round(float(impact_percentage), 2)
        })

    explanation_rows.sort(key=lambda row: row["impact_percentage"], reverse=True)
    return explanation_rows[:5]


def generate_recommendations(probability, top_factors):
    recommendations = []
    level = risk_level(probability)
    top_labels = {factor["label"] for factor in top_factors}

    if level == "High":
        recommendations.append("Prioritize early discharge planning and multidisciplinary review.")
        recommendations.append("Monitor the patient closely for clinical deterioration or delayed recovery.")
    elif level == "Medium":
        recommendations.append("Monitor the patient closely and review discharge readiness during daily rounds.")
        recommendations.append("Consider early intervention for modifiable factors contributing to prolonged stay.")
    else:
        recommendations.append("Continue routine monitoring and standard discharge planning.")

    if "Severity of Illness" in top_labels:
        recommendations.append("Review severity-related clinical factors and ensure appropriate care escalation if needed.")
    if "Risk of Mortality" in top_labels:
        recommendations.append("Consider senior clinical review for patients with elevated mortality risk indicators.")
    if "Admission Type" in top_labels or "Emergency Department Visit" in top_labels:
        recommendations.append("Assess admission pathway risks and coordinate early follow-up care.")
    if "Diagnosis Category" in top_labels or "APR DRG" in top_labels or "Major Diagnosis Category" in top_labels:
        recommendations.append("Coordinate with the relevant clinical team to support timely care progression.")

    return recommendations[:5]


def serialize_feature_schema():
    return [
        {
            "feature": feature,
            "label": feature_schema.get(feature, {}).get("label", feature),
            "description": feature_schema.get(feature, {}).get("description", ""),
            "input_type": feature_schema.get(feature, {}).get("input_type", "select"),
            "options": feature_schema.get(feature, {}).get("options", [])
        }
        for feature in FEATURE_COLUMNS
    ]


@app.get("/")
def home():
    return jsonify({
        "message": "Healthcare AI prediction API is running.",
        "model": "LightGBM",
        "threshold": SELECTED_THRESHOLD
    })


@app.get("/health")
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": pipeline is not None,
        "feature_count": len(FEATURE_COLUMNS)
    })


@app.get("/features")
def features():
    return jsonify({
        "features": serialize_feature_schema()
    })


@app.get("/sample-input")
def sample_input():
    sample = {}

    for feature in FEATURE_COLUMNS:
        options = feature_schema.get(feature, {}).get("options", [])
        sample[feature] = options[0]["value"] if options else ""

    return jsonify({
        "features": sample
    })


@app.post("/predict")
def predict():
    try:
        payload = request.get_json(silent=True) or {}
        features = get_request_features(payload)
        input_df = pd.DataFrame([features], columns=FEATURE_COLUMNS)

        probability = float(pipeline.predict_proba(input_df)[0, 1])
        prolonged_los = "Yes" if probability >= SELECTED_THRESHOLD else "No"
        top_factors = build_shap_explanation(input_df)
        recommendations = generate_recommendations(probability, top_factors)

        return jsonify({
            "prolonged_los": prolonged_los,
            "risk_level": risk_level(probability),
            "probability": round(probability, 4),
            "threshold": round(SELECTED_THRESHOLD, 4),
            "top_factors": top_factors,
            "clinical_recommendations": recommendations
        })
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    except Exception as error:
        return jsonify({"error": f"Prediction failed: {error}"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
