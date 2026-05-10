import db from "../db.js";
import crypto from "crypto";
import { getInitialBoard } from "../services/abaloneEngine.js";

export function createGame(req, res) {
  const gameId = crypto.randomUUID();
  const boardId = crypto.randomUUID();

  db.prepare(`
    INSERT INTO games (id, player1_id, status)
    VALUES (?, ?, 'waiting')
  `).run(gameId, req.user.id);

  db.prepare(`
    INSERT INTO board_states (id, game_id, turn_number, board, current_player)
    VALUES (?, ?, 1, ?, ?)
  `).run(boardId, gameId, JSON.stringify(getInitialBoard()), req.user.id);

  res.json({ id: gameId });
}

export function getGame(req, res) {
  const game = db.prepare("SELECT * FROM games WHERE id = ?").get(req.params.id);
  res.json(game);
}

export function joinGame(req, res) {
  db.prepare(`
    UPDATE games
    SET player2_id = ?, status = 'in_progress'
    WHERE id = ? AND player2_id IS NULL
  `).run(req.user.id, req.params.id);

  res.json({ message: "Joined" });
}

export function getBoard(req, res) {
  const board = db.prepare(`
    SELECT * FROM board_states
    WHERE game_id = ?
    ORDER BY turn_number DESC
    LIMIT 1
  `).get(req.params.id);

  res.json(board);
}

export function getBoardAtTurn(req, res) {
  const board = db.prepare(`
    SELECT * FROM board_states
    WHERE game_id = ? AND turn_number = ?
  `).get(req.params.id, req.params.turn);

  res.json(board);
}
