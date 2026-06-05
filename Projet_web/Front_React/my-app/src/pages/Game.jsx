import { useEffect, useState } from "react";
import HexBoard from "../components/HexBoard";
import Direction from "../components/Direction";

export default function Game() {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);

  async function loadBoard() {
    try {
      const token = localStorage.getItem("token");
      const gameId = window.location.pathname.split("/").pop();

      console.log("[LOAD] GET /board gameId =", gameId);

      const res = await fetch(`http://localhost:3000/api/games/${gameId}/board`, {
        headers: { Authorization: "Bearer " + token }
      });

      const data = await res.json();

      console.log("[LOAD] Réponse backend =", data);

      const parsed = JSON.parse(data.board);

      console.log("[LOAD] Plateau parsé =", parsed);

      setBoard(parsed);
    } catch (err) {
      console.error("[LOAD] Erreur loadBoard :", err);
      setBoard([]);
    }
  }

  useEffect(() => {
    loadBoard();
  }, []);

  function handleSelect(key) {
    console.log("[SELECT] Clic sur =", key);

    const clean = key.trim();

    if (!selected) {
      setSelected([clean]);
      return;
    }

    if (selected.includes(clean)) {
      const next = selected.filter(k => k !== clean);
      setSelected(next.length ? next : null);
      return;
    }

    if (selected.length >= 3) {
      setSelected([clean]);
      return;
    }

    setSelected([...selected, clean]);
  }

  async function handleMove(direction) {
    if (!selected || selected.length === 0) return;

    const token = localStorage.getItem("token");
    const gameId = window.location.pathname.split("/").pop();

    const marbles = selected.map(k => k.split(",").map(Number));

    console.log("[MOVE] Envoi au backend :", { marbles, direction });

    const res = await fetch(`http://localhost:3000/api/moves/${gameId}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ marbles, direction })
    });

    const data = await res.json();

    console.log("[MOVE] Réponse backend =", data);

    if (data.error) {
      console.log("[MOVE] Mouvement refusé :", data.reason);
      alert(data.reason || data.error);
      return;
    }

    if (data.board) {
      const nextBoard = Array.isArray(data.board)
        ? data.board
        : Object.entries(data.board);

      console.log("[MOVE] Mise à jour plateau normalisé =", nextBoard);
      setBoard(nextBoard);
    }

    setSelected(null);
  }

  return (
    <div>
      {selected && <Direction onMove={handleMove} />}

      <HexBoard
        board={board}
        selectedKey={selected}
        onSelect={handleSelect}
      />
    </div>
  );
}
