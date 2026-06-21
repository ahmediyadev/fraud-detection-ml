import numpy as np
from app.models_loader import network_model, onehot_encoder_network, scaler_network

def build_edge_features(compte_a, compte_b, connection_type):
    shared_type_encoded = encoder_network.transform([[connection_type]])
    features_num = np.array([[
        1, 1, 2,
        compte_a.get("nb_transactions", 100),
        compte_a.get("taux_fraude", 0.8),
        compte_a.get("montant_moyen", 1000),
        compte_a.get("velocity_moy", 5),
        compte_a.get("ip_risk_moy", 80),
        compte_a.get("nb_pays", 4),
        compte_a.get("a_fraud_pattern", 1),
        compte_b.get("nb_transactions", 100),
        compte_b.get("taux_fraude", 0.8),
        compte_b.get("montant_moyen", 1000),
        compte_b.get("velocity_moy", 5),
        compte_b.get("ip_risk_moy", 80),
        compte_b.get("nb_pays", 4),
        compte_b.get("a_fraud_pattern", 1),
        abs(compte_a.get("taux_fraude", 0.8) - compte_b.get("taux_fraude", 0.8)),
        abs(compte_a.get("montant_moyen", 1000) - compte_b.get("montant_moyen", 1000)),
        abs(compte_a.get("ip_risk_moy", 80) - compte_b.get("ip_risk_moy", 80)),
        compte_a.get("taux_fraude", 0.8) + compte_b.get("taux_fraude", 0.8),
        2, 2, 4
    ]])
    features = np.hstack([features_num, shared_type_encoded])
    return scaler_network.transform(features)


def analyze_network(comptes):
    nodes = [{"id": c["id"], "type_fraude": c.get("type_fraude", "inconnu"),
              "score": c.get("score", 0)} for c in comptes]

    edges = []
    connection_types = ["ip_address", "phone", "email_domain"]

    for i in range(len(comptes)):
        for j in range(i + 1, len(comptes)):
            conn_type = np.random.choice(connection_types)
            features_edge = build_edge_features(comptes[i], comptes[j], conn_type)
            proba = network_model.predict_proba(features_edge)[0][1]
            if proba >= 0.5:
                edges.append({
                    "source"         : comptes[i]["id"],
                    "target"         : comptes[j]["id"],
                    "connection_type": conn_type,
                    "probabilite"    : round(float(proba), 4)
                })

    return {"nodes": nodes, "edges": edges}


def simulate_network(n_comptes, fraud_type, connection_type):
    comptes = []
    for i in range(n_comptes):
        comptes.append({
            "id"              : f"SIM_{i:04d}",
            "type_fraude"     : fraud_type,
            "score"           : round(np.random.uniform(0.6, 0.99), 4),
            "taux_fraude"     : round(np.random.uniform(0.6, 1.0), 3),
            "montant_moyen"   : round(np.random.uniform(500, 5000), 2),
            "velocity_moy"    : round(np.random.uniform(3, 10), 2),
            "ip_risk_moy"     : round(np.random.uniform(60, 100), 2),
            "nb_pays"         : np.random.randint(3, 8),
            "nb_transactions" : np.random.randint(50, 200),
            "a_fraud_pattern" : 1
        })

    nodes = [{"id": c["id"], "type_fraude": c["type_fraude"],
              "score": c["score"]} for c in comptes]

    edges = []
    for i in range(len(comptes)):
        for j in range(i + 1, len(comptes)):
            features_edge = build_edge_features(comptes[i], comptes[j], connection_type)
            proba = network_model.predict_proba(features_edge)[0][1]
            edges.append({
                "source"         : comptes[i]["id"],
                "target"         : comptes[j]["id"],
                "connection_type": connection_type,
                "probabilite"    : round(float(proba), 4)
            })

    return {"nodes": nodes, "edges": edges}