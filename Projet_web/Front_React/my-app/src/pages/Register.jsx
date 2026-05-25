import { useState } from "react";
import { register } from "../api";
import { useNavigate } from "react-router-dom";

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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Créer un compte</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            placeholder="Nom d'utilisateur"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button style={styles.button}>S'inscrire</button>
        </form>

        <p style={styles.linkText}>
          Déjà un compte ?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/login")}
          >
            Se connecter
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa",
    padding: 20,
    fontFamily: "Arial, sans-serif"
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "white",
    padding: 30,
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)"
  },
  title: {
    textAlign: "center",
    marginBottom: 20
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15
  },
  input: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 16
  },
  button: {
    padding: 12,
    background: "#3498db",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 16,
    cursor: "pointer",
    fontWeight: "bold"
  },
  linkText: {
    marginTop: 15,
    textAlign: "center",
    color: "#555"
  },
  link: {
    color: "#3498db",
    cursor: "pointer",
    fontWeight: "bold"
  }
};
