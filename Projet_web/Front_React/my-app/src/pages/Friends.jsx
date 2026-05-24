import { useState, useEffect } from "react";

export default function Friends() {
  const [friendId, setFriendId] = useState("");
  const [message, setMessage] = useState("");
  const [friends, setFriends] = useState([]);

  async function loadFriends() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/friends", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();
    setFriends(data.friends || []);
  }

  async function sendRequest() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/friends/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ receiver_id: friendId })
    });

    const data = await res.json();
    setMessage(JSON.stringify(data, null, 2));

    loadFriends(); // rafraîchir la liste
  }

  useEffect(() => {
    loadFriends();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>👥 Amis</h2>

      {friends.length === 0 && <p>Aucun ami pour le moment.</p>}

      <ul>
        {friends.map((f) => (
          <li key={f.id}>
            {f.username} ({f.email})
          </li>
        ))}
      </ul>

      <hr style={{ margin: "20px 0" }} />

      <h3>Ajouter un ami</h3>

      <input
        type="text"
        placeholder="ID de l'utilisateur"
        value={friendId}
        onChange={(e) => setFriendId(e.target.value)}
        style={{ padding: 10, width: "100%" }}
      />

      <button
        onClick={sendRequest}
        style={{ marginTop: 10, padding: 10, width: "100%" }}
      >
        Envoyer une demande d’ami
      </button>

      {message && (
        <pre style={{ marginTop: 20, background: "#eee", padding: 10 }}>
          {message}
        </pre>
      )}
    </div>
  );
}
