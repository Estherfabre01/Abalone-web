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
  const scoreId = crypto.randomUUID();

  // Plateau initial (Map → Array)
  const initialBoard = Array.from(getInitialBoard());

  // Création de la partie
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
    req.user.id,
    JSON.stringify(initialBoard)
  );

  // Création du score associé
  db.prepare(`
    INSERT INTO game_score (
      id,
      game_id,
      score_player1,
      score_player2
    )
    VALUES (?, ?, 0, 0)
  `).run(scoreId, gameId);

  res.json({ id: gameId });
}





/**
 * Récupérer une partie par ID
 */
export function getGame(req, res) {
  const gameId = req.params.id;

  // 1) Charger la partie
  const game = db.prepare(`
    SELECT 
      id,
      player1_id,
      player2_id,
      current_player,
      turn_number,
      board,
      status
    FROM games
    WHERE id = ?
  `).get(gameId);

  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  // 2) Charger le score
  const score = db.prepare(`
    SELECT 
      score_player1,
      score_player2
    FROM game_score
    WHERE game_id = ?
  `).get(gameId);

  // 3) Charger les noms des joueurs
  const p1 = db.prepare(`SELECT username FROM users WHERE id = ?`).get(game.player1_id);
  const p2 = db.prepare(`SELECT username FROM users WHERE id = ?`).get(game.player2_id);

  const player1Name = p1?.username || "Joueur 1";
  const player2Name = p2?.username || "Joueur 2";

  // 4) Déterminer la couleur du joueur connecté
  const userId = req.user.id;
  let playerColor = null;

  if (userId === game.player1_id) playerColor = "B"; // Noir
  if (userId === game.player2_id) playerColor = "W"; // Blanc

  // 5) Réponse structurée
  res.json({
    id: game.id,
    board: JSON.parse(game.board),
    current_player: game.current_player,
    player_color: playerColor,
    turn_number: game.turn_number,
    status: game.status,

    // joueurs
    player1_id: game.player1_id,
    player2_id: game.player2_id,
    player1_name: player1Name,
    player2_name: player2Name,

    // score
    score_player1: score?.score_player1 ?? 0,
    score_player2: score?.score_player2 ?? 0
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


