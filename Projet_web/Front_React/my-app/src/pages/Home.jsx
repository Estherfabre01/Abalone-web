import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);

  async function loadFriends() {
    const token = localStorage.getItem("token");

    if (!token) {
      setData({ error: "Tu dois être connecté pour voir tes amis." });
      return;
    }

    const res = await fetch("http://localhost:3000/api/friends", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const json = await res.json();
    setData(json);
  }

  useEffect(() => {
    loadFriends();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Accueil</h1>

      {!data && <p>Chargement...</p>}

      {data?.error && <p style={{ color: "red" }}>{data.error}</p>}

      {data && !data.error && (
        <div>
          <h2>👥 Mes amis</h2>
          {data.friends.length === 0 && <p>Aucun ami pour le moment.</p>}
          <ul>
            {data.friends.map((f) => (
              <li key={f.id}>
                {f.username} ({f.email})
              </li>
            ))}
          </ul>

          <h2>📥 Demandes reçues</h2>
          {data.received_requests.length === 0 && <p>Aucune demande reçue.</p>}
          <ul>
            {data.received_requests.map((r) => (
              <li key={r.id}>
                {r.sender_username} t’a envoyé une demande.
              </li>
            ))}
          </ul>

          <h2>📤 Demandes envoyées</h2>
          {data.sent_requests.length === 0 && <p>Aucune demande envoyée.</p>}
          <ul>
            {data.sent_requests.map((s) => (
              <li key={s.id}>
                Demande envoyée à {s.receiver_username}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
