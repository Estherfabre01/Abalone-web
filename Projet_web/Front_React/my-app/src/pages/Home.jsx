import { useEffect, useState } from "react";
import Header from "../components/Header";
import Friends from "../components/Friends";
import "../global.css";

const API_URL = "http://192.168.1.11:3000";

export default function Home() {
  const [games, setGames] = useState([]);
  const [friends, setFriends] = useState([]);
  const [showFriendPicker, setShowFriendPicker] = useState(false);
  const [showFriendsMenu, setShowFriendsMenu] = useState(false);

  async function loadGames() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/games`, {
      headers: { Authorization: "Bearer " + token }
    });

    const json = await res.json();
    setGames(json || []);
  }

  async function loadFriends() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/friends`, {
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

    const res = await fetch(`${API_URL}/api/games/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ opponent_id: friendId })
    });

    const data = await res.json();

    if (data.error) {
      alert("Erreur : " + data.error);
      return;
    }

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
    <div className="home-layout">

      <Header />

      {/* Barre sous le header */}
      <div className="friends-bar">
        <button
          className="friends-toggle-btn"
          onClick={() => setShowFriendsMenu(!showFriendsMenu)}
        >
          Amis
        </button>
      </div>

      {/* Menu déroulant */}
      {showFriendsMenu && (
        <div className="friends-dropdown">
          <Friends />
        </div>
      )}

      <div className="home-main">

        {/* Zone centrale */}
        <div className="home-center">
          <h1 className="page-title">Accueil</h1>

          <button className="btn-primary" onClick={openFriendPicker}>
            Créer une partie
          </button>

          {/* Popup choix ami */}
          {showFriendPicker && (
            <div className="overlay">
              <div className="popup">
                <h3>Choisir un ami</h3>

                {friends.length === 0 && <p>Aucun ami disponible.</p>}

                <ul className="list">
                  {friends.map((f) => (
                    <li key={f.id}>
                      {f.username}
                      <button
                        className="btn-small"
                        onClick={() => createGameWithFriend(f.id)}
                      >
                        Jouer
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  className="btn-small"
                  onClick={() => setShowFriendPicker(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          <h2 style={{ marginTop: "30px" }}>🎮 Parties en cours</h2>

          {games.length === 0 && <p>Aucune partie en cours.</p>}

          <ul className="list">
            {games.map((g) => (
              <li key={g.id}>
                Partie #{g.id} — {g.status}
                <button
                  className="btn-small"
                  onClick={() => (window.location.href = `/game/${g.id}`)}
                >
                  Jouer
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
