# Schéma de Base de Données - Abalone

## Vue d'ensemble

La base de données SQLite `abalone.db` stocke toutes les données du jeu :
- Utilisateurs et authentification
- Parties et états du plateau
- Mouvements et historiques
- Amitié entre joueurs

**Technologies** : SQLite (better-sqlite3), UUIDs, timestamps ISO-8601

---

## Tables

### 1. `users`

Stocke les profils utilisateurs.

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | TEXT (UUID) | Identifiant unique |
| `username` | TEXT | Pseudo joueur (unique) |
| `email` | TEXT | Email unique |
| `password_hash` | TEXT | Hash bcrypt du mot de passe |
| `created_at` | TEXT | Timestamp ISO-8601 de création |

**Index** :
- `idx_users_email` : Recherche rapide par email (login)

**Contraintes** :
- `username` unique
- `email` unique
- `password_hash` obligatoire

---

### 2. `games`

Représente une partie Abalone entre deux joueurs.

```sql
CREATE TABLE games (
    id TEXT PRIMARY KEY,
    player1_id TEXT NOT NULL,
    player2_id TEXT,
    status TEXT NOT NULL CHECK(status IN ('waiting', 'in_progress', 'finished')) DEFAULT 'waiting',
    winner_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (player1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (player2_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (winner_id) REFERENCES users(id) ON DELETE SET NULL
);
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | TEXT (UUID) | Identifiant unique de la partie |
| `player1_id` | TEXT (FK) | Créateur de la partie |
| `player2_id` | TEXT (FK) | Opponent (NULL si en attente) |
| `status` | TEXT | `waiting` / `in_progress` / `finished` |
| `winner_id` | TEXT (FK) | ID du gagnant (NULL si inachevée) |
| `created_at` | TEXT | Timestamp de création |

**Statuts** :
- `waiting` : En attente d'un deuxième joueur
- `in_progress` : Partie en cours
- `finished` : Partie terminée

**Actions de suppression** :
- Si `player1_id` est supprimé → la partie est supprimée
- Si `player2_id` est supprimé → `player2_id` = NULL
- Si `winner_id` est supprimé → `winner_id` = NULL

---

### 3. `board_states`

Enregistre chaque état du plateau (un par tour).

```sql
CREATE TABLE board_states (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL,
    turn_number INTEGER NOT NULL,
    board TEXT NOT NULL,
    current_player TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (current_player) REFERENCES users(id) ON DELETE CASCADE
);
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | TEXT (UUID) | Identifiant unique |
| `game_id` | TEXT (FK) | Partie à laquelle appartient cet état |
| `turn_number` | INTEGER | Numéro du tour (1, 2, 3, ...) |
| `board` | TEXT | JSON stringifié représentant le plateau |
| `current_player` | TEXT (FK) | Joueur dont c'est le tour |
| `created_at` | TEXT | Timestamp de cet état |

**Format du plateau (exemple)** :
```json
"[\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",null,null,null,\"W\",\"W\",\"W\",\"W\",\"W\",\"W\",\"W\",\"W\",\"W\",\"W\",\"W\",\"W\",\"W\",\"W\"]"
```
- `"B"` : Pion noir
- `"W"` : Pion blanc
- `null` : Case vide

**Usage** : Permet de remonter dans l'historique d'une partie.

---

### 4. `moves`

Enregistre chaque coup joué.

```sql
CREATE TABLE moves (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL,
    player_id TEXT NOT NULL,
    from_positions TEXT NOT NULL,
    to_positions TEXT NOT NULL,
    pushed TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES users(id) ON DELETE CASCADE
);
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | TEXT (UUID) | Identifiant unique du mouvement |
| `game_id` | TEXT (FK) | Partie |
| `player_id` | TEXT (FK) | Joueur ayant joué le coup |
| `from_positions` | TEXT | JSON des positions de départ |
| `to_positions` | TEXT | JSON des positions de destination |
| `pushed` | TEXT | JSON des pions poussés (si applicable) |
| `created_at` | TEXT | Timestamp du coup |

**Format des positions (exemple)** :
```json
"[[0,0],[1,0]]"
```
Coordonnées du plateau Abalone hexagonal.

---

### 5. `friends`

Représente une relation d'amitié bidirectionnelle.

```sql
CREATE TABLE friends (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    friend_id TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,

    UNIQUE(user_id, friend_id)
);

