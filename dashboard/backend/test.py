import sys
sys.path.insert(0, ".")

import pandas as pd
import numpy as np
from app.preprocessing import preprocess
from app.models_loader import isolation_forest, if_threshold

df = pd.read_csv("uploads/transactions_test_fraudes.csv")  # ajuste le chemin si besoin

features = preprocess(df)
scores = -isolation_forest.score_samples(features)

print("Seuil actuel (if_threshold) :", if_threshold)
print("\nScore min  :", scores.min())
print("Score max  :", scores.max())
print("Score moyen:", scores.mean())
print("\nDistribution des scores (triés, du plus suspect au moins) :")
sorted_idx = np.argsort(-scores)
for i in sorted_idx[:10]:
    print(f"  Ligne {i:2d} | score = {scores[i]:.4f} | account = {df.iloc[i]['account_id']}")