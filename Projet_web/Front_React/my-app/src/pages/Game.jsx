import { useEffect, useState } from "react";
import HexBoard from "../components/HexBoard";

export default function Game() {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);

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
    console.log("handleSelect → key =", key);
    setSelected(key.trim());
  }

  async function handleMove(direction) {
    if (!selected) return;

    const token = localStorage.getItem("token");
    const gameId = window.location.pathname.split("/").pop();

    const [q, r] = selected.split(",").map(Number);

    const res = await fetch(`http://localhost:3000/api/games/${gameId}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        marbles: [[q, r]],
        direction
      })
    });

    const data = await res.json();

    if (data.board) {
      setBoard(data.board);
    }

    setSelected(null);
  }

  console.log("Game.jsx → selected =", selected);

  return (
    <div style={{ padding: 20 }}>
      <h1>Plateau Abalone</h1>

      <HexBoard
        board={board}
        selectedKey={selected}
        onSelect={handleSelect}
      />

      {selected && (
        <div style={{ marginTop: 20 }}>
          <h3>Déplacer la bille :</h3>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => handleMove("NW")}>NW</button>
            <button onClick={() => handleMove("NE")}>NE</button>
            <button onClick={() => handleMove("E")}>E</button>
            <button onClick={() => handleMove("SE")}>SE</button>
            <button onClick={() => handleMove("SW")}>SW</button>
            <button onClick={() => handleMove("W")}>W</button>
          </div>
        </div>
      )}
    </div>
  );
}
