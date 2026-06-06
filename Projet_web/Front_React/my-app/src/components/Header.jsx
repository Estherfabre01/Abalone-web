import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import "../global.css";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">

      {/* Logo + Titre cliquables */}
      <Link to="/home" className="header-left" style={{ textDecoration: "none", color: "inherit" }}>
        <svg
          className="header-logo"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="50 5, 93 27.5, 93 72.5, 50 95, 7 72.5, 7 27.5"
            fill="none"
            stroke="black"
            strokeWidth="6"
          />
        </svg>

        <h1 className="header-title">ABALio</h1>
      </Link>

      {/* Profil utilisateur */}
      {user && (
        <div className="header-userbox">

          {/* Avatar */}
          <div className="header-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>

          {/* Infos */}
          <div className="header-userinfo">
            <div>{user.username}</div>
            <div>{user.email}</div>
          </div>

          {/* Logout */}
          <button className="header-logout" onClick={logout}>
            Déconnexion
          </button>
        </div>
      )}
    </header>
  );
}
