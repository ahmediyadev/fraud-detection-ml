import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="/bouclier.png" alt="logo" />
        <span>
          Fraud <em>Detector</em>
        </span>
      </div>

      <div className="nav-links">
        <Link to="/" className="nav-link">
          Accueil
        </Link>
        <Link to="/detection" className="nav-link">
          Dashboard
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;