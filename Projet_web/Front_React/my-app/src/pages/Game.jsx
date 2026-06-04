import { useEffect, useState } from "react";
import HexBoard from "../components/HexBoard";

export default function Game() {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);

  async function loadBoard() {
    const token = localStorage.getItem("token");
    const gameId = window.location.pathname.split("/").pop();

    const res = await fetch(`http://localhost:3000/api/games/${gameId}/board`, {
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();
    const raw = JSON.parse(data.board);
    setBoard(raw);
  }

  useEffect(() => {
    loadBoard();
  }, []);

  function handleSelect(key) {
    setSelected(key);
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
    setBoard(data.board);
    setSelected(null);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Plateau Abalone</h1>

      <HexBoard board={board} onSelect={handleSelect} />

      {selected && (
        <div style={{ marginTop: 20 }}>
          <h3>Bouger la bille :</h3>

          <button onClick={() => handleMove("N")}>⬆️ Nord</button>
          <button onClick={() => handleMove("NE")}>↗️ NE</button>
          <button onClick={() => handleMove("SE")}>↘️ SE</button>
          <button onClick={() => handleMove("S")}>⬇️ Sud</button>
          <button onClick={() => handleMove("SW")}>↙️ SW</button>
          <button onClick={() => handleMove("NW")}>↖️ NW</button>
        </div>
      )}
    </div>
  );
}
