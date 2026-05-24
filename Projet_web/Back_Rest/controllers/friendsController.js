import { v4 as uuid } from "uuid";
import db from "../db.js";

/**
 * Envoyer une demande d'ami via username
 */
export function sendFriendRequest(req, res) {
  try {
    const senderId = req.user.id;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "username manquant" });
    }

    // Trouver l'utilisateur par username
    const receiver = db
      .prepare("SELECT id FROM users WHERE username = ?")
      .get(username);

    if (!receiver) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    const receiver_id = receiver.id;

    if (receiver_id === senderId) {
      return res.status(400).json({ error: "Impossible de s'ajouter soi-même" });
    }

    // Vérifier si déjà amis
    const alreadyFriends = db.prepare(`
      SELECT * FROM friends
      WHERE user_id = ? AND friend_id = ?
    `).get(senderId, receiver_id);

    if (alreadyFriends) {
      return res.status(400).json({ error: "Vous êtes déjà amis" });
    }

    // Vérifier si une demande existe déjà
    const existing = db.prepare(`
      SELECT * FROM friend_requests
      WHERE sender_id = ? AND receiver_id = ? AND status = 'pending'
    `).get(senderId, receiver_id);

    if (existing) {
      return res.status(400).json({ error: "Demande déjà envoyée" });
    }

    const id = uuid();

    db.prepare(`
      INSERT INTO friend_requests (id, sender_id, receiver_id, status)
      VALUES (?, ?, ?, 'pending')
    `).run(id, senderId, receiver_id);

    res.json({ success: true, request_id: id });

  } catch (err) {
    console.error("Erreur sendFriendRequest :", err);
    res.status(500).json({ error: "Erreur interne serveur" });
  }
}

/**
 * Récupérer amis + demandes
 */
export function getFriends(req, res) {
  try {
    const userId = req.user.id;

    // Amis confirmés
    const friends = db.prepare(`
      SELECT u.id, u.username, u.email
      FROM friends f
      JOIN users u ON u.id = f.friend_id
      WHERE f.user_id = ?
    `).all(userId);

    // Demandes reçues
    const received = db.prepare(`
      SELECT fr.id, fr.sender_id, u.username AS sender_username
      FROM friend_requests fr
      JOIN users u ON u.id = fr.sender_id
      WHERE fr.receiver_id = ? AND fr.status = 'pending'
    `).all(userId);

    // Demandes envoyées
    const sent = db.prepare(`
      SELECT fr.id, fr.receiver_id, u.username AS receiver_username
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

/**
 * Accepter une demande d'ami
 */
export function acceptFriendRequest(req, res) {
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
      return res.status(404).json({ error: "Demande introuvable" });
    }

    const id1 = uuid();
    const id2 = uuid();

    // Ajout dans les deux sens
    db.prepare(`
      INSERT INTO friends (id, user_id, friend_id)
      VALUES (?, ?, ?)
    `).run(id1, userId, request.sender_id);

    db.prepare(`
      INSERT INTO friends (id, user_id, friend_id)
      VALUES (?, ?, ?)
    `).run(id2, request.sender_id, userId);

    // Marquer comme acceptée
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

/**
 * Rejeter une demande d'ami
 */
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
      return res.status(404).json({ error: "Demande introuvable" });
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
