import { Link } from "react-router-dom";
import "../global.css";

export default function Welcome() {
  return (
    <div className="page">
      <h1 className="page-title">Bienvenue sur Abalone</h1>
      <p className="page-subtitle">Le jeu de stratégie où chaque coup compte</p>

      <div className="btn-row">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn">Register</Link>
      </div>
    </div>
  );
}
