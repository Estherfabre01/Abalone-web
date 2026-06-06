import { useEffect, useState } from "react";
import HexBoard from "../components/HexBoard";
import Direction from "../components/Direction";

export default function Game() {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);

  const [scoreP1, setScoreP1] = useState(0);
  const [scoreP2, setScoreP2] = useState(0);
  const [player1Id, setPlayer1Id] = useState(null);
  const [player2Id, setPlayer2Id] = useState(null);

  const userId = localStorage.getItem("userId");

  // ============================
  // LOAD GAME
  // ============================
  async function loadGame() {
    try {
      const token = localStorage.getItem("token");
      const gameId = window.location.pathname.split("/").pop();

      const res = await fetch(`http://localhost:3000/api/games/${gameId}`, {
        headers: { Authorization: "Bearer " + token }
      });

      const data = await res.json();

      setBoard(data.board);
      setCurrentPlayer(data.current_player);
      setPlayerColor(data.player_color);

      setScoreP1(data.score_player1);
      setScoreP2(data.score_player2);
      setPlayer1Id(data.player1_id);
      setPlayer2Id(data.player2_id);

    } catch (err) {
      console.error("[LOAD] ERROR loading game:", err);
      setBoard([]);
    }
  }

  useEffect(() => {
    loadGame();
    const interval = setInterval(loadGame, 1500);
    return () => clearInterval(interval);
  }, []);

  // ============================
  // SELECT MARBLE
  // ============================
  function handleSelect(key) {
    const cell = board.find(([k]) => k === key)?.[1];

    if (cell !== playerColor) return;

    const clean = key.trim();

    if (!selected) return setSelected([clean]);

    if (selected.includes(clean)) {
      const next = selected.filter(k => k !== clean);
      return setSelected(next.length ? next : null);
    }

    if (selected.length >= 3) return setSelected([clean]);

    setSelected([...selected, clean]);
  }

  // ============================
  // SEND MOVE
  // ============================
  async function handleMove(direction) {
    if (!selected?.length) return;

    const token = localStorage.getItem("token");
    const gameId = window.location.pathname.split("/").pop();
    const marbles = selected.map(k => k.split(",").map(Number));

    const res = await fetch(`http://localhost:3000/api/moves/${gameId}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ marbles, direction })
    });

    const data = await res.json();

    if (data.error) {
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

      <h3>Score</h3>
      <p>
        Joueur noir ({player1Id}) : {scoreP1}
        <br />
        Joueur blanc ({player2Id}) : {scoreP2}
      </p>

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
