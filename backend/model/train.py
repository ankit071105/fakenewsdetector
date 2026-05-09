"""
train.py — Train and save the Fake News Detection model.
Run this once before starting the FastAPI server.

Dataset: https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset
Download Fake.csv and True.csv, place them in backend/model/data/
"""

import os
import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import PassiveAggressiveClassifier, LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import re
import string

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), "vectorizer.pkl")


def clean_text(text: str) -> str:
    """Basic NLP preprocessing."""
    text = text.lower()
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>+', '', text)
    text = re.sub(r'[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub(r'\n', ' ', text)
    text = re.sub(r'\w*\d\w*', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def load_data():
    fake_path = os.path.join(DATA_DIR, "Fake.csv")
    true_path = os.path.join(DATA_DIR, "True.csv")

    if not os.path.exists(fake_path) or not os.path.exists(true_path):
        print("ERROR: Place Fake.csv and True.csv in backend/model/data/")
        print("Download from: https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset")
        return None, None

    fake_df = pd.read_csv(fake_path)
    true_df = pd.read_csv(true_path)

    fake_df["label"] = 0  # 0 = FAKE
    true_df["label"] = 1  # 1 = REAL

    df = pd.concat([fake_df, true_df], ignore_index=True)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)

    # Combine title + text for better signal
    df["content"] = df["title"].fillna("") + " " + df["text"].fillna("")
    df["content"] = df["content"].apply(clean_text)

    return df["content"], df["label"]


def train():
    print("Loading data...")
    X, y = load_data()
    if X is None:
        return

    print(f"Dataset size: {len(X)} articles")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("Vectorizing with TF-IDF...")
    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_df=0.7,
        max_features=50000,
        ngram_range=(1, 2)
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    print("Training Passive Aggressive Classifier...")
    pac = PassiveAggressiveClassifier(max_iter=50, random_state=42)
    pac.fit(X_train_vec, y_train)

    y_pred = pac.predict(X_test_vec)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nPassive Aggressive Classifier Accuracy: {accuracy * 100:.2f}%")
    print(classification_report(y_test, y_pred, target_names=["FAKE", "REAL"]))

    # Save model and vectorizer
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(pac, f)
    with open(VECTORIZER_PATH, "wb") as f:
        pickle.dump(vectorizer, f)

    print(f"\nModel saved to: {MODEL_PATH}")
    print(f"Vectorizer saved to: {VECTORIZER_PATH}")
    print("\nDone! You can now start the FastAPI server.")


if __name__ == "__main__":
    train()
