import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bienvenue sur Abalone</h1>
      <p style={styles.subtitle}>Le jeu de stratégie où chaque coup compte</p>

      <div style={styles.buttons}>
        <Link to="/login" style={styles.loginBtn}>Login</Link>
        <Link to="/register" style={styles.registerBtn}>Register</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1e1e2f, #2d2d44)",
    color: "white",
    textAlign: "center",
    padding: "20px"
  },
  title: {
    fontSize: "3rem",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: "1.3rem",
    marginBottom: "40px",
    opacity: 0.8,
  },
  buttons: {
    display: "flex",
    gap: "20px",
  },
  loginBtn: {
    padding: "12px 28px",
    background: "#4c8bf5",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "1.1rem",
    fontWeight: "bold",
  },
  registerBtn: {
    padding: "12px 28px",
    background: "#34c759",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "1.1rem",
    fontWeight: "bold",
  }
};
