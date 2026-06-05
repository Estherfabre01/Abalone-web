// src/components/Direction.jsx
export default function Direction({ onMove }) {
  const directions = [
    { code: "NW", label: "↖", name: "NW" },
    { code: "NE", label: "↗", name: "NE" },
    { code: "E",  label: "→", name: "E"  },
    { code: "SE", label: "↘", name: "SE" },
    { code: "SW", label: "↙", name: "SW" },
    { code: "W",  label: "←", name: "W"  }
  ];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Déplacer les billes sélectionnées</h3>

      <div style={styles.grid}>
        {directions.map((d) => (
          <button
            key={d.code}
            onClick={() => onMove(d.code)}
            style={styles.button}
          >
            <span style={styles.icon}>{d.label}</span>
            <span style={styles.text}>{d.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: 20,
    textAlign: "center"
  },
  title: {
    marginBottom: 12,
    fontSize: "20px",
    fontWeight: "600",
    color: "#333"
  },
  grid: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  button: {
    background: "linear-gradient(135deg, #444, #222)",
    color: "white",
    border: "2px solid #666",
    borderRadius: "10px",
    padding: "10px 18px",
    fontSize: "18px",
    cursor: "pointer",
    transition: "0.2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "70px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.3)"
  },
  icon: {
    fontSize: "22px",
    marginBottom: "4px"
  },
  text: {
    fontSize: "14px",
    opacity: 0.8
  }
};
