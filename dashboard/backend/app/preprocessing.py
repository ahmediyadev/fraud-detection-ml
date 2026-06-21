import pandas as pd
from app.models_loader import onehot_encoder, scaler


def preprocess(df, encoder=onehot_encoder, scaler=scaler):
    df = df.copy()

    drop_cols = [
        "transaction_id", "account_id", "timestamp", "is_weekend",
        "amount", "fraud_pattern", "is_fraud"
    ]

    for col in drop_cols:
        if col in df.columns:
            df = df.drop(columns=[col])

    cat_features = ["merchant_category", "merchant_country", "device_type"]
    for f in cat_features:
        if f not in df.columns:
            df[f] = "unknown"

    cat_encoded = encoder.transform(df[cat_features])
    cat_names = encoder.get_feature_names_out(cat_features)
    cat_df = pd.DataFrame(cat_encoded, columns=cat_names, index=df.index)

    df = df.drop(columns=cat_features)
    df = pd.concat([df, cat_df], axis=1)

    df_scaled = scaler.transform(df)

    return df_scaled