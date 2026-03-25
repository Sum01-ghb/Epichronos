"""
Patient report history API.
All routes require authentication. Reports are filtered by logged-in user (user_id from JWT).
"""

import json

from fastapi import APIRouter, Depends, HTTPException, status
from auth import get_current_user
from database import get_db
from models import PatientReport, User
from schemas.patient_schema import PatientReportDetail, PatientReportSummary
from sqlalchemy.orm import Session

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("/history", response_model=list[PatientReportSummary])
def get_patient_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return all reports belonging to the authenticated user.
    Ordered by analysis_date descending (newest first).
    """
    reports = (
        db.query(PatientReport)
        .filter(PatientReport.user_id == current_user.id)
        .order_by(PatientReport.analysis_date.desc())
        .all()
    )
    return [
        PatientReportSummary(
            id=r.id,
            patient_name=r.patient_name,
            age=r.age,
            gender=r.gender or None,
            risk_level=r.risk_level,
            analysis_date=r.analysis_date,
        )
        for r in reports
    ]


@router.get("/report/{report_id}", response_model=PatientReportDetail)
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return the full stored report (including report_data) for the given id.
    Only allowed if the report belongs to the authenticated user.
    """
    report = db.query(PatientReport).filter(PatientReport.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )
    if report.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this report",
        )
    report_data = json.loads(report.report_data) if isinstance(report.report_data, str) else report.report_data
    return PatientReportDetail(
        id=report.id,
        user_id=report.user_id,
        patient_name=report.patient_name,
        age=report.age,
        gender=report.gender or None,
        risk_score=report.risk_score,
        risk_level=report.risk_level,
        analysis_date=report.analysis_date,
        report_data=report_data,
    )
