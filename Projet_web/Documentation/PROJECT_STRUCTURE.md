# Arborescence du Projet - Abalone

## Structure générale

```
Projet_web/
├── Back_Rest/                  # Backend Express + SQLite
│   ├── abalone.db             # Base de données SQLite
│   ├── abalone.sql            # Schéma de création des tables
│   ├── db.js                  # Configuration de la connexion DB
│   ├── index.js               # Point d'entrée du serveur
│   ├── package.json           # Dépendances Node.js
│   ├── package-lock.json
│   │
│   ├── controllers/           # Logique métier des endpoints
│   │   ├── authController.js        # Register, Login
│   │   ├── gameController.js        # Créer, rejoindre parties, récupérer plateau
│   │   ├── moveController.js        # Jouer un mouvement, lister coups
│   │   └── userController.js        # Vide (à compléter)
│   │
│   ├── routes/                # Définition des routes Express
│   │   ├── auth.js            # Routes d'authentification
│   │   ├── board.js           # Routes du plateau
│   │   ├── games.js           # Routes des parties
│   │   ├── moves.js           # Routes des mouvements
│   │   └── users.js           # Routes des utilisateurs
│   │
│   ├── middleware/            # Middlewares réutilisables
│   │   └── authMiddleware.js  # Vérification JWT
│   │
│   └── services/              # Logique métier réutilisable
│       ├── abaloneEngine.js   # Règles du jeu, validation mouvements
│       └── gameService.js     # Logique métier des parties (vide)
│
├── Front_React/               # Frontend React Vite
│   └── my-app/
│       ├── index.html                # Point d'entrée HTML
│       ├── package.json              # Dépendances npm
│       ├── package-lock.json
│       ├── vite.config.js            # Configuration Vite
│       ├── eslint.config.js          # Config ESLint
│       ├── README.md
│       │
│       ├── public/                   # Assets statiques
│       └── src/
│           ├── main.jsx              # Entry point React
│           ├── App.jsx               # Composant principal
│           ├── App.css               # Styles globals
│           ├── index.css             # Styles généraux
│           │
│           ├── api.js                # Utilitaires API (fetch wrapper)
│           │
│           ├── auth/                 # Logique d'authentification
│           │   ├── AuthContext.jsx   # Context d'authentification
│           │   └── ProtectedRoute.jsx # Composant de protection
│           │
│           ├── pages/                # Pages principales
│           │   ├── Welcome.jsx       # Page d'accueil
│           │   ├── Login.jsx         # Page de connexion
│           │   ├── Register.jsx      # Page d'inscription
│           │   ├── Home.jsx          # Page d'accueil (connecté)
│           │   └── Header.jsx        # Header avec user info
│           │
│           └── assets/               # Images, icônes, etc.
│
├── BDD/                       # Documentation base de données
├── ARCHITECTURE.md            # Documentation architecture backend
├── API_DOCUMENTATION.md       # Documentation API REST
├── PROJECT_STRUCTURE.md       # Arborescence du projet (ce fichier)
├── DATABASE_SCHEMA.md         # Schéma et descriptions DB
├── README.md                  # Readme du projet
├── assistance.md              # Notes d'assistance
└── Avancement.md              # Tracker d'avancement du projet
```

---

## Description des fichiers clés

### Backend - Back_Rest/

#### Fichiers principaux
- **index.js** : Configure Express, active CORS, parse JSON, monte toutes les routes
- **db.js** : Crée et exporte une instance `better-sqlite3` pour les requêtes synchrones
- **package.json** : Gère les dépendances (express, cors, bcrypt, jwt, better-sqlite3)

#### Controllers/ (Logique métier)
- **authController.js** : Gère `register()` et `login()`. Hash password, crée JWT.
- **gameController.js** : `createGame()`, `getGame()`, `joinGame()`, récupère board
- **moveController.js** : `playMove()` valide et joue un mouvement, `listMoves()`
- **userController.js** : Vide pour l'instant, à développer

#### Routes/ (Mapping)
Chaque fichier route importe son controller et définit les endpoints :
- **auth.js** : `/register`, `/login`
- **games.js** : `POST /`, `GET /:id`, `PATCH /:id/join`
- **board.js** : `GET /:game_id`, `POST /`
- **moves.js** : `POST /:id/moves`, `GET /:id/moves`
- **users.js** : `GET /`, `POST /`

#### Middleware/
- **authMiddleware.js** : Extrait JWT du header `Authorization`, vérifie signature et injecte `req.user`

#### Services/
- **abaloneEngine.js** : Implémente les règles du jeu
  - `getInitialBoard()` : Setup initial des pions
  - `isMoveValid(board, from, to)` : Valide un mouvement (placeholder)
  - `applyMove(board, from, to)` : Applique un mouvement (placeholder)
- **gameService.js** : Vide, peut contenir logique de fin de partie, scoring, etc.

---

### Frontend - Front_React/my-app/

#### Fichiers principaux
- **index.html** : Template HTML avec div#root pour React
- **main.jsx** : Crée la racine React et monte App.jsx
- **App.jsx** : Composant racine, configure routing, AuthProvider, ProtectedRoute
- **api.js** : Wrapper pour fetch(), endpoints `register()`, `login()`

#### Auth/
- **AuthContext.jsx** : Context React + useAuth hook
  - Gère token et user dans localStorage
  - Fournit `login()`, `logout()`
- **ProtectedRoute.jsx** : Composant HOC qui redirige vers /login si pas d'auth

#### Pages/
- **Welcome.jsx** : Accueil public avec boutons Login/Register
- **Login.jsx** : Formulaire de connexion
- **Register.jsx** : Formulaire d'inscription
- **Home.jsx** : Accueil protégé (actions : créer/rejoindre partie)
- **Header.jsx** : Barre de navigation avec user avatar et logout

#### Assets/
Emplacement pour images, icônes, logos Abalone

---

## Flux de données

```
Frontend (React)
    ↓
api.js (fetch wrapper)
    ↓
Backend API (Express)
    ↓
Controllers (Logique métier)
    ↓
Services (Calculs, validations)
    ↓
Database (SQLite)
```

---

## Variables d'environnement

### Backend (.env)
```
PORT=3000
DATABASE_PATH=./abalone.db
JWT_SECRET=your-secret-key-here
SALT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3000/api
```

---

## Points d'entrée

- **Backend** : `node Back_Rest/index.js` (écoute sur port 3000)
- **Frontend** : `npm run dev` dans `Front_React/my-app/` (Vite sur port 5173)

---

## Améliorations suggérées

1. Ajouter un `docker-compose.yml` pour backend + frontend + DB
2. Créer un dossier `shared/` avec types/interfaces partagés (si TypeScript)
3. Réorganiser les routes en un router centralisé
4. Ajouter tests (`jest`, `supertest`)
5. Implémenter logging centralisé
6. Ajouter validation des inputs (`express-validator`)
