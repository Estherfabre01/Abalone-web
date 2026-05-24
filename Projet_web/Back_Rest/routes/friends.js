import express from "express";
import { sendFriendRequest, getFriends, acceptFriendRequest, rejectFriendRequest } from "../controllers/friendsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request", authMiddleware, sendFriendRequest);
router.get("/", authMiddleware, getFriends);
router.post("/accept", authMiddleware, acceptFriendRequest);
router.post("/reject", authMiddleware, rejectFriendRequest);

export default router;
