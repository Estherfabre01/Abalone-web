import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";   // ← AJOUT
import usersRoutes from "./routes/users.js";
import gamesRoutes from "./routes/games.js";
import movesRoutes from "./routes/moves.js";
import boardRoutes from "./routes/board.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);   // ← AJOUT
app.use("/api/users", usersRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/moves", movesRoutes);
app.use("/api/board", boardRoutes);

app.listen(3000, () => {
  console.log("API en ligne sur http://localhost:3000");
});
