"""
schemas.py — Pydantic models for request/response validation.
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=20, description="News article text to analyze")


class PredictResponse(BaseModel):
    id: int
    label: str                  # "REAL" or "FAKE"
    confidence: float           # 0.0 to 1.0
    confidence_pct: str         # "94.2%"
    word_count: int
    text_snippet: str
    verdict: str                # Human-friendly verdict string
    created_at: str


class PredictionRecord(BaseModel):
    id: int
    label: str
    confidence: float
    confidence_pct: str
    word_count: int
    text_snippet: str
    created_at: str

    class Config:
        from_attributes = True


class StatsResponse(BaseModel):
    total: int
    real_count: int
    fake_count: int
    real_pct: float
    fake_pct: float
    avg_confidence: float
