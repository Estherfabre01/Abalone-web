import { useState } from "react";
import { login as apiLogin } from "../api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await apiLogin(email, password);

    console.log("Réponse login :", res);

    if (res.token && res.user) {
      login(res.token, res.user);
      navigate("/");
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #4a90e2, #50c9c3)",
        fontFamily: "Arial, sans-serif",
        padding: "20px"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          width: "100%",
          maxWidth: "380px",
          textAlign: "center"
        }}
      >
        <h1 style={{ marginBottom: "10px", fontSize: "26px", color: "#333" }}>
          Bienvenue !
        </h1>

        <p style={{ marginBottom: "25px", color: "#666", fontSize: "15px" }}>
          Connecte‑toi pour jouer au meilleur jeu :  
          <span style={{ fontWeight: "bold", color: "#4a90e2" }}>ABALONE</span>
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px"
            }}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            onChange={e => setPassword(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px"
            }}
          />

          <button
            style={{
              padding: "12px",
              background: "#4a90e2",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              marginTop: "10px"
            }}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
