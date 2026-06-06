import { useState, useEffect } from "react";
import "../global.css";

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

  async function acceptRequest(id) {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:3000/api/friends/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ request_id: id })
    });

    loadFriends();
  }

  async function rejectRequest(id) {
    const token = localStorage.getItem("token");

    await fetch("http://localhost:3000/api/friends/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ request_id: id })
    });

    loadFriends();
  }

  useEffect(() => {
    loadFriends();
  }, []);

  return (
    <div className="friends-container">

      <h3 className="friends-section-title">👥 Amis</h3>

      <div className="friends-card">
        <h4 className="friends-section-title">Liste d'amis</h4>
        {friends.length === 0 ? (
          <p className="friends-empty">Aucun ami.</p>
        ) : (
          <ul className="friends-list">
            {friends.map((f) => (
              <li key={f.id} className="friends-item">
                {f.username}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="friends-card">
        <h4 className="friends-section-title">Reçues</h4>
        <ul className="friends-list">
          {received.map((r) => (
            <li key={r.id} className="friends-item">
              {r.sender_username}
              <div className="friends-actions">
                <button className="btn-accept" onClick={() => acceptRequest(r.id)}>OK</button>
                <button className="btn-reject" onClick={() => rejectRequest(r.id)}>X</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="friends-card">
        <h4 className="friends-section-title">Envoyées</h4>
        <ul className="friends-list">
          {sent.map((s) => (
            <li key={s.id} className="friends-item">
              {s.receiver_username}
            </li>
          ))}
        </ul>
      </div>

      <div className="friends-card">
        <h4 className="friends-section-title">Ajouter</h4>

        <input
          className="friends-input"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button className="friends-primary-btn" onClick={sendRequest}>
          Envoyer
        </button>

        {message && <pre className="friends-response">{message}</pre>}
      </div>
    </div>
  );
}
