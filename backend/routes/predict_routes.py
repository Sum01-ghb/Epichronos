"""
Prediction API routes.

Exposes:
- POST /predict  -> run ML model on patient biomarker inputs; saves report for authenticated user.
"""

import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException

from auth import get_current_user
from database import get_db
from models import PatientReport, User
from ml.inference import predict_patient
from schemas.prediction_schema import PredictionRequest, PredictionResponse
from sqlalchemy.orm import Session

router = APIRouter(tags=["prediction"])


@router.post("/predict", response_model=PredictionResponse)
def predict_endpoint(
    payload: PredictionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Run the risk model on a single patient's biomarker profile.
    Requires Authorization: Bearer <token>. On success, saves the report
    to the authenticated user's history (PatientReport table).
    """
    try:
        result = predict_patient(payload.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Prediction failed") from exc

    # Save report for this user so it appears in Patient History
    report_data = {
        "biomarker_inputs": payload.model_dump(),
        "risk_score": result["risk_score"],
        "risk_level": result["risk_level"],
        "biomarker_contribution": result.get("biomarker_contribution", {}),
        "top_biomarkers": result.get("top_biomarkers", []),
        "epigenetic_age": result.get("epigenetic_age"),
    }
    report = PatientReport(
        user_id=current_user.id,
        patient_name=payload.patient_name or "Unknown",
        age=payload.age,
        gender=payload.gender or "",
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        analysis_date=datetime.utcnow(),
        report_data=json.dumps(report_data),
    )
    db.add(report)
    db.commit()

    return PredictionResponse(**result)

