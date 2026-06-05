import { useEffect, useState } from "react";
import HexBoard from "../components/HexBoard";
import Direction from "../components/Direction";

export default function Game() {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null); // null ou tableau

  async function loadBoard() {
    try {
      const token = localStorage.getItem("token");
      const gameId = window.location.pathname.split("/").pop();

      const res = await fetch(`http://localhost:3000/api/games/${gameId}/board`, {
        headers: { Authorization: "Bearer " + token }
      });

      const data = await res.json();
      const parsed = JSON.parse(data.board);

      setBoard(parsed);
    } catch (err) {
      console.error("Erreur loadBoard :", err);
      setBoard([]);
    }
  }

  useEffect(() => {
    loadBoard();
  }, []);

  function handleSelect(key) {
    const clean = key.trim();

    // Première sélection
    if (!selected) {
      setSelected([clean]);
      return;
    }

    // Si déjà 3 billes → reset
    if (selected.length >= 3) {
      setSelected([clean]);
      return;
    }

    // Si déjà sélectionnée → on la retire
    if (selected.includes(clean)) {
      const next = selected.filter(k => k !== clean);
      setSelected(next.length > 0 ? next : null);
      return;
    }

    // Sinon on l'ajoute
    setSelected([...selected, clean]);
  }

  async function handleMove(direction) {
    if (!selected || selected.length === 0) return;

    const token = localStorage.getItem("token");
    const gameId = window.location.pathname.split("/").pop();

    const marbles = selected.map(k => k.split(",").map(Number));

    const res = await fetch(`http://localhost:3000/api/games/${gameId}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        marbles,
        direction
      })
    });

    const data = await res.json();

    if (data.board) {
      setBoard(data.board);
    }

    setSelected(null);
  }

  const hasSelection = Array.isArray(selected) && selected.length > 0;

  return (
    <div style={{ padding: 20 }}>
      {hasSelection && (
        <Direction onMove={handleMove} />
      )}
      <h1>Plateau Abalone</h1>

      <HexBoard
        board={board}
        selectedKey={selected}
        onSelect={handleSelect}
      />

      
    </div>
  );
}
