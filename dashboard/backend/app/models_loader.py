import joblib
from pathlib import Path

models_path = Path(__file__).parent.parent / "models"

def load_model(name):
    return joblib.load(models_path / name)

isolation_forest       = load_model("fraud_detector.pkl")
if_threshold            = load_model("threshold.pkl")
xgb_classifier          = load_model("fraud_classifier.pkl")
label_encoder           = load_model("label_fraud_encoder.pkl")
onehot_encoder          = load_model("onehot_fraud_encoder.pkl")
scaler                  = load_model("fraud_data_scaler.pkl")
network_model           = load_model("network_model.pkl")
onehot_encoder_network  = load_model("encoder_network.pkl")
scaler_network          = load_model("scaler_network.pkl")

FRAUD_TYPES = list(label_encoder.classes_)