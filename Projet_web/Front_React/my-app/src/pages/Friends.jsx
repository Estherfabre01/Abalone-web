import { useState, useEffect } from "react";

export default function Friends() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [friends, setFriends] = useState([]);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);

  async function loadFriends() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/friends", {
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();

    setFriends(data.friends || []);
    setReceived(data.received_requests || []);
    setSent(data.sent_requests || []);
  }

  async function sendRequest() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/friends/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ username })
    });

    const data = await res.json();
    setMessage(JSON.stringify(data, null, 2));
    loadFriends();
  }

  async function acceptRequest(requestId) {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:3000/api/friends/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ request_id: requestId })
    });

    loadFriends();
  }

  async function rejectRequest(requestId) {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:3000/api/friends/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ request_id: requestId })
    });

    loadFriends();
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

      <h3>📥 Demandes reçues</h3>
      <ul>
        {received.map((r) => (
          <li key={r.id} style={{ marginBottom: 10 }}>
            {r.sender_username}

            <button
              style={{ marginLeft: 10, padding: "4px 8px" }}
              onClick={() => acceptRequest(r.id)}
            >
              Accepter
            </button>

            <button
              style={{
                marginLeft: 10,
                padding: "4px 8px",
                background: "#e74c3c",
                color: "white"
              }}
              onClick={() => rejectRequest(r.id)}
            >
              Refuser
            </button>
          </li>
        ))}
      </ul>

      <h3>📤 Demandes envoyées</h3>
      <ul>
        {sent.map((s) => (
          <li key={s.id}>{s.receiver_username}</li>
        ))}
      </ul>

      <hr style={{ margin: "20px 0" }} />

      <h3>Ajouter un ami</h3>

      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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
