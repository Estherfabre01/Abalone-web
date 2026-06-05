import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createGame,
  getGame,
  joinGame,
  getBoard,
  getBoardAtTurn,
  getAllGames
} from "../controllers/gamesController.js";

const router = express.Router();

// ➜ LISTER TOUTES LES PARTIES DU JOUEUR
router.get("/", authMiddleware, getAllGames);

// ➜ CRÉER UNE PARTIE AVEC UN AMI
router.post("/create", authMiddleware, createGame);

// ➜ RÉCUPÉRER UNE PARTIE
router.get("/:id", authMiddleware, getGame);

// ➜ REJOINDRE UNE PARTIE (optionnel)
router.post("/:id/join", authMiddleware, joinGame);

// ➜ RÉCUPÉRER LE PLATEAU ACTUEL
router.get("/:id/board", authMiddleware, getBoard);

// ➜ RÉCUPÉRER LE PLATEAU À UN TOUR DONNÉ
router.get("/:id/board/:turn", authMiddleware, getBoardAtTurn);
export default router;
