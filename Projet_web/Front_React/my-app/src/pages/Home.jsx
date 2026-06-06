import { useEffect, useState } from "react";
import Header from "../components/Header";
import Friends from "../components/Friends";

export default function Home() {
  const [games, setGames] = useState([]);
  const [friends, setFriends] = useState([]);
  const [showFriendPicker, setShowFriendPicker] = useState(false);

  async function loadGames() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/games", {
      headers: { Authorization: "Bearer " + token }
    });

    const json = await res.json();
    setGames(json || []);
  }

  async function loadFriends() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/friends", {
      headers: { Authorization: "Bearer " + token }
    });

    const json = await res.json();
    setFriends(json.friends || []);
  }

  function openFriendPicker() {
    loadFriends();
    setShowFriendPicker(true);
  }

  async function createGameWithFriend(friendId) {
  console.log("%c[CREATE] --- Début création de partie ---", "color: cyan; font-weight: bold");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  console.log("%c[CREATE] User connecté =", "color: yellow", userId);
  console.log("%c[CREATE] Token envoyé =", "color: yellow", token);
  console.log("%c[CREATE] Opponent ID envoyé =", "color: orange", friendId);

  const url = "http://localhost:3000/api/games/create";
  console.log("%c[CREATE] URL appelée =", "color: lightblue", url);

  const payload = { opponent_id: friendId };
  console.log("%c[CREATE] Body JSON envoyé =", "color: lightgreen", payload);

  try {
    console.log("%c[CREATE] Envoi au backend...", "color: lightgreen");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(payload)
    });

    console.log("%c[CREATE] Status HTTP =", "color: lightgreen", res.status);

    const data = await res.json();

    console.log("%c[CREATE] Réponse backend =", "color: lightgreen", data);

    if (data.error) {
      console.error("%c[CREATE] ERREUR backend :", "color: red", data.error);
      alert("Erreur : " + data.error);
      return;
    }

    if (data.id) {
      console.log("%c[CREATE] Partie créée avec succès ! ID =", "color: green; font-weight: bold", data.id);
      alert("Partie créée !");
      setShowFriendPicker(false);
      loadGames();
    } else {
      console.warn("%c[CREATE] Pas d'ID retourné par le backend", "color: red");
    }

  } catch (err) {
    console.error("%c[CREATE] Exception attrapée :", "color: red", err);
    alert("Erreur réseau lors de la création de la partie.");
  }
}


  useEffect(() => {
    loadGames();
  }, []);

  return (
    <div style={styles.layout}>

      {/* Header */}
      <Header />

      {/* Main content */}
      <div style={styles.main}>

        {/* Zone centrale */}
        <div style={styles.center}>
          <h1>Accueil</h1>

          <div style={{ marginBottom: 20 }}>
            <button style={styles.button} onClick={openFriendPicker}>
              Créer une partie
            </button>
          </div>

          {/* Popup choix ami */}
          {showFriendPicker && (
            <div style={styles.overlay}>
              <div style={styles.popup}>
                <h3>Choisir un ami</h3>

                {friends.length === 0 && <p>Aucun ami disponible.</p>}

                <ul>
                  {friends.map((f) => (
                    <li key={f.id} style={{ marginBottom: 10 }}>
                      {f.username}
                      <button
                        style={styles.smallButton}
                        onClick={() => createGameWithFriend(f.id)}
                      >
                        Jouer
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  style={styles.cancelButton}
                  onClick={() => setShowFriendPicker(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Liste des parties */}
          <h2>🎮 Parties en cours</h2>

          {games.length === 0 && <p>Aucune partie en cours.</p>}

          <ul>
            {games.map((g) => (
              <li key={g.id} style={{ marginBottom: 10 }}>
                Partie #{g.id} — {g.status}
                <button
                  style={styles.smallButton}
                  onClick={() => (window.location.href = `/game/${g.id}`)}
                >
                  Jouer
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Friends à droite */}
        <div style={styles.sidebar}>
          <Friends />
        </div>

      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    background: "#f5f6fa"
  },
  main: {
    display: "flex",
    flex: 1
  },
  center: {
    flex: 1,
    padding: "20px",
    overflowY: "auto"
  },
  sidebar: {
    width: "260px",
    borderLeft: "1px solid #ccc",
    padding: "20px",
    background: "white",
    overflowY: "auto"
  },
  button: {
    padding: 10,
    background: "#3498db",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  smallButton: {
    marginLeft: 10,
    padding: "4px 8px",
    background: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  cancelButton: {
    marginTop: 10,
    padding: "6px 12px",
    background: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  popup: {
    background: "white",
    padding: 20,
    borderRadius: 10,
    width: 300
  }
};