CREATE INDEX idx_friends_user ON friends(user_id);
CREATE INDEX idx_friends_friend ON friends(friend_id);
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | TEXT (UUID) | Identifiant unique |
| `user_id` | TEXT (FK) | Premier utilisateur |
| `friend_id` | TEXT (FK) | Deuxième utilisateur (ami) |
| `created_at` | TEXT | Timestamp d'amitié |

**Contrainte** : `UNIQUE(user_id, friend_id)` → Une seule amitié par paire

**Indexes** : Recherche rapide par user_id ou friend_id

---

### 6. `friend_requests`

Demandes d'amitié en attente, acceptées ou rejetées.

```sql
CREATE TABLE friend_requests (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending', 'accepted', 'rejected')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,

    UNIQUE(sender_id, receiver_id)
);

CREATE INDEX idx_friend_requests_sender ON friend_requests(sender_id);
CREATE INDEX idx_friend_requests_receiver ON friend_requests(receiver_id);
```

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | TEXT (UUID) | Identifiant unique |
| `sender_id` | TEXT (FK) | Initiateur de la demande |
| `receiver_id` | TEXT (FK) | Destinataire |
| `status` | TEXT | `pending` / `accepted` / `rejected` |
| `created_at` | TEXT | Timestamp de la demande |

**Statuts** :
- `pending` : En attente de réponse
- `accepted` : Devrait créer une entrée dans `friends`
- `rejected` : Demande refusée

---

## Relations (Foreign Keys)

```
users (principal)
├─ games (player1_id, player2_id, winner_id)
├─ board_states (current_player)
├─ moves (player_id)
├─ friends (user_id, friend_id)
└─ friend_requests (sender_id, receiver_id)
```

**Politique de suppression** :
- `ON DELETE CASCADE` : Supprime les enfants si le parent est supprimé
- `ON DELETE SET NULL` : Met le champ FK à NULL

---

## Requêtes utiles

### Récupérer la dernière partie d'un joueur

```sql
SELECT * FROM games
WHERE player1_id = ? OR player2_id = ?
ORDER BY created_at DESC
LIMIT 1;
```

### Récupérer l'état actuel du plateau

```sql
SELECT * FROM board_states
WHERE game_id = ?
ORDER BY turn_number DESC
LIMIT 1;
```

### Lister tous les mouvements d'une partie

```sql
SELECT * FROM moves
WHERE game_id = ?
ORDER BY created_at ASC;
```

### Récupérer les amis d'un utilisateur

```sql
SELECT u.id, u.username, u.email
FROM friends f
JOIN users u ON (f.friend_id = u.id OR f.user_id = u.id)
WHERE (f.user_id = ? AND f.friend_id != ?)
   OR (f.friend_id = ? AND f.user_id != ?);
```

### Demandes d'amitié en attente

```sql
SELECT * FROM friend_requests
WHERE receiver_id = ? AND status = 'pending'
ORDER BY created_at DESC;
```

---

## Indexation

| Index | Table | Colonne(s) | Objectif |
|-------|-------|-----------|----------|
| `idx_users_email` | users | email | Login rapide |
| `idx_friends_user` | friends | user_id | Récupérer amis |
| `idx_friends_friend` | friends | friend_id | Récupérer amis (inverse) |
| `idx_friend_requests_sender` | friend_requests | sender_id | Demandes envoyées |
| `idx_friend_requests_receiver` | friend_requests | receiver_id | Demandes reçues |

---

## Améliorations futures

1. **Ratings/Elo** : Ajouter colonne `elo` dans `users`
2. **Game Stats** : Table `game_stats` pour stats par joueur
3. **Messages** : Table `messages` pour chat
4. **Notifications** : Table `notifications` pour système de notifs
5. **Bans/Suspensions** : Ajouter colonnes `banned_at`, `ban_reason` dans `users`
6. **Audit Log** : Table pour tracer les actions sensibles (admin)

---

## Initialisation de la BD

Pour initialiser la base de données :

```bash
cd Back_Rest
sqlite3 abalone.db < abalone.sql
```

Ou via le code Node.js :

```javascript
import fs from 'fs';
import Database from 'better-sqlite3';

const db = new Database('abalone.db');
const schema = fs.readFileSync('abalone.sql', 'utf-8');
db.exec(schema);
```
