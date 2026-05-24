import db from "../db.js";
import crypto from "crypto";
const id = crypto.randomUUID();

export function sendFriendRequest(req, res) {
  const userId = req.user.id; // vient du token
  const { friend_id } = req.body;

  if (!friend_id) {
    return res.status(400).json({ error: "friend_id manquant" });
  }

  if (friend_id === userId) {
    return res.status(400).json({ error: "Impossible de s'ajouter soi-même" });
  }

  // Vérifier si une demande existe déjà
  const existing = db
    .prepare("SELECT * FROM friends WHERE user_id = ? AND friend_id = ?")
    .get(userId, friend_id);

  if (existing) {
    return res.status(400).json({ error: "Demande déjà envoyée" });
  }

  const id = uuid();

  db.prepare(
    "INSERT INTO friends (id, user_id, friend_id, status) VALUES (?, ?, ?, ?)"
  ).run(id, userId, friend_id, "pending");

  res.json({ success: true, request_id: id });
}
