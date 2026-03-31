"""
Pydantic schemas for ML risk prediction.
"""

from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    """
    Input biomarker and clinical features for the risk model.
    All fields are required; the frontend Analyze form should send matching keys.
    """

    RASSF1A_pct: float = Field(
        ..., description="Tumor methylation biomarker RASSF1A (%)"
    )
    SEPT9_pct: float = Field(
        ..., description="Tumor methylation biomarker SEPT9 (%)"
    )
    APC_pct: float = Field(..., description="Tumor methylation biomarker APC (%)")
    SFRP1_pct: float = Field(
        ..., description="Tumor methylation biomarker SFRP1 (%)"
    )
    LINE1_pct: float = Field(
        ..., description="Global methylation marker LINE1 (%)"
    )

    miR21_FC: float = Field(
        ..., description="miRNA expression fold-change miR21"
    )
    miR34a_FC: float = Field(
        ..., description="miRNA expression fold-change miR34a"
    )
    miR155_FC: float = Field(
        ..., description="miRNA expression fold-change miR155"
    )
    miR122_FC: float = Field(
        ..., description="miRNA expression fold-change miR122"
    )

    EpiProxy: float = Field(
        ..., description="Composite epigenetic vulnerability proxy"
    )
    G: float = Field(..., description="Additional epigenetic marker G")
    age: int = Field(
        ..., ge=0, description="Patient chronological age in years"
    )
    # Optional: used when saving report to history (must be sent by frontend when user is logged in)
    patient_name: Optional[str] = Field(None, description="Patient display name for report history")
    gender: Optional[str] = Field(None, description="Patient gender for report history")
    smoking_status: Optional[str] = Field(None, description="Patient smoking status for report history")


class TopBiomarker(BaseModel):
    """Single top biomarker importance entry."""

    feature: str = Field(..., description="Biomarker feature name")
    importance: float = Field(
        ..., ge=0.0, description="Relative importance (RandomForest feature importance)"
    )


class PredictionResponse(BaseModel):
    """Model output returned to the frontend."""

    risk_score: float = Field(
        ..., ge=0.0, le=1.0, description="Predicted probability of cancer (0-1)"
    )
    risk_level: str = Field(
        ..., description="Risk category: Low / Moderate / High"
    )
    biomarker_contribution: Dict[str, float] = Field(
        ...,
        description="Mapping from biomarker name to importance, sorted descending by importance",
    )
    top_biomarkers: List[TopBiomarker] = Field(
        ...,
        description="Top contributing biomarkers to the prediction, typically top 3 non-zero importances",
    )
    epigenetic_age: Optional[float] = Field(
        None,
        description=(
            "Optional epigenetic age proxy in years "
            "(chronological age + tumor_mean * 0.5). May be null."
        ),
    )

