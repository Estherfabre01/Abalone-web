import express from "express";
import db from "../db.js";
import crypto from "crypto";

const router = express.Router();

// GET board state for a game
router.get("/:game_id", (req, res) => {
  const gameId = req.params.game_id;

  // Récupérer le joueur courant
  const game = db.prepare(`
    SELECT current_player FROM games WHERE id = ?
  `).get(gameId);

  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  // Récupérer le dernier plateau
  const state = db.prepare(`
    SELECT board, turn_number
    FROM board_states
    WHERE game_id = ?
    ORDER BY turn_number DESC
    LIMIT 1
  `).get(gameId);

  if (!state) {
    return res.status(404).json({ error: "Board not found" });
  }

  res.json({
    board: state.board,
    turn_number: state.turn_number,
    current_player: game.current_player
  });
});

// POST update board state
router.post("/", (req, res) => {
  const { game_id, turn_number, board } = req.body;
  const id = crypto.randomUUID();

  db.prepare(`
    INSERT INTO board_states (id, game_id, turn_number, board)
    VALUES (?, ?, ?, ?)
  `).run(id, game_id, turn_number, JSON.stringify(board));

  res.json({ id, game_id, turn_number });
});

export default router;
