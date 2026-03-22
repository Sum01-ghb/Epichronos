"""
SQLAlchemy ORM models for EpiChronos.
"""

from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from database import Base


class User(Base):
    """User table: id, name, email, hashed_password, created_at."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class PatientReport(Base):
    """
    Stores one analyzed risk report per authenticated user.
    report_data holds the full prediction JSON (biomarker inputs, contributions, etc.).
    """

    __tablename__ = "patient_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    patient_name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(64), nullable=True)
    risk_score = Column(Float, nullable=False)
    risk_level = Column(String(32), nullable=False)
    analysis_date = Column(DateTime, default=datetime.utcnow)
    report_data = Column(Text, nullable=False)  # JSON string of full prediction + inputs
