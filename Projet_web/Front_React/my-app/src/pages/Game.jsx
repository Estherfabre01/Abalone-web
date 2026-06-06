import { useEffect, useState } from "react";
import HexBoard from "../components/HexBoard";
import Direction from "../components/Direction";

export default function Game() {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const userId = localStorage.getItem("userId");

  // ============================
  // LOAD BOARD
  // ============================
  async function loadBoard() {
    try {
      const token = localStorage.getItem("token");
      const gameId = window.location.pathname.split("/").pop();

      console.log("%c[LOAD] Fetching board...", "color: cyan");
      console.log("[LOAD] gameId =", gameId);

      const res = await fetch(`http://localhost:3000/api/games/${gameId}`, {
        headers: { Authorization: "Bearer " + token }
      });

      const data = await res.json();

      console.log("%c[LOAD] Backend response:", "color: cyan", data);

      const parsed = Array.isArray(data.board)
      ? data.board
      : JSON.parse(data.board);

      setBoard(parsed);
      setCurrentPlayer(data.current_player);

      console.log("%c[LOAD] Parsed board:", "color: cyan", parsed);
      console.log("%c[LOAD] Current player =", "color: yellow", data.current_player);

      setBoard(parsed);
      setCurrentPlayer(data.current_player);
    } catch (err) {
      console.error("[LOAD] ERROR loading board:", err);
      setBoard([]);
    }
  }

  useEffect(() => {
    console.log("%c[INIT] Game component mounted", "color: green");
    loadBoard();
  }, []);

  // ============================
  // SELECT MARBLE
  // ============================
  function handleSelect(key) {
    console.log("%c[SELECT] Click on =", "color: orange", key);

    const cell = board.find(([k]) => k === key)?.[1];
    console.log("[SELECT] Cell content =", cell);
    console.log("[SELECT] Current player =", currentPlayer, "User =", userId);

    // Empêcher de sélectionner les billes ennemies
    if (cell === "B" && currentPlayer !== userId) {
      console.warn("[SELECT] Refus : tu ne peux pas jouer les billes B");
      return;
    }
    if (cell === "W" && currentPlayer !== userId) {
      console.warn("[SELECT] Refus : tu ne peux pas jouer les billes W");
      return;
    }

    const clean = key.trim();

    if (!selected) {
      console.log("[SELECT] Première sélection =", clean);
      setSelected([clean]);
      return;
    }

    if (selected.includes(clean)) {
      console.log("[SELECT] Deselection de", clean);
      const next = selected.filter(k => k !== clean);
      setSelected(next.length ? next : null);
      return;
    }

    if (selected.length >= 3) {
      console.log("[SELECT] Reset sélection → nouvelle =", clean);
      setSelected([clean]);
      return;
    }

    console.log("[SELECT] Ajout à la sélection =", clean);
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
    console.log("[MOVE] Marbles =", marbles);
    console.log("[MOVE] Direction =", direction);

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

      console.log("%c[MOVE] Updated board:", "color: lightgreen", nextBoard);
      setBoard(nextBoard);
    }

    if (data.current_player) {
      console.log("%c[MOVE] Next player =", "color: yellow", data.current_player);
      setCurrentPlayer(data.current_player);
    }

    console.log("%c[MOVE] Reset selection", "color: gray");
    setSelected(null);
  }

  // ============================
  // RENDER
  // ============================
  return (
    <div style={{ padding: 20 }}>
      <h2>Joueur courant : {currentPlayer}</h2>

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
