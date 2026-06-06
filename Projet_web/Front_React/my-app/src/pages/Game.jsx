import { useEffect, useState } from "react";
import HexBoard from "../components/HexBoard";
import Direction from "../components/Direction";

export default function Game() {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);

  const userId = localStorage.getItem("userId");

  // ============================
  // LOAD GAME
  // ============================
  async function loadGame() {
    try {
      const token = localStorage.getItem("token");
      const gameId = window.location.pathname.split("/").pop();

      console.log("%c[LOAD] Fetching game...", "color: cyan");

      const res = await fetch(`http://localhost:3000/api/games/${gameId}`, {
        headers: { Authorization: "Bearer " + token }
      });

      const data = await res.json();
      console.log("%c[LOAD] Backend response:", "color: cyan", data);

      // board est déjà un array
      setBoard(data.board);
      setCurrentPlayer(data.current_player);
      setPlayerColor(data.player_color);

      console.log("%c[LOAD] Parsed board:", "color: cyan", data.board);
      console.log("%c[LOAD] Current player =", "color: yellow", data.current_player);
      console.log("%c[LOAD] Your color =", "color: magenta", data.player_color);

    } catch (err) {
      console.error("[LOAD] ERROR loading game:", err);
      setBoard([]);
    }
  }

  useEffect(() => {
  console.log("%c[INIT] Game component mounted", "color: green");
  loadGame();

  const interval = setInterval(() => {
    loadGame();
  }, 1500);

  return () => clearInterval(interval);
  }, []);

  // ============================
  // SELECT MARBLE
  // ============================
  function handleSelect(key) {
    console.log("%c[SELECT] Click on =", "color: orange", key);

    const cell = board.find(([k]) => k === key)?.[1];
    console.log("[SELECT] Cell content =", cell);
    console.log("[SELECT] Player color =", playerColor);

    // Empêcher de sélectionner les billes ennemies
    if (cell !== playerColor) {
      console.warn("[SELECT] Refus : tu ne joues pas cette couleur");
      return;
    }

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

  // ============================
  // SEND MOVE
  // ============================
  async function handleMove(direction) {
    if (!selected || selected.length === 0) return;

    const token = localStorage.getItem("token");
    const gameId = window.location.pathname.split("/").pop();

    const marbles = selected.map(k => k.split(",").map(Number));

    console.log("%c[MOVE] Sending move...", "color: lightgreen");

    const res = await fetch(`http://localhost:3000/api/moves/${gameId}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ marbles, direction })
    });

    const data = await res.json();
    console.log("%c[MOVE] Backend response:", "color: lightgreen", data);

    if (data.error) {
      console.error("%c[MOVE] ERROR:", "color: red", data.reason);
      alert(data.reason || data.error);
      return;
    }

    if (data.board) {
      const nextBoard = Array.isArray(data.board)
        ? data.board
        : Object.entries(data.board);

      setBoard(nextBoard);
    }

    if (data.current_player) {
      setCurrentPlayer(data.current_player);
    }

    setSelected(null);
  }

  // ============================
  // RENDER
  // ============================
  return (
    <div style={{ padding: 20 }}>
      <h2>Joueur courant : {currentPlayer}</h2>
      <h3>Ta couleur : {playerColor}</h3>

      {selected && currentPlayer === userId && (
        <Direction onMove={handleMove} />
      )}

      <HexBoard
        board={board}
        selectedKey={selected}
        onSelect={handleSelect}
      />
    </div>
  );
}
