import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header style={{
      display: "flex",
      justifyContent: "flex-end",
      padding: "10px",
      background: "#eee"
    }}>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>{user.username} ({user.email})</span>
          <button onClick={logout}>Déconnexion</button>
        </div>
      )}
    </header>
  );
}
