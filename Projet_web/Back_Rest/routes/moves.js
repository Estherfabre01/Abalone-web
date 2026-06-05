import express from "express";
import auth from "../middleware/authMiddleware.js";
import { playMove, listMoves } from "../controllers/moveController.js";

const router = express.Router();

// Jouer un coup
router.post("/:id/move", auth, playMove);

// Historique des coups
router.get("/:id/moves", auth, listMoves);

export default router;
