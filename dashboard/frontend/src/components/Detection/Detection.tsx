import { useState, useEffect } from "react";
import Card from "../Card/Card";
import "./Detection.css";

const HAS_DATA_URL = "http://127.0.0.1:5000/api/has-data";
const ANALYZE_URL = "http://127.0.0.1:5000/api/analyze";

interface Transaction {
  index: number;
  account_id: string;
  score: number;
  type_fraude: string;
  pays: string;
  montant: number;
  heure: number;
  is_fraud: number;
}

interface AnalyzeResult {
  total: number;
  nb_fraudes: number;
  nb_legitimes: number;
  taux_fraude: number;
  transactions: Transaction[];
  par_pays: Record<string, number>;
  par_type: Record<string, number>;
}

export default function Detection() {
  const [hasData, setHasData] = useState<boolean | null>(null);
  const [stats, setStats] = useState<AnalyzeResult | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    fetch(HAS_DATA_URL)
      .then((res) => res.json())
      .then((data) => setHasData(data.has_data))
      .catch(() => setHasData(false));
  }, []);

  useEffect(() => {
    if (!hasData) return;

    setLoadingStats(true);
    fetch(ANALYZE_URL)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoadingStats(false));
  }, [hasData]);

  if (hasData === null || loadingStats) {
    return (
      <div className="detection-wrapper">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!hasData || !stats) {
    return (
      <div className="detection-wrapper">
        <div className="no-data">
          <h1>Aucune donnée à afficher</h1>
          <p>Importez un fichier CSV depuis la page d'accueil pour voir les statistiques.</p>
        </div>
      </div>
    );
  }

  const fraudAccounts = stats.transactions.filter((t) => t.is_fraud === 1);

  return (
    <div className="detection-wrapper">
      <h1 className="detection-title">Statistiques de détection</h1>

      <div className="cards-row">
        <Card title="Transactions lues" stats={stats.total} />
        <Card title="Transactions saines" stats={stats.nb_legitimes} />
        <Card title="Fraudes détectées" stats={stats.nb_fraudes} />
        <Card title="Taux de fraude (%)" stats={stats.taux_fraude} />
      </div>

      <div className="detection-content">
        <div className="empty-zone"></div>

        <div className="fraud-list">
          <h2 className="fraud-list-title">Comptes frauduleux</h2>
          <ul>
            {fraudAccounts.map((item) => (
              <li key={item.index} className="fraud-item">
                <span className="fraud-account">{item.account_id}</span>
                <span className="fraud-type">{item.type_fraude}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}