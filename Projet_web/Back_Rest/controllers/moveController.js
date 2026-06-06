import db from "../db.js";
import crypto from "crypto";
import { isMoveValid, applyMove } from "../services/abaloneEngine.js";

export function playMove(req, res) {
  const gameId = req.params.id;
  const { marbles, direction } = req.body;

  // 0) Charger la partie
  const game = db.prepare(`
    SELECT *
    FROM games
    WHERE id = ?
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

  // 1) Charger le plateau depuis games.board
  const boardArray = JSON.parse(game.board);
  const boardMap = new Map(boardArray);

  // 2) Validation du mouvement
  const validation = isMoveValid(boardMap, { marbles, direction });

  if (!validation.valid) {
    return res.status(400).json({
      error: "Invalid move",
      reason: validation.reason
    });
  }

  // 3) Appliquer le mouvement
  const newBoardMap = applyMove(boardMap, { marbles, direction });

  // 4) Convertir Map → Array
  const newBoardArray = [...newBoardMap];

  // 5) Mise à jour du score si poussée hors plateau
  if (validation.reason === "Poussée hors plateau") {

    const isPlayer1 = game.current_player === game.player1_id;

    db.prepare(`
      UPDATE game_score
      SET 
        score_player1 = score_player1 + ?,
        score_player2 = score_player2 + ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE game_id = ?
    `).run(
      isPlayer1 ? 1 : 0,
      isPlayer1 ? 0 : 1,
      gameId
    );
  }

  // 6) Calcul du prochain joueur
  const nextPlayer =
    game.current_player === game.player1_id
      ? game.player2_id
      : game.player1_id;

  // 7) Sauvegarder dans games
  db.prepare(`
    UPDATE games
    SET board = ?, current_player = ?, turn_number = turn_number + 1
    WHERE id = ?
  `).run(
    JSON.stringify(newBoardArray),
    nextPlayer,
    gameId
  );

  // 8) Sauvegarder le coup (moves)
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

  // 9) Réponse au frontend
  res.json({
    message: "Move played",
    board: Object.fromEntries(newBoardMap),
    current_player: nextPlayer,
    turn: game.turn_number + 1,
    reason: validation.reason
  });
}




export function listMoves(req, res) {
  const moves = db.prepare(`
    SELECT * FROM moves WHERE game_id = ?
  `).all(req.params.id);

  res.json(moves);
}