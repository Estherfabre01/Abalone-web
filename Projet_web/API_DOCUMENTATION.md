# API Documentation - Abalone

## Vue d'ensemble

L'API REST Abalone fournit les endpoints nécessaires pour gérer les utilisateurs, authentification, parties, mouvements et amitié entre joueurs.

- **Base URL** : `http://localhost:3000/api`
- **Format** : JSON
- **Authentification** : JWT Bearer token

---

## Authentification

Toutes les routes marquées `[Auth]` nécessitent un header :
```
Authorization: Bearer <token>
```

Le token est obtenu via `POST /api/auth/login`.

---

## Endpoints

### Authentification

#### `POST /api/auth/register`
Créer un nouveau compte utilisateur.

**Body:**
```json
{
  "username": "joueur123",
  "email": "joueur@example.com",
  "password": "MonMotDePasse123"
}
```

**Response (201):**
```json
{
  "message": "User created"
}
```

**Errors:**
- `400` : Champs manquants

---

#### `POST /api/auth/login`
Authentifier un utilisateur et recevoir un JWT.

**Body:**
```json
{
  "email": "joueur@example.com",
  "password": "MonMotDePasse123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "joueur123",
    "email": "joueur@example.com"
  }
}
```

**Errors:**
- `400` : Identifiants invalides

---

### Utilisateurs

#### `GET /api/users` [Public]
Lister tous les utilisateurs.

**Response (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "joueur1",
    "email": "joueur1@example.com",
    "created_at": "2026-05-24T10:30:00.000Z"
  }
]
```

---

#### `POST /api/users` [Public]
Créer un utilisateur simple (sans authentification).

**Body:**
```json
{
  "username": "joueur_simple",
  "email": "simple@example.com"
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "username": "joueur_simple",
  "email": "simple@example.com"
}
```

---

### Parties

#### `POST /api/games` [Auth]
Créer une nouvelle partie.

**Response (200):**
```json
{
  "id": "game-uuid-here"
}
```

---

#### `GET /api/games/:id` [Auth]
Récupérer les informations d'une partie.

**Response (200):**
```json
{
  "id": "game-uuid-here",
  "player1_id": "user-uuid-1",
  "player2_id": null,
  "status": "waiting",
  "winner_id": null,
  "created_at": "2026-05-24T10:30:00.000Z"
}
```

**Errors:**
- `404` : Partie non trouvée

---

#### `PATCH /api/games/:id/join` [Auth]
Rejoindre une partie en attente de joueurs.

**Response (200):**
```json
{
  "message": "Joined"
}
```

**Errors:**
- `400` : Partie pleine ou en cours
- `404` : Partie non trouvée

---

### Plateau & États

#### `GET /api/games/:id/board` [Auth]
Récupérer l'état courant du plateau d'une partie.

**Response (200):**
```json
{
  "id": "board-state-uuid",
  "game_id": "game-uuid",
  "turn_number": 1,
  "board": "[\"B\",\"B\",\"B\",...,\"W\",\"W\",\"W\"]",
  "current_player": "user-uuid-1",
  "created_at": "2026-05-24T10:30:00.000Z"
}
```

---

#### `GET /api/games/:id/board/:turn` [Auth]
Récupérer l'état du plateau à un tour spécifique (rejeu).

**Response (200):**
```json
{
  "id": "board-state-uuid",
  "game_id": "game-uuid",
  "turn_number": 3,
  "board": "[\"B\",\"B\",\"B\",...,\"W\",\"W\",\"W\"]",
  "current_player": "user-uuid-2",
  "created_at": "2026-05-24T10:32:00.000Z"
}
```

**Errors:**
- `404` : Tour non trouvé

---

#### `GET /api/board/:game_id` [Public]
Alternative pour récupérer le plateau (route alternative, non authentifiée).

**Response (200):**
```json
{
  "id": "board-state-uuid",
  "game_id": "game-uuid",
  "turn_number": 1,
  "board": "[...]",
  "current_player": "user-uuid"
}
```

---

#### `POST /api/board` [Public]
Insérer un nouvel état du plateau (usage interne).

**Body:**
```json
{
  "game_id": "game-uuid",
  "turn_number": 2,
  "board": "[\"B\",\"B\",...,\"W\"]",
  "current_player": "user-uuid-2"
}
```

**Response (201):**
```json
{
  "id": "new-board-state-uuid",
  "game_id": "game-uuid",
  "turn_number": 2
}
```

---

### Mouvements

#### `POST /api/moves/:id/moves` [Auth]
Jouer un coup dans la partie `:id`.

**Body:**
```json
{
  "from": [[0, 0], [1, 0]],
  "to": [[2, 0], [3, 0]]
}
```

**Response (200):**
```json
{
  "message": "Move played",
  "turn": 2
}
```

**Errors:**
- `400` : Mouvement invalide
- `404` : Partie non trouvée

---

#### `GET /api/moves/:id/moves` [Auth]
Lister tous les mouvements d'une partie.

**Response (200):**
```json
[
  {
    "id": "move-uuid-1",
    "game_id": "game-uuid",
    "player_id": "user-uuid-1",
    "from_positions": "[[0,0],[1,0]]",
    "to_positions": "[[2,0],[3,0]]",
    "pushed": null,
    "created_at": "2026-05-24T10:32:00.000Z"
  }
]
```

---

## Codes de statut HTTP

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Créé |
| 400 | Mauvaise requête (validation) |
| 401 | Non authentifié |
| 403 | Accès refusé |
| 404 | Non trouvé |
| 500 | Erreur serveur |

---

## Schéma du JWT

```json
{
  "id": "user-uuid",
  "iat": 1234567890,
  "exp": 1234571490
}
```

Clé secrète : `SECRET_KEY` (à remplacer par une variable d'environnement).
