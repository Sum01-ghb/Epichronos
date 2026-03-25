"""
ML inference utilities for EpiChronos.

Responsibilities:
- Load trained artifacts once at import time (risk_model, features, median_imputer).
- Expose `predict_patient` for FastAPI routes.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List

import joblib
import numpy as np
import pandas as pd


# Resolve paths relative to the backend directory
BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

RISK_MODEL_PATH = MODELS_DIR / "risk_model.pkl"
FEATURES_PATH = MODELS_DIR / "features.pkl"
MEDIAN_IMPUTER_PATH = MODELS_DIR / "median_imputer.pkl"


def _load_model(path: Path) -> Any:
    """Load a joblib artifact, raising a clear error if missing."""
    if not path.exists():
        raise FileNotFoundError(f"Model artifact not found: {path}")
    return joblib.load(path)


# Load artifacts once when module is imported to avoid repeated disk I/O.
try:
    risk_model = _load_model(RISK_MODEL_PATH)
    feature_names: List[str] = _load_model(FEATURES_PATH)
    median_imputer = _load_model(MEDIAN_IMPUTER_PATH)
except FileNotFoundError as exc:
    raise RuntimeError(
        f"Failed to load ML artifacts. Ensure risk_model.pkl, features.pkl, "
        f"and median_imputer.pkl exist in: {MODELS_DIR}"
    ) from exc


def predict_patient(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Run risk prediction for a single patient.

    - Computes a simple tumor_mean proxy from methylation markers if needed.
    - Imputes missing values with the pre-fitted median imputer.
    - Uses the RandomForest model to compute risk_score (probability of cancer).
    - Derives:
      * risk_level (Low / Moderate / High)
      * biomarker_contribution (feature importances)
      * top_biomarkers (top non-zero contributors)
      * epigenetic_age (age + tumor_mean * 0.5), when possible.
    """

    # Compute tumor_mean from key methylation features when not provided
    methylation_features = [
        "RASSF1A_pct",
        "SEPT9_pct",
        "APC_pct",
        "SFRP1_pct",
        "LINE1_pct",
    ]
    if "tumor_mean" not in data:
        try:
            vals = [float(data[f]) for f in methylation_features]
            data["tumor_mean"] = float(sum(vals) / len(vals))
        except KeyError:
            # If any feature is missing, we simply skip tumor_mean; missing
            # features will be caught by the generic validation below.
            pass

    # Ensure all expected feature names are present
    missing = [name for name in feature_names if name not in data]
    if missing:
        raise ValueError(
            f"Missing required features for prediction: {', '.join(missing)}"
        )

    # Build DataFrame with columns in the exact training order
    df = pd.DataFrame([[data[name] for name in feature_names]], columns=feature_names)

    # Apply imputation and model prediction
    X_imputed = median_imputer.transform(df)
    proba = risk_model.predict_proba(X_imputed)[0][1]
    risk_score = float(proba)

    # Map risk_score to categorical risk_level
    if risk_score < 0.4:
        risk_level = "Low"
    elif risk_score < 0.7:
        risk_level = "Moderate"
    else:
        risk_level = "High"

    # Derive patient-specific biomarker contributions.
    # Instead of returning the static model-level feature_importances_ (which are
    # identical for every patient), we compute a weighted contribution that
    # reflects BOTH the feature's global importance AND how much *this patient's*
    # value deviates from the training median:
    #
    #   contribution_i = importance_i * |patient_value_i - median_i| / (median_i + ε)
    #
    # After normalising these Raw values to sum to 1, each patient gets a unique
    # fingerprint: a biomarker that's globally less important can rank higher for a
    # specific patient if their value is far from the population median.
    biomarker_contribution: Dict[str, float] = {}
    top_biomarkers: List[Dict[str, Any]] = []

    if hasattr(risk_model, "feature_importances_"):
        importances = np.asarray(getattr(risk_model, "feature_importances_"), dtype=float)
        patient_values = np.array([data[name] for name in feature_names], dtype=float)

        # Training medians from the fitted imputer
        if hasattr(median_imputer, "statistics_"):
            medians = np.asarray(median_imputer.statistics_, dtype=float)
        else:
            medians = patient_values.copy()

        # Normalised deviation from the population median (scale-free)
        deviation = np.abs(patient_values - medians) / (np.abs(medians) + 1e-8)

        # Raw weighted contribution
        raw_contrib = importances * deviation
        total = raw_contrib.sum()
        if total > 0:
            norm_contrib = raw_contrib / total
        else:
            # Patient is perfectly average — fall back to normalised importances
            imp_total = importances.sum()
            norm_contrib = importances / imp_total if imp_total > 0 else importances

        contrib_items = [
            (feature_names[i], float(norm_contrib[i]))
            for i in range(len(feature_names))
        ]
        contrib_items.sort(key=lambda x: x[1], reverse=True)
        biomarker_contribution = {name: val for name, val in contrib_items}

        # Top non-zero biomarkers (up to 5)
        non_zero = [(name, val) for name, val in contrib_items if val > 0]
        for name, val in non_zero[:5]:
            top_biomarkers.append({"feature": name, "importance": float(val)})


    # Optional epigenetic age proxy: age + (tumor_mean * 0.5)
    epigenetic_age: float | None = None
    age_val = data.get("age")
    tumor_mean_val = data.get("tumor_mean")
    if age_val is not None and tumor_mean_val is not None:
        try:
            epigenetic_age = float(age_val) + float(tumor_mean_val) * 0.5
        except (TypeError, ValueError):
            epigenetic_age = None

    result: Dict[str, Any] = {
        "risk_score": risk_score,
        "risk_level": risk_level,
        "biomarker_contribution": biomarker_contribution,
        "top_biomarkers": top_biomarkers,
    }
    if epigenetic_age is not None:
        result["epigenetic_age"] = epigenetic_age

    return result