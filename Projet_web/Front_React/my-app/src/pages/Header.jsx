import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "15px 25px",
        background: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif"
      }}
    >
      {user && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 12px",
            borderRadius: "8px",
            background: "#eef2f7"
          }}
        >
          {/* Avatar rond */}
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "#4a90e2",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: "18px"
            }}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>

          {/* Infos user */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: "bold" }}>{user.username}</div>
            <div style={{ fontSize: "12px", color: "#555" }}>{user.email}</div>
          </div>

          {/* Bouton logout */}
          <button
            onClick={logout}
            style={{
              marginLeft: "10px",
              padding: "6px 12px",
              background: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Déconnexion
          </button>
        </div>
      )}
    </header>
  );
}
