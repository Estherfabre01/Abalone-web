import express from "express";
import auth from "../middleware/authMiddleware.js";
import { playMove, listMoves } from "../controllers/moveController.js";

const router = express.Router();

router.post("/:id/moves", auth, playMove);
router.get("/:id/moves", auth, listMoves);

export default router;
