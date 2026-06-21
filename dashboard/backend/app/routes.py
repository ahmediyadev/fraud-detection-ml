import os
import pandas as pd
from pathlib import Path
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.detection import analyze_dataframe
from app.network import analyze_network, simulate_network

api = Blueprint("api", __name__)

uploads_path = Path("uploads")

required_cols = [
    "hour_of_day", "day_of_week", "mcc_code", "card_present", "device_known",
    "ip_risk_score", "is_foreign_txn", "time_since_last_s",
    "velocity_1h", "amount_vs_avg_ratio", "account_age_days",
    "has_2fa", "credit_limit", "merchant_category",
    "merchant_country", "device_type"
]


def get_latest_csv():
    csv_files = list(uploads_path.glob("*.csv"))
    if not csv_files:
        return None
    return max(csv_files, key=lambda f: f.stat().st_mtime)


@api.route("/api/analyze", methods=["POST"])
def analyze():
    if "file" not in request.files:
        return jsonify({"error": "Aucun fichier fourni"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Nom de fichier vide"}), 400

    filename = secure_filename(file.filename)
    filepath = uploads_path / filename
    file.save(filepath)

    try:
        df = pd.read_csv(filepath)
    except Exception:
        return jsonify({"error": "Fichier CSV invalide"}), 400

    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        return jsonify({"error": f"Colonnes manquantes : {', '.join(missing)}"}), 400

    results = analyze_dataframe(df)
    return jsonify(results)


@api.route("/api/analyze", methods=["GET"])
def analyze_latest():
    latest_file = get_latest_csv()

    if latest_file is None:
        return jsonify({"error": "Aucun fichier disponible"}), 404

    try:
        df = pd.read_csv(latest_file)
    except Exception:
        return jsonify({"error": "Fichier CSV invalide"}), 400

    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        return jsonify({"error": f"Colonnes manquantes : {', '.join(missing)}"}), 400

    results = analyze_dataframe(df)
    return jsonify(results)


@api.route("/api/has-data", methods=["GET"])
def has_data():
    files = [f for f in os.listdir(uploads_path) if f.endswith(".csv")]
    return jsonify({"has_data": len(files) > 0})


@api.route("/api/network/analyze", methods=["POST"])
def network_analyze():
    data = request.get_json()
    comptes = data.get("comptes", [])

    if len(comptes) < 2:
        return jsonify({"error": "Au moins 2 comptes requis"}), 400

    return jsonify(analyze_network(comptes))


@api.route("/api/network/simulate", methods=["POST"])
def network_simulate():
    data = request.get_json()
    n_comptes       = int(data.get("n_comptes", 5))
    fraud_type      = data.get("fraud_type", "card_not_present")
    connection_type = data.get("connection_type", "ip_address")

    return jsonify(simulate_network(n_comptes, fraud_type, connection_type))


@api.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status"  : "ok",
        "modeles" : ["isolation_forest", "xgb_classifier", "network_model"]
    })