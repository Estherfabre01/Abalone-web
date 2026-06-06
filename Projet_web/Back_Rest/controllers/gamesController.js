import db from "../db.js";
import crypto from "crypto";
import { getInitialBoard } from "../services/abaloneBoard.js";
import { applyMove } from "../services/abaloneEngine.js";

/**
 * Créer une partie avec un ami
 */
export function createGame(req, res) {
  const { opponent_id } = req.body;

  if (!opponent_id) {
    return res.status(400).json({ error: "opponent_id manquant" });
  }

  const gameId = crypto.randomUUID();

  // Plateau initial (Map → Array)
  const initialBoard = Array.from(getInitialBoard());

  db.prepare(`
    INSERT INTO games (
      id,
      player1_id,
      player2_id,
      status,
      current_player,
      turn_number,
      board
    )
    VALUES (?, ?, ?, 'in_progress', ?, 1, ?)
  `).run(
    gameId,
    req.user.id,
    opponent_id,
    req.user.id,                     // player1 commence
    JSON.stringify(initialBoard)     // board valide
  );

  res.json({ id: gameId });
}




/**
 * Récupérer une partie par ID
 */
export function getGame(req, res) {
  const gameId = req.params.id;

  // Charger la partie
  const game = db.prepare(`
    SELECT id, player1_id, player2_id, status, current_player, turn_number, board
    FROM games
    WHERE id = ?
  `).get(gameId);

  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  // Parser le plateau (toujours un JSON valide)
  let parsedBoard;
  try {
    parsedBoard = JSON.parse(game.board);
  } catch (err) {
    return res.status(500).json({ error: "Invalid board format" });
  }

  // Déterminer la couleur du joueur connecté
  const playerColor =
    req.user.id === game.player1_id ? "B" : "W";

  // Réponse complète
  res.json({
    id: game.id,
    player1_id: game.player1_id,
    player2_id: game.player2_id,
    status: game.status,
    current_player: game.current_player,
    turn_number: game.turn_number,
    board: parsedBoard,
    player_color: playerColor
  });
}



/**
 * Rejoindre une partie
 */
export function joinGame(req, res) {
  db.prepare(`
    UPDATE games
    SET player2_id = ?, status = 'in_progress'
    WHERE id = ? AND player2_id IS NULL
  `).run(req.user.id, req.params.id);

  res.json({ message: "Joined" });
}

/**
 * Lister les parties du joueur
 */
export function getAllGames(req, res) {
  const games = db.prepare(`
    SELECT *
    FROM games
    WHERE player1_id = ? OR player2_id = ?
    ORDER BY rowid DESC
  `).all(req.user.id, req.user.id);

  res.json(games);
}

/**
 * Récupérer le plateau actuel
 */
export function getBoard(req, res) {
  const board = db.prepare(`
    SELECT *
    FROM board_states
    WHERE game_id = ?
    ORDER BY turn_number DESC
    LIMIT 1
  `).get(req.params.id);

  res.json(board);
}

/**
 * Récupérer le plateau à un tour donné
 */
export function getBoardAtTurn(req, res) {
  const board = db.prepare(`
    SELECT *
    FROM board_states
    WHERE game_id = ? AND turn_number = ?
  `).get(req.params.id, req.params.turn);

  res.json(board);
}


