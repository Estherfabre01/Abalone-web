import { useState, useEffect } from "react";
import "../global.css";

const IconDot = () => (
  <svg width="10" height="10" style={{ marginRight: 8 }}>
    <circle cx="5" cy="5" r="5" fill="#111" />
  </svg>
);

export default function Friends() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [friends, setFriends] = useState([]);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);

  const [openSection, setOpenSection] = useState(null);

  function toggle(section) {
    setOpenSection(openSection === section ? null : section);
  }

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

      {/* === AMIS === */}
      <div className="friends-accordion">
        <button className="friends-accordion-btn" onClick={() => toggle("friends")}>
          Amis ({friends.length})
        </button>

        {openSection === "friends" && (
          <div className="friends-accordion-content">
            {friends.length === 0 ? (
              <p className="friends-empty">Aucun ami.</p>
            ) : (
              <ul className="friends-list">
                {friends.map((f) => (
                  <li key={f.id} className="friends-item">
                    <IconDot />
                    <span className="friends-name">{f.username}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* === REÇUES === */}
      <div className="friends-accordion">
        <button className="friends-accordion-btn" onClick={() => toggle("received")}>
          Demandes reçues ({received.length})
        </button>

        {openSection === "received" && (
          <div className="friends-accordion-content">
            {received.length === 0 ? (
              <p className="friends-empty">Aucune demande reçue.</p>
            ) : (
              <ul className="friends-list">
                {received.map((r) => (
                  <li key={r.id} className="friends-item">
                    <IconDot />
                    <span className="friends-name">{r.sender_username}</span>
                    <div className="friends-actions">
                      <button className="btn-accept" onClick={() => acceptRequest(r.id)}>OK</button>
                      <button className="btn-reject" onClick={() => rejectRequest(r.id)}>X</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* === ENVOYÉES === */}
      <div className="friends-accordion">
        <button className="friends-accordion-btn" onClick={() => toggle("sent")}>
          Demandes envoyées ({sent.length})
        </button>

        {openSection === "sent" && (
          <div className="friends-accordion-content">
            {sent.length === 0 ? (
              <p className="friends-empty">Aucune demande envoyée.</p>
            ) : (
              <ul className="friends-list">
                {sent.map((s) => (
                  <li key={s.id} className="friends-item">
                    <IconDot />
                    <span className="friends-name">{s.receiver_username}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* === AJOUTER === */}
      <div className="friends-accordion">
        <button className="friends-accordion-btn" onClick={() => toggle("add")}>
          Ajouter un ami
        </button>

        {openSection === "add" && (
          <div className="friends-accordion-content">
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
        )}
      </div>

    </div>
  );
}
