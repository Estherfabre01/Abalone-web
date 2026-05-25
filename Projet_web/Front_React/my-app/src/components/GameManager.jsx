import { useEffect, useState } from "react";

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
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/games/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ opponent_id: friendId })
    });

    const data = await res.json();

    if (data.id) {
      alert("Partie créée !");
      setShowFriendPicker(false);
      loadGames();
    }
  }

  useEffect(() => {
    loadGames();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Accueil</h1>

      {/* Boutons */}
      <div style={{ marginBottom: 20 }}>
        <button
          style={{ padding: 10, marginRight: 10 }}
          onClick={openFriendPicker}
        >
          Créer une partie
        </button>
      </div>

      {/* Popup choix ami */}
      {showFriendPicker && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 10,
              width: 300
            }}
          >
            <h3>Choisir un ami</h3>

            {friends.length === 0 && <p>Aucun ami disponible.</p>}

            <ul>
              {friends.map((f) => (
                <li key={f.id} style={{ marginBottom: 10 }}>
                  {f.username}
                  <button
                    style={{ marginLeft: 10 }}
                    onClick={() => createGameWithFriend(f.id)}
                  >
                    Jouer
                  </button>
                </li>
              ))}
            </ul>

            <button
              style={{ marginTop: 10 }}
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
              style={{ marginLeft: 10 }}
              onClick={() => (window.location.href = `/game/${g.id}`)}
            >
              Jouer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
