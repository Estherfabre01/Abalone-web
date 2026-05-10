import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  createGame,
  getGame,
  joinGame,
  getBoard,
  getBoardAtTurn
} from "../controllers/gameController.js";

const router = express.Router();

router.post("/", auth, createGame);
router.get("/:id", auth, getGame);
router.patch("/:id/join", auth, joinGame);
router.get("/:id/board", auth, getBoard);
router.get("/:id/board/:turn", auth, getBoardAtTurn);

export default router;
