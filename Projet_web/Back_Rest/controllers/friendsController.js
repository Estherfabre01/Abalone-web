import { v4 as uuid } from "uuid";
import db from "../db.js";

export function sendFriendRequest(req, res) {
  try {
    const senderId = req.user.id;
    const { receiver_id } = req.body;

    if (!receiver_id) {
      return res.status(400).json({ error: "receiver_id manquant" });
    }

    if (receiver_id === senderId) {
      return res.status(400).json({ error: "Impossible de s'ajouter soi-même" });
    }

    // Vérifier si l'utilisateur existe
    const userExists = db
      .prepare("SELECT id FROM users WHERE id = ?")
      .get(receiver_id);

    if (!userExists) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    // Vérifier si une demande existe déjà
    const existing = db
      .prepare(
        "SELECT * FROM friend_requests WHERE sender_id = ? AND receiver_id = ?"
      )
      .get(senderId, receiver_id);

    if (existing) {
      return res.status(400).json({ error: "Demande déjà envoyée" });
    }

    const id = uuid();

    db.prepare(
      "INSERT INTO friend_requests (id, sender_id, receiver_id, status) VALUES (?, ?, ?, ?)"
    ).run(id, senderId, receiver_id, "pending");

    res.json({ success: true, request_id: id });

  } catch (err) {
    console.error("Erreur sendFriendRequest :", err);
    res.status(500).json({ error: "Erreur interne serveur" });
  }
}

export function getFriends(req, res) {
  try {
    const userId = req.user.id;

    // Amis confirmés
    const friends = db.prepare(`
      SELECT u.id, u.username, u.email, f.created_at
      FROM friends f
      JOIN users u ON u.id = f.friend_id
      WHERE f.user_id = ?
    `).all(userId);

    // Demandes reçues (pending)
    const received = db.prepare(`
      SELECT fr.id, fr.sender_id, u.username AS sender_username, fr.created_at
      FROM friend_requests fr
      JOIN users u ON u.id = fr.sender_id
      WHERE fr.receiver_id = ? AND fr.status = 'pending'
    `).all(userId);

    // Demandes envoyées (pending)
    const sent = db.prepare(`
      SELECT fr.id, fr.receiver_id, u.username AS receiver_username, fr.created_at
      FROM friend_requests fr
      JOIN users u ON u.id = fr.receiver_id
      WHERE fr.sender_id = ? AND fr.status = 'pending'
    `).all(userId);

    res.json({
      friends,
      received_requests: received,
      sent_requests: sent
    });

  } catch (err) {
    console.error("Erreur getFriends :", err);
    res.status(500).json({ error: "Erreur interne serveur" });
  }
}

export function acceptFriendRequest(req, res) {
  try {
    const userId = req.user.id;
    const { request_id } = req.body;

    if (!request_id) {
      return res.status(400).json({ error: "request_id manquant" });
    }

    // Vérifier que la demande existe et t'est destinée
    const request = db.prepare(`
      SELECT * FROM friend_requests
      WHERE id = ? AND receiver_id = ? AND status = 'pending'
    `).get(request_id, userId);

    if (!request) {
      return res.status(404).json({ error: "Demande introuvable ou déjà traitée" });
    }

    // Ajouter dans la table friends
    const id1 = uuid();
    const id2 = uuid();

    db.prepare(`
      INSERT INTO friends (id, user_id, friend_id)
      VALUES (?, ?, ?)
    `).run(id1, userId, request.sender_id);

    db.prepare(`
      INSERT INTO friends (id, user_id, friend_id)
      VALUES (?, ?, ?)
    `).run(id2, request.sender_id, userId);

    // Mettre la demande en "accepted"
    db.prepare(`
      UPDATE friend_requests SET status = 'accepted'
      WHERE id = ?
    `).run(request_id);

    res.json({ success: true });

  } catch (err) {
    console.error("Erreur acceptFriendRequest :", err);
    res.status(500).json({ error: "Erreur interne serveur" });
  }
}

export function rejectFriendRequest(req, res) {
  try {
    const userId = req.user.id;
    const { request_id } = req.body;

    if (!request_id) {
      return res.status(400).json({ error: "request_id manquant" });
    }

    const request = db.prepare(`
      SELECT * FROM friend_requests
      WHERE id = ? AND receiver_id = ? AND status = 'pending'
    `).get(request_id, userId);

    if (!request) {
      return res.status(404).json({ error: "Demande introuvable ou déjà traitée" });
    }

    db.prepare(`
      UPDATE friend_requests SET status = 'rejected'
      WHERE id = ?
    `).run(request_id);

    res.json({ success: true });

  } catch (err) {
    console.error("Erreur rejectFriendRequest :", err);
    res.status(500).json({ error: "Erreur interne serveur" });
  }
}
