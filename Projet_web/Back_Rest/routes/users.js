import express from "express";
import db from "../db.js";
import crypto from "crypto";

const router = express.Router();

// GET all users
router.get("/", (req, res) => {
  const users = db.prepare("SELECT * FROM users").all();
  res.json(users);
});

// POST create user
router.post("/", (req, res) => {
  const { username, email } = req.body;
  const id = crypto.randomUUID();

  db.prepare("INSERT INTO users (id, username, email) VALUES (?, ?, ?)")
    .run(id, username, email);

  res.json({ id, username, email });
});

export default router;
