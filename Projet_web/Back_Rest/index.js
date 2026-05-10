import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const db = new Database("abalone.db");

const app = express();

const users = db.prepare("SELECT * FROM users").all();
console.log(users);

app.use(cors());
app.use(express.json());

// Route GET
app.get("/api/hello", (req, res) => {
  res.json({ message: "Bienvenue dans ton API REST !" });
});

// Route POST
app.post("/api/data", (req, res) => {
  const data = req.body;
  res.json({ reçu: data });
});

app.post("/api/users", (req, res) => {
  const { username, email } = req.body;
  const id = crypto.randomUUID();

  db.prepare("INSERT INTO users (id, username, email) VALUES (?, ?, ?)")
    .run(id, username, email);

  res.json({ id, username, email });
});

app.listen(3000, () => {
  console.log("API en ligne sur http://localhost:3000");
});
