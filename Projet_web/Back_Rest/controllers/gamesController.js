import db from "../db.js";
import crypto from "crypto";
import { getInitialBoard } from "../services/abaloneEngine.js";

/**
 * Créer une partie avec un ami
 * player1 = utilisateur connecté
 * player2 = ami choisi
 */
export function createGame(req, res) {
  const { opponent_id } = req.body;

  if (!opponent_id) {
    return res.status(400).json({ error: "opponent_id manquant" });
  }

  const gameId = crypto.randomUUID();
  const boardId = crypto.randomUUID();

  // Création de la partie
  db.prepare(`
    INSERT INTO games (id, player1_id, player2_id, status)
    VALUES (?, ?, ?, 'in_progress')
  `).run(gameId, req.user.id, opponent_id);

  // État initial du plateau
  db.prepare(`
    INSERT INTO board_states (id, game_id, turn_number, board, current_player)
    VALUES (?, ?, 1, ?, ?)
  `).run(boardId, gameId, JSON.stringify(getInitialBoard()), req.user.id);

  res.json({ id: gameId });
}

/**
 * Récupérer une partie par ID
 */
export function getGame(req, res) {
  const game = db
    .prepare("SELECT * FROM games WHERE id = ?")
    .get(req.params.id);

  res.json(game);
}

/**
 * Rejoindre une partie (utile si tu veux garder la logique d'avant)
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
 * Récupérer la liste des parties du joueur
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
