import { useEffect, useState } from "react";
import Header from "../components/Header";
import HexBoard from "../components/HexBoard";
import Direction from "../components/Direction";
import "../global.css";

export default function Game() {
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState(null);

  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);

  const [scoreP1, setScoreP1] = useState(0);
  const [scoreP2, setScoreP2] = useState(0);

  const [player1Id, setPlayer1Id] = useState(null);
  const [player2Id, setPlayer2Id] = useState(null);

  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");

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

      setPlayer1Name(data.player1_name || "Joueur 1");
      setPlayer2Name(data.player2_name || "Joueur 2");

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

  const isYourTurn = currentPlayer === userId;
  const currentPlayerName =
    currentPlayer === player1Id ? player1Name : player2Name;

  // ============================
  // RENDER
  // ============================
  return (
    <div className="game-container">

      {/* HEADER GLOBAL */}
      <Header />

      {/* HEADER DE PARTIE */}
      <div className="game-header">

        <div className="game-header-left">
          <div
            className={`turn-indicator ${
              isYourTurn ? "turn-green" : "turn-red"
            }`}
          />

          <div>
            <h2 className="game-header-title">
              {isYourTurn ? "À toi de jouer" : `Tour de ${currentPlayerName}`}
            </h2>
            <p className="game-header-sub">Ta couleur : {playerColor}</p>
          </div>
        </div>

        <div className="game-score-box">
          <div className="game-score-item">
            <strong>{player1Name} (Noir)</strong>
            <span>{scoreP1}</span>
          </div>

          <div className="game-score-item">
            <strong>{player2Name} (Blanc)</strong>
            <span>{scoreP2}</span>
          </div>
        </div>

      </div>

      {/* CENTRE : DIRECTIONS + PLATEAU */}
      <div className="game-center">

        <Direction
          onMove={handleMove}
          disabled={!isYourTurn || !selected}
        />

        <HexBoard
          board={board}
          selectedKey={selected}
          onSelect={handleSelect}
        />

      </div>
    </div>
  );
}
