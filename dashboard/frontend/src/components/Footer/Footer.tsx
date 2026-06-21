import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Groupe N°1 — Tous droits réservés</p>
    </footer>
  );
}