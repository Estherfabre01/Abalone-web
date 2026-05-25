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
    <div style={styles.container}>
      <h2 style={styles.title}>👥 Amis</h2>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Liste d'amis</h3>
        {friends.length === 0 ? (
          <p style={styles.empty}>Aucun ami pour le moment.</p>
        ) : (
          <ul style={styles.list}>
            {friends.map((f) => (
              <li key={f.id} style={styles.listItem}>
                <strong>{f.username}</strong>
                <span style={styles.email}>{f.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>📥 Demandes reçues</h3>
        <ul style={styles.list}>
          {received.map((r) => (
            <li key={r.id} style={styles.listItem}>
              <strong>{r.sender_username}</strong>

              <div style={styles.actions}>
                <button style={styles.acceptBtn} onClick={() => acceptRequest(r.id)}>
                  Accepter
                </button>

                <button style={styles.rejectBtn} onClick={() => rejectRequest(r.id)}>
                  Refuser
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>📤 Demandes envoyées</h3>
        <ul style={styles.list}>
          {sent.map((s) => (
            <li key={s.id} style={styles.listItem}>
              {s.receiver_username}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Ajouter un ami</h3>

        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <button onClick={sendRequest} style={styles.primaryBtn}>
          Envoyer une demande d’ami
        </button>

        {message && (
          <pre style={styles.responseBox}>{message}</pre>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    maxWidth: 600,
    margin: "0 auto",
    fontFamily: "Arial, sans-serif"
  },
  title: {
    textAlign: "center",
    marginBottom: 20
  },
  card: {
    background: "white",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: 20
  },
  sectionTitle: {
    marginBottom: 10
  },
  list: {
    listStyle: "none",
    padding: 0
  },
  listItem: {
    padding: "10px 0",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  email: {
    color: "#777",
    marginLeft: 10
  },
  empty: {
    color: "#888",
    fontStyle: "italic"
  },
  actions: {
    display: "flex",
    gap: 10
  },
  acceptBtn: {
    padding: "6px 12px",
    background: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  rejectBtn: {
    padding: "6px 12px",
    background: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  input: {
    padding: 10,
    width: "100%",
    borderRadius: 6,
    border: "1px solid #ccc",
    marginBottom: 10
  },
  primaryBtn: {
    padding: 10,
    width: "100%",
    background: "#3498db",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold"
  },
  responseBox: {
    marginTop: 15,
    background: "#f4f4f4",
    padding: 10,
    borderRadius: 6,
    fontSize: 14
  }
};
