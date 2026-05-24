import { useEffect, useState } from "react";
import HexBoard from "../components/HexBoard";

export default function Game() {
  const [board, setBoard] = useState([]);

  async function loadBoard() {
  try {
    const token = localStorage.getItem("token");
    const gameId = window.location.pathname.split("/").pop();

    const res = await fetch(`http://localhost:3000/api/games/${gameId}/board`, {
      headers: { Authorization: "Bearer " + token }
    });

    const data = await res.json();

    // 🔍 LOG IMPORTANT
    console.log("RAW BOARD FROM BACKEND:", data.board);

    let raw = data.board;

    if (!raw) {
      setBoard([]);
      return;
    }

    if (Array.isArray(raw)) {
      setBoard(raw.filter(Boolean));
      return;
    }

    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        setBoard(Array.isArray(parsed) ? parsed.filter(Boolean) : []);
      } catch {
        setBoard([]);
      }
      return;
    }

    setBoard([]);

  } catch (err) {
    console.error("Erreur loadBoard :", err);
    setBoard([]);
  }
}

  useEffect(() => {
    loadBoard();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Plateau Abalone</h1>
      <HexBoard board={board} />
    </div>
  );
}
