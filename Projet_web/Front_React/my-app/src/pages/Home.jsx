import { useEffect, useState } from "react";

export default function Home() {
  const [games, setGames] = useState([]);

  async function loadGames() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/games", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const json = await res.json();
    setGames(json.games || []);
  }

  useEffect(() => {
    loadGames();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Accueil</h1>

      {/* Boutons créer/charger */}
      <div style={{ marginBottom: 20 }}>
        <button style={{ padding: 10, marginRight: 10 }}>
          Créer une partie
        </button>

        <button style={{ padding: 10 }}>
          Charger une partie
        </button>
      </div>

      {/* Liste des parties en cours */}
      <h2>🎮 Parties en cours</h2>
      {games.length === 0 && <p>Aucune partie en cours.</p>}
      <ul>
        {games.map((g) => (
          <li key={g.id}>
            Partie #{g.id} — {g.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
