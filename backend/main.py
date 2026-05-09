"""
main.py — FastAPI backend for Fake News Detection.
"""

import os
import re
import string
import pickle
from datetime import datetime
from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db, create_tables, Prediction
from schemas import PredictRequest, PredictResponse, PredictionRecord, StatsResponse

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "model", "model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "model", "vectorizer.pkl")

# ── Global model objects (loaded once at startup) ──────────────────────────────
model = None
vectorizer = None


def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>+', '', text)
    text = re.sub(r'[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub(r'\n', ' ', text)
    text = re.sub(r'\w*\d\w*', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, vectorizer
    create_tables()

    if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
        with open(VECTORIZER_PATH, "rb") as f:
            vectorizer = pickle.load(f)
        print("✅ Model and vectorizer loaded successfully.")
    else:
        print("⚠️  Model not found. Run model/train.py first.")
        print(f"   Expected: {MODEL_PATH}")

    yield


app = FastAPI(
    title="Fake News Detector API",
    description="NLP-powered fake news detection using Passive Aggressive Classifier",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok", "message": "Fake News Detector API is running."}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "vectorizer_loaded": vectorizer is not None,
    }


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest, db: Session = Depends(get_db)):
    if model is None or vectorizer is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Run model/train.py first to train and save the model."
        )

    cleaned = clean_text(req.text)
    if len(cleaned.split()) < 5:
        raise HTTPException(
            status_code=400,
            detail="Text too short after cleaning. Please provide a full article or paragraph."
        )

    vec = vectorizer.transform([cleaned])

    # Predict label
    raw_label = model.predict(vec)[0]
    label = "REAL" if raw_label == 1 else "FAKE"

    # Confidence via decision function (convert to 0–1 probability-like score)
    decision = model.decision_function(vec)[0]
    import numpy as np
    confidence = float(1 / (1 + np.exp(-abs(decision))))

    word_count = len(req.text.split())
    snippet = req.text[:300].strip()
    verdict = (
        f"This article appears to be {'genuine and credible' if label == 'REAL' else 'potentially misleading or fabricated'}."
    )

    record = Prediction(
        text_snippet=snippet,
        full_text=req.text,
        label=label,
        confidence=confidence,
        word_count=word_count,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return PredictResponse(
        id=record.id,
        label=label,
        confidence=confidence,
        confidence_pct=f"{confidence * 100:.1f}%",
        word_count=word_count,
        text_snippet=snippet,
        verdict=verdict,
        created_at=record.created_at.isoformat(),
    )


@app.get("/history", response_model=List[PredictionRecord])
def history(limit: int = 20, db: Session = Depends(get_db)):
    records = (
        db.query(Prediction)
        .order_by(Prediction.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        PredictionRecord(
            id=r.id,
            label=r.label,
            confidence=r.confidence,
            confidence_pct=f"{r.confidence * 100:.1f}%",
            word_count=r.word_count,
            text_snippet=r.text_snippet,
            created_at=r.created_at.isoformat(),
        )
        for r in records
    ]


@app.get("/stats", response_model=StatsResponse)
def stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Prediction.id)).scalar() or 0
    real_count = db.query(func.count(Prediction.id)).filter(Prediction.label == "REAL").scalar() or 0
    fake_count = db.query(func.count(Prediction.id)).filter(Prediction.label == "FAKE").scalar() or 0
    avg_conf = db.query(func.avg(Prediction.confidence)).scalar() or 0.0

    return StatsResponse(
        total=total,
        real_count=real_count,
        fake_count=fake_count,
        real_pct=round((real_count / total * 100) if total else 0, 1),
        fake_pct=round((fake_count / total * 100) if total else 0, 1),
        avg_confidence=round(avg_conf * 100, 1),
    )


@app.delete("/predictions/{prediction_id}")
def delete_prediction(prediction_id: int, db: Session = Depends(get_db)):
    record = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Prediction not found")
    db.delete(record)
    db.commit()
    return {"message": "Deleted successfully"}
