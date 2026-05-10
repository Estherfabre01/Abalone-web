export default function Home() {
  return (
    <div
      style={{
        height: "calc(100vh - 70px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fa",
        fontFamily: "Arial, sans-serif",
        textAlign: "center"
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
        Bienvenue sur Abalone Online
      </h1>

      <p style={{ fontSize: "18px", color: "#555", maxWidth: "500px" }}>
        Tu es connecté. Tu peux maintenant créer une partie, rejoindre une partie,
        ou accéder à ton profil.
      </p>

      <div style={{ marginTop: "30px", display: "flex", gap: "20px" }}>
        <button
          style={{
            padding: "12px 20px",
            background: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          Créer une partie
        </button>

        <button
          style={{
            padding: "12px 20px",
            background: "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          Rejoindre une partie
        </button>
      </div>
    </div>
  );
}
