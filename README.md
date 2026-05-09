# TruthLens — Fake News Detector

A full-stack fake news detection app using NLP + Machine Learning.

**Stack:** Next.js 14 · FastAPI · SQLite · scikit-learn (TF-IDF + PAC)

---

## Project Structure

```
fake-news-detector/
├── backend/
│   ├── main.py              ← FastAPI server
│   ├── database.py          ← SQLite setup
│   ├── schemas.py           ← Pydantic models
│   ├── requirements.txt
│   └── model/
│       ├── train.py         ← Train the ML model
│       ├── model.pkl        ← Saved after training
│       ├── vectorizer.pkl   ← Saved after training
│       └── data/            ← Put Fake.csv + True.csv here
│
└── frontend/
    ├── app/
    │   ├── page.tsx             ← Main analysis page
    │   ├── history/page.tsx     ← History of analyses
    │   └── how-it-works/page.tsx ← Explanation + diagrams
    ├── components/
    │   └── Navbar.tsx
    └── ...
```

---

## Setup Instructions

### Step 1 — Get the dataset

1. Go to: https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset
2. Download `Fake.csv` and `True.csv`
3. Place both files in `backend/model/data/`

### Step 2 — Train the model

```bash
cd backend
pip install -r requirements.txt
python model/train.py
```

This creates `model/model.pkl` and `model/vectorizer.pkl`.
Expected accuracy: ~94–96%.

### Step 3 — Start the backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

The API runs at http://localhost:8000

### Step 4 — Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The website runs at http://localhost:3000

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Analyse an article |
| GET | `/history` | Get past predictions |
| GET | `/stats` | Get summary statistics |
| DELETE | `/predictions/{id}` | Delete a record |
| GET | `/health` | Check server + model status |

### Example request

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Scientists discover that coffee cures all diseases..."}'
```

---

## How it works

1. User pastes article text
2. FastAPI receives and cleans the text (removes URLs, punctuation, stopwords)
3. TF-IDF vectorizer converts text to a numeric vector
4. Passive Aggressive Classifier predicts REAL or FAKE
5. Result + confidence score returned to frontend
6. Record saved to SQLite database

---

## Limitations

- Trained on English-language news only
- ~94–96% accuracy — not 100%
- Best used as a first filter, not a definitive verdict
- Always verify from primary sources
