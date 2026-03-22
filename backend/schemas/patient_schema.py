"""
Pydantic schemas for patient report history API.
"""

from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class PatientReportSummary(BaseModel):
    """One row in the patient history list (GET /patients/history)."""

    id: int
    patient_name: str
    age: int
    gender: Optional[str] = None
    risk_level: str
    analysis_date: datetime

    class Config:
        from_attributes = True


class PatientReportDetail(BaseModel):
    """Full report for GET /patients/report/{id} (includes report_data)."""

    id: int
    user_id: int
    patient_name: str
    age: int
    gender: Optional[str] = None
    risk_score: float
    risk_level: str
    analysis_date: datetime
    report_data: Dict[str, Any] = Field(..., description="Full prediction + biomarker inputs")

    class Config:
        from_attributes = True
