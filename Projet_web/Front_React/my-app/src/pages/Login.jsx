import { useState } from "react";
import { login as apiLogin } from "../api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../global.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await apiLogin(email, password);

    if (res.token && res.user) {
      login(res.token, res.user);
      navigate("/home");
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Connexion</h1>
      <p className="page-subtitle">Rejoins la partie et joue à Abalone</p>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          className="input"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          onChange={e => setPassword(e.target.value)}
          className="input"
        />

        <button className="btn" style={{ marginTop: "20px" }}>
          Se connecter
        </button>
      </form>
    </div>
  );
}
