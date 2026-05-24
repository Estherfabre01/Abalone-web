import { useState } from "react";

export default function Friends() {
  const [friendId, setFriendId] = useState("");
  const [message, setMessage] = useState("");

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
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Gestion des amis</h1>

      <input
        type="text"
        placeholder="ID de l'utilisateur"
        value={friendId}
        onChange={(e) => setFriendId(e.target.value)}
        style={{ padding: 10, width: 300 }}
      />

      <button onClick={sendRequest} style={{ marginLeft: 10, padding: 10 }}>
        Envoyer une demande d’ami
      </button>

      <pre style={{ marginTop: 20, background: "#eee", padding: 10 }}>
        {message}
      </pre>
    </div>
  );
}
