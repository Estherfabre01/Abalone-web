import db from "../db.js";
import crypto from "crypto";
import { isMoveValid, applyMove } from "../services/abaloneEngine.js";

export function playMove(req, res) {
  const gameId = req.params.id;
  const { marbles, direction } = req.body;

  // 0) Récupérer la partie
  const game = db.prepare(`
    SELECT * FROM games WHERE id = ?
  `).get(gameId);

  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  // Vérifier que c'est bien le tour du joueur
  if (game.current_player !== req.user.id) {
    return res.status(403).json({
      error: "Not your turn",
      reason: "C'est au tour de l'autre joueur"
    });
  }

  // 1) Récupérer le dernier état du plateau
  const lastBoard = db.prepare(`
    SELECT * FROM board_states
    WHERE game_id = ?
    ORDER BY turn_number DESC
    LIMIT 1
  `).get(gameId);

  if (!lastBoard) {
    return res.status(404).json({ error: "Board not found" });
  }

  // 2) Charger la Map
  const boardMap = new Map(JSON.parse(lastBoard.board));

  // 3) Validation du mouvement
  const validation = isMoveValid(boardMap, { marbles, direction });

  if (!validation.valid) {
    return res.status(400).json({
      error: "Invalid move",
      reason: validation.reason
    });
  }

  // 4) Appliquer le mouvement
  const newBoardMap = applyMove(boardMap, { marbles, direction });

  // 5) Convertir Map → Array pour stockage
  const newBoardArray = [...newBoardMap];
  const newTurn = lastBoard.turn_number + 1;

  // 6) Sauvegarder le nouvel état du plateau
  db.prepare(`
    INSERT INTO board_states (id, game_id, turn_number, board)
    VALUES (?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    gameId,
    newTurn,
    JSON.stringify(newBoardArray)
  );

  // 7) Sauvegarder le coup joué
  db.prepare(`
    INSERT INTO moves (id, game_id, player_id, from_positions, to_positions)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    crypto.randomUUID(),
    gameId,
    req.user.id,
    JSON.stringify(marbles),
    JSON.stringify(direction)
  );

  // 8) Calcul du prochain joueur
  const nextPlayer =
    game.current_player === game.player1_id
      ? game.player2_id
      : game.player1_id;

  db.prepare(`
    UPDATE games SET current_player = ? WHERE id = ?
  `).run(nextPlayer, gameId);

  // 9) Réponse au frontend
  res.json({
    message: "Move played",
    turn: newTurn,
    board: Object.fromEntries(newBoardMap),
    current_player: nextPlayer,
    reason: validation.reason
  });
}


export function listMoves(req, res) {
  const moves = db.prepare(`
    SELECT * FROM moves WHERE game_id = ?
  `).all(req.params.id);

  res.json(moves);
}