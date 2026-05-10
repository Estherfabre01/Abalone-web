import express from "express";
import db from "../db.js";
import crypto from "crypto";

const router = express.Router();

// GET board state for a game
router.get("/:game_id", (req, res) => {
  const state = db.prepare(`
    SELECT * FROM board_states
    WHERE game_id = ?
    ORDER BY turn_number DESC
    LIMIT 1
  `).get(req.params.game_id);

  res.json(state);
});

// POST update board state
router.post("/", (req, res) => {
  const { game_id, turn_number, board, current_player } = req.body;
  const id = crypto.randomUUID();

  db.prepare(`
    INSERT INTO board_states (id, game_id, turn_number, board, current_player)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, game_id, turn_number, JSON.stringify(board), current_player);

  res.json({ id, game_id, turn_number });
});

export default router;
