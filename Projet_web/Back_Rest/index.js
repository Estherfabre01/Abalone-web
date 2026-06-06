import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js"; 
import usersRoutes from "./routes/users.js";
import gamesRoutes from "./routes/games.js";
import movesRoutes from "./routes/moves.js";
import friendsRoutes from "./routes/friends.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); 
app.use("/api/users", usersRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/moves", movesRoutes);
app.use("/api/friends", friendsRoutes);

app.listen(3000, () => {
  console.log("API en ligne sur http://localhost:3000");
});
