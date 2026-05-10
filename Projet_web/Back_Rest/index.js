import express from "express";
import cors from "cors";

const app = express();
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

app.listen(3000, () => {
  console.log("API en ligne sur http://localhost:3000");
});
