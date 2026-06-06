import { useState } from "react";
import { register } from "../api";
import { useNavigate } from "react-router-dom";
import "../global.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await register(username, email, password);
    navigate("/login");
  }

  return (
    <div className="page">
      <h1 className="page-title">Créer un compte</h1>
      <p className="page-subtitle">Rejoins la communauté Abalone</p>

      <form onSubmit={handleSubmit} className="form">
        <input
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
        />

        <button className="btn" style={{ marginTop: "20px" }}>
          S'inscrire
        </button>
      </form>

      <p style={{ marginTop: "20px" }}>
        Déjà un compte ?{" "}
        <span
          style={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Se connecter
        </span>
      </p>
    </div>
  );
}
