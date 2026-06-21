import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const UPLOAD_URL = "http://127.0.0.1:5000/api/analyze";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleFileChange(e: any) {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
      setMessage("");
    } else {
      setFile(null);
      setMessage("Seuls les fichiers .csv sont acceptés.");
    }
  }

  async function handleSendFile() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Fichier envoyé avec succès !");
        navigate("/detection");
      } else {
        setMessage("Erreur lors de l'envoi.");
      }
    } catch (err) {
      setMessage("Erreur lors de l'envoi.");
    }
  }

  return (
    <div className="page-wrapper">
      <div className="upload-box">
        <h1 className="upload-title">Insérez vos données</h1>

        <div className="dashed-zone">
          <label className="upload-btn">
            Choisir un fichier
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              hidden
            />
          </label>

          {file && <p className="file-name">{file.name}</p>}
        </div>

        {message && <p className="message">{message}</p>}

        {file && (
          <button className="send-btn" onClick={handleSendFile}>
            Envoyer
          </button>
        )}
      </div>
    </div>
  );
}