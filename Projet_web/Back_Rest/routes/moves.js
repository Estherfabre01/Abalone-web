import express from "express";
import db from "../db.js";
import crypto from "crypto";

const router = express.Router();

// POST play move
router.post("/", (req, res) => {
  const { game_id, player_id, from_positions, to_positions, pushed } = req.body;
  const id = crypto.randomUUID();

  db.prepare(`
    INSERT INTO moves (id, game_id, player_id, from_positions, to_positions, pushed)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    id,
    game_id,
    player_id,
    JSON.stringify(from_positions),
    JSON.stringify(to_positions),
    JSON.stringify(pushed)
  );

  res.json({ id, game_id, player_id });
});

// GET moves for a game
router.get("/:game_id", (req, res) => {
  const moves = db.prepare("SELECT * FROM moves WHERE game_id = ?")
    .all(req.params.game_id);
  res.json(moves);
});

export default router;
