import numpy as np
from app.preprocessing import preprocess
from app.models_loader import isolation_forest, if_threshold, xgb_classifier, label_encoder, onehot_encoder, scaler

def analyze_dataframe(df):
    df_original = df.copy()
    if "amount" not in df.columns:
        df["amount"] = 0.0

    features = preprocess(df)

    scores_if  = -isolation_forest.score_samples(features)
    fraud_mask = scores_if >= if_threshold

    fraud_indices = np.where(fraud_mask)[0]
    fraud_types = {}
    if len(fraud_indices) > 0:
        fraud_features = features[fraud_mask]
        preds_encoded  = xgb_classifier.predict(fraud_features)
        preds_decoded  = label_encoder.inverse_transform(preds_encoded)
        fraud_types    = dict(zip(fraud_indices, preds_decoded))

    results  = []
    par_pays = {}
    par_type = {}

    for i in range(len(df)):
        is_fraud    = int(fraud_mask[i])
        score       = round(float(scores_if[i]), 4)
        pays        = str(df_original.iloc[i].get("merchant_country", "N/A"))
        type_fraude = fraud_types.get(i, "legitime")
        account_id  = str(df_original.iloc[i].get("account_id", f"TXN_{i:05d}"))

        if is_fraud:
            par_pays[pays] = par_pays.get(pays, 0) + 1
            par_type[type_fraude] = par_type.get(type_fraude, 0) + 1

        results.append({
            "index"       : i,
            "account_id"  : account_id,
            "score"       : score,
            "type_fraude" : type_fraude,
            "pays"        : pays,
            "montant"     : float(df_original.iloc[i].get("amount", 0)),
            "heure"       : int(df_original.iloc[i].get("hour_of_day", 0)),
            "is_fraud"    : is_fraud
        })

    nb_fraudes = int(fraud_mask.sum())
    total      = len(df)

    return {
        "total"        : total,
        "nb_fraudes"   : nb_fraudes,
        "nb_legitimes" : total - nb_fraudes,
        "taux_fraude"  : round(nb_fraudes / total * 100, 2),
        "transactions" : results,
        "par_pays"     : par_pays,
        "par_type"     : par_type
    }