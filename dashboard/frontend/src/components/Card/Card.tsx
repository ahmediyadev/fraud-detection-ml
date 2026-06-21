import "./Card.css";

export interface CardProps {
  title: string;
  stats: number;
}

function Card({ title, stats }: CardProps) {
  return (
    <div className="card">
      <div className="d-flex rounded">
        <h1>{stats}</h1>
        <h1>{title}</h1>
      </div>
    </div>
  );
}

export default Card;

/*const [prompt, setPrompt]     = useState("");
  const [result, setResult]     = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const endpoint = type === "image" ? "/generate_image" : "/generate_video";
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({prompt}),
      });

      if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);

      const data = await response.json();
      setResult(type === "image" ? data.image : data.video);

    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };*/