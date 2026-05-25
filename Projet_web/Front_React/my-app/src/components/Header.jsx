import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 25px",
        background: "linear-gradient(90deg, #4a90e2, #6a5acd)",
        color: "white",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        fontFamily: "Arial, sans-serif"
      }}
    >
      {/* Logo + Titre */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
          alt="logo"
          style={{ width: "40px", height: "40px" }}
        />
        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "bold" }}>
          AB.io
        </h1>
      </div>

      {/* Profil utilisateur */}
      {user && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 12px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(4px)"
          }}
        >
          {/* Avatar rond */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "white",
              color: "#4a90e2",
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
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>
              {user.username}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              {user.email}
            </div>
          </div>

          {/* Bouton logout */}
          <button
            onClick={logout}
            style={{
              marginLeft: "10px",
              padding: "6px 12px",
              background: "#ff4d4d",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.2s"
            }}
            onMouseOver={(e) => (e.target.style.background = "#e63939")}
            onMouseOut={(e) => (e.target.style.background = "#ff4d4d")}
          >
            Déconnexion
          </button>
        </div>
      )}
    </header>
  );
}
