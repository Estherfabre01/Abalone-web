import db from "../db.js";
import crypto from "crypto";
import { isMoveValid, applyMove } from "../services/abaloneEngine.js";

export function playMove(req, res) {
  const gameId = req.params.id;
  const { from, to } = req.body;

  const lastBoard = db.prepare(`
    SELECT * FROM board_states
    WHERE game_id = ?
    ORDER BY turn_number DESC
    LIMIT 1
  `).get(gameId);

  // Charger la Map correctement
  const boardMap = new Map(JSON.parse(lastBoard.board));

  // Validation
  if (!isMoveValid(boardMap, from, to)) {
    return res.status(400).json({ error: "Invalid move" });
  }

  // Appliquer le mouvement → renvoie une Map
  const newBoardMap = applyMove(boardMap, from, to);

  // Convertir Map → Array pour stockage
  const newBoardArray = [...newBoardMap];

  const newTurn = lastBoard.turn_number + 1;

  db.prepare(`
    INSERT INTO board_states (id, game_id, turn_number, board, current_player)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    gameId,
    newTurn,
    JSON.stringify(newBoardArray),   // ← ICI LA CORRECTION
    req.user.id
  );

  db.prepare(`
    INSERT INTO moves (id, game_id, player_id, from_positions, to_positions)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    gameId,
    req.user.id,
    JSON.stringify(from),
    JSON.stringify(to)
  );

  res.json({ message: "Move played", turn: newTurn });
}


export function listMoves(req, res) {
  const moves = db.prepare(`
    SELECT * FROM moves WHERE game_id = ?
  `).all(req.params.id);

  res.json(moves);
}
