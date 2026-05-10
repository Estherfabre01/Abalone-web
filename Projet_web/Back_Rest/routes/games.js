import express from "express";
import db from "../db.js";
import crypto from "crypto";

const router = express.Router();

// GET all games
router.get("/", (req, res) => {
  const games = db.prepare("SELECT * FROM games").all();
  res.json(games);
});

// POST create game
router.post("/", (req, res) => {
  const { player1_id, player2_id } = req.body;
  const id = crypto.randomUUID();

  db.prepare(`
    INSERT INTO games (id, player1_id, player2_id, status)
    VALUES (?, ?, ?, 'in_progress')
  `).run(id, player1_id, player2_id);

  res.json({ id, player1_id, player2_id, status: "in_progress" });
});

// GET game by id
router.get("/:id", (req, res) => {
  const game = db.prepare("SELECT * FROM games WHERE id = ?").get(req.params.id);
  res.json(game);
});

export default router;
