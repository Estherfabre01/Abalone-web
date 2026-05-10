# 🎮 Projet Abalone — Récapitulatif du Back & Front

Ce document résume **tout ce qui est déjà en place** dans le projet Abalone :  
- Back-end Express + SQLite  
- Base de données  
- Routes API  
- Front React connecté au back  
- Lecture du plateau depuis la BDD  

---

# 🗄️ 1. Base de données SQLite

## Fichier : `schema.sql`

Tables existantes :

### ✔️ `users`
- id (UUID)
- username
- email
- created_at

### ✔️ `games`
- id
- player1_id
- player2_id
- status
- winner_id
- created_at

### ✔️ `board_states`
- id
- game_id
- turn_number
- board (JSON)
- current_player
- created_at

### ✔️ `moves`
- id
- game_id
- player_id
- from_positions (JSON)
- to_positions (JSON)
- pushed (JSON)
- created_at

---

# 🚀 2. Back-end Express

## Fichier : `index.js`
- Initialise Express
- Active CORS + JSON
- Connecte SQLite
- Monte les routes :
  - `/api/users`
  - `/api/games`
  - `/api/moves`
  - `/api/board`

## Fichier : `db.js`
- Connexion centralisée à SQLite via `better-sqlite3`

---

# 🔌 3. Routes API existantes

## ✔️ `/api/users`
- GET → liste des utilisateurs
- POST → créer un utilisateur

## ✔️ `/api/games`
- GET → liste des parties
- POST → créer une partie
- GET /:id → récupérer une partie

## ✔️ `/api/moves`
- GET /:game_id → historique des coups
- POST → enregistrer un coup

## ✔️ `/api/board`
- GET /:game_id → dernier état du plateau
- POST → enregistrer un nouvel état du plateau

---

# 🎨 4. Front-end React

## Fichier : `App.jsx`
Le front :
- se connecte au back
- appelle une vraie route (`/api/board/:game_id`)
- parse le JSON du plateau
- affiche les cases du plateau

Exemple de code actuel :

```jsx
useEffect(() => {
  fetch("http://localhost:3000/api/board/1")
    .then(res => res.json())
    .then(data => {
      const parsed = JSON.parse(data.board);
      setBoard(parsed);
    });
}, []);
