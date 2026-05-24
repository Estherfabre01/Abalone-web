# Architecture du backend (Abalone)

Ce document décrit l'architecture actuelle du backend, les routes exposées, la base de données, les composants principaux et les améliorations recommandées.

## Vue d'ensemble

- Langage / runtime : Node.js (ES Modules)
- Framework : Express
- Base de données : SQLite (via `better-sqlite3`), fichier `abalone.db`
- Authentification : JWT (implémentation simple avec clé en dur)
- Structure principale : dossiers `controllers/`, `routes/`, `services/`, `middleware/`

## Arborescence (principale)

- `index.js` : point d'entrée, configure Express, CORS, JSON body parsing et monte les routes.
- `db.js` : instance `better-sqlite3` exportée pour exécuter des requêtes synchrones.
- `controllers/` : logique des endpoints (auth, users, games, moves, ...).
- `routes/` : définition des routes Express qui appellent les controllers.
- `services/` : logique métier réutilisable, ex. `abaloneEngine.js` pour les règles du jeu.
- `middleware/` : middleware réutilisables, ex. `authMiddleware.js` pour vérifier le JWT.
- `package.json` : dépendances (express, cors, bcrypt, jsonwebtoken, better-sqlite3).

## Schéma de la base de données (résumé)

Tables principales (nommé d'après les requêtes existantes) :

- `users`
  - `id` (UUID)
  - `username`
  - `email`
  - `password_hash`

- `games`
  - `id` (UUID)
  - `player1_id` (fk -> users.id)
  - `player2_id` (fk -> users.id, nullable)
  - `status` (`waiting`, `in_progress`, `finished`, ...)

- `board_states`
  - `id` (UUID)
  - `game_id` (fk -> games.id)
  - `turn_number` (int)
  - `board` (JSON / TEXT)
  - `current_player` (user id)

- `moves`
  - `id` (UUID)
  - `game_id` (fk -> games.id)
  - `player_id` (fk -> users.id)
  - `from_positions` (JSON / TEXT)
  - `to_positions` (JSON / TEXT)

> Remarque : le modèle stocke l'état du plateau sérialisé dans `board_states.board`.

## Endpoints principaux (API REST)

- Auth
  - `POST /api/auth/register` — créer un compte (body: `username`, `email`, `password`)
  - `POST /api/auth/login` — authentifier (body: `email`, `password`) → renvoie `token` + `user`

- Users
  - `GET /api/users` — lister tous les utilisateurs
  - `POST /api/users` — (simple) créer un utilisateur

- Games
  - `POST /api/games` — créer une partie (auth)
  - `GET /api/games/:id` — obtenir les métadonnées d'une partie (auth)
  - `PATCH /api/games/:id/join` — rejoindre une partie (auth)

- Board / States
  - `GET /api/games/:id/board` — récupérer l'état courant du plateau (auth)
  - `GET /api/games/:id/board/:turn` — récupérer le plateau à un tour précis (auth)
  - `GET /api/board/:game_id` — alternative présent dans `routes/board.js` (non-auth)
  - `POST /api/board` — insérer un `board_state` (non-auth)

- Moves
  - `POST /api/moves/:id/moves` — jouer un coup pour la partie `:id` (auth)
  - `GET /api/moves/:id/moves` — lister les coups d'une partie (auth)

## Authentification & sécurité

- Actuellement : middleware `authMiddleware.js` extrait le token depuis `Authorization: Bearer <token>` et vérifie avec `jwt.verify(token, "SECRET_KEY")`.
- Problèmes actuels : la clé JWT est codée en dur -> remplacer par variable d'environnement `JWT_SECRET`.
- Actions recommandées :
  - Utiliser `dotenv` et une variable `JWT_SECRET` (ou un secret manager en production).
  - Configurer `SALT_ROUNDS` pour `bcrypt` via variable d'environnement.
  - Ajouter validation côté serveur (ex. `express-validator`) pour tous les endpoints d'entrée.

## Gestion des erreurs

- Standardiser un middleware de gestion d'erreurs centralisé pour capturer les erreurs asynchrones et renvoyer des statuts et messages JSON cohérents.
- Valider les entrées et renvoyer `400` pour les requêtes invalides, `401` pour l'auth, `403` pour l'autorisation, `404` pour ressources absentes, `500` pour erreurs serveur.

## Tests & qualité

- Ajouter des tests unitaires pour :
  - `services/abaloneEngine.js` (règles du jeu, validation des mouvements)
  - controllers importants (`authController`, `moveController`)
- Ajouter des tests d'intégration pour les routes API (supertest + jest)
- Intégrer linting (`eslint`) et pre-commit hooks (`husky`) si besoin.

## Configuration & variables d'environnement

Exemples de variables à définir dans `.env` :

- `PORT=3000`
- `DATABASE_PATH=./abalone.db`
- `JWT_SECRET=remplace_par_un_secret` 
- `SALT_ROUNDS=10`

## Suggestions d'amélioration de l'architecture

- Séparer la logique métier en couches : controllers → services → repositories (DB).
- Remplacer l'accès SQL inline par un module `repositories/` pour centraliser les requêtes.
- Prévoir une abstraction DB si on veut évoluer vers Postgres (migrations via `knex` ou `sequelize`).
- Dockerfile + docker-compose (API + volume DB) pour faciliter le déploiement local.
- Ajouter un endpoint healthcheck `GET /api/health`.
- Mettre en place la pagination et la limitation de taux si l'application grandit.

## Comment lancer le backend en développement

1. Installer les dépendances :

```bash
cd Back_Rest
npm install
```

2. Définir un `.env` avec au moins `JWT_SECRET` et `PORT`.

3. Démarrer :

```bash
node index.js
# ou utiliser nodemon pour dev
npx nodemon index.js
```

## Fichiers à consulter

- `index.js` — configuration Express et montage des routes
- `db.js` — connexion SQLite
- `controllers/*` — logique d'API
- `services/abaloneEngine.js` — règles du jeu
- `routes/*` — mapping des routes
- `middleware/authMiddleware.js` — vérification JWT

---

Si tu veux, j'ajoute aussi :
- un `README.md` plus complet avec diagrammes simples,
- un `.env.example`,
- une PR préparée qui introduit `dotenv`, migration de la clé secrète et un middleware d'erreurs centralisé.
