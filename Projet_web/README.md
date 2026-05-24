# Abalone - Documentation Complète du Projet

Bienvenue dans la documentation du projet **Abalone**, un jeu de stratégie en ligne multiplayer basé sur React et Node.js.

---

## 📋 Table des matières

1. [Aperçu du projet](#aperçu-du-projet)
2. [Architecture générale](#architecture-générale)
3. [Installation](#installation)
4. [Démarrage rapide](#démarrage-rapide)
5. [Documentation détaillée](#documentation-détaillée)
6. [Structure des fichiers](#structure-des-fichiers)
7. [Technologies utilisées](#technologies-utilisées)
8. [Prochaines étapes](#prochaines-étapes)

---

## Aperçu du projet

**Abalone** est une plateforme de jeu en ligne permettant à deux joueurs de s'affronter dans le jeu classique Abalone. 

**Caractéristiques** :
- ✅ Authentification sécurisée (JWT + bcrypt)
- ✅ Matchmaking en temps réel
- ✅ Historique complet des parties
- ✅ Système d'amitié entre joueurs
- 🔄 Socket.io pour jeu temps réel (futur)
- 📊 Classement et statistiques (futur)

---

## Architecture générale

```
┌─────────────────────────────────────────────────────────┐
│                   Client React (Port 5173)              │
│  - Pages : Login, Register, Home, Game Board            │
│  - Auth Context avec JWT storage                        │
│  - API Client (wrapper fetch)                           │
└───────────────────┬─────────────────────────────────────┘
                    │
                    │ HTTPS (JSON)
                    │
┌───────────────────▼─────────────────────────────────────┐
│            Backend Express (Port 3000)                  │
│  - Routes : /api/auth, /api/games, /api/moves          │
│  - Controllers : logique métier                         │
│  - Services : règles du jeu, validations                │
│  - Middleware : authentification JWT                    │
└───────────────────┬─────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────┐
│            Base de données SQLite                       │
│  - Tables : users, games, board_states, moves           │
│  - Fichier : abalone.db                                 │
└─────────────────────────────────────────────────────────┘
```

---

## Installation

### Prérequis

- **Node.js** 16+ et npm
- **SQLite3** (inclus dans `better-sqlite3`)
- **Git**

### 1. Cloner le projet

```bash
git clone https://github.com/Estherfabre01/Abalone-web.git
cd Abalone-web/Projet_web
```

### 2. Configurer le backend

```bash
cd Back_Rest
npm install
```

Créer un fichier `.env` :

```env
PORT=3000
JWT_SECRET=votre_secret_key_tres_secure_ici
SALT_ROUNDS=10
CORS_ORIGIN=http://localhost:5173
DATABASE_PATH=./abalone.db
```

### 3. Configurer le frontend

```bash
cd ../Front_React/my-app
npm install
```

Créer un fichier `.env.local` :

```env
VITE_API_URL=http://localhost:3000/api
```

---

## Démarrage rapide

### Terminal 1 : Backend

```bash
cd Back_Rest
npm start
# ou pour développement avec rechargement
npx nodemon index.js
```

✅ Le backend tourne sur `http://localhost:3000`

### Terminal 2 : Frontend

```bash
cd Front_React/my-app
npm run dev
```

✅ Le frontend tourne sur `http://localhost:5173`

---

## Documentation détaillée

### 1. **API REST** → `API_DOCUMENTATION.md`

Documentation complète de tous les endpoints :
- Authentication (`/auth`)
- Users (`/users`)
- Games (`/games`)
- Moves (`/moves`)
- Board States (`/board`)

**Format** : Requête, réponse, codes d'erreur, exemples JSON

### 2. **Architecture Backend** → `Back_Rest/ARCHITECTURE.md`

Description détaillée :
- Arborescence des fichiers
- Flux de données
- Couches (Controllers, Services, Routes)
- Authentification & sécurité
- Suggestions d'améliorations

### 3. **Schéma Base de Données** → `DATABASE_SCHEMA.md`

Documentation SQL complète :
- Description de chaque table
- Types de données
- Relations et foreign keys
- Indexes
- Requêtes utiles
- Politique de suppression

### 4. **Structure du Projet** → `PROJECT_STRUCTURE.md`

Vue d'ensemble :
- Arborescence complète
- Description des fichiers clés
- Flux de données
- Points d'entrée

---

## Structure des fichiers

```
Projet_web/
├── Back_Rest/                    # Backend Node.js
│   ├── controllers/              # Logique des endpoints
│   ├── routes/                   # Routes Express
│   ├── services/                 # Logique métier
│   ├── middleware/               # Middleware (auth)
│   ├── index.js                  # Point d'entrée
│   ├── db.js                     # Connexion SQLite
│   ├── abalone.db                # Base de données
│   └── abalone.sql               # Schéma SQL
│
├── Front_React/my-app/           # Frontend React + Vite
│   ├── src/
│   │   ├── pages/                # Pages (Login, Home, etc.)
│   │   ├── auth/                 # Contexte & auth
│   │   ├── App.jsx               # Composant principal
│   │   └── api.js                # Client API
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── API_DOCUMENTATION.md          # Doc API REST
├── DATABASE_SCHEMA.md            # Schéma SQL détaillé
├── PROJECT_STRUCTURE.md          # Arborescence du projet
├── Back_Rest/ARCHITECTURE.md     # Architecture backend
└── README.md                     # Ce fichier
```

---

## Technologies utilisées

### Backend
| Tech | Version | Usage |
|------|---------|-------|
| **Node.js** | 16+ | Runtime JavaScript serveur |
| **Express** | 5.x | Framework web HTTP |
| **SQLite** | 3 | Base de données locale |
| **better-sqlite3** | 12.x | Driver SQLite synchrone |
| **bcrypt** | 6.x | Hash de mots de passe |
| **jsonwebtoken** | 9.x | JWT pour authentification |
| **cors** | 2.8 | Middleware CORS |

### Frontend
| Tech | Version | Usage |
|------|---------|-------|
| **React** | 19.x | Librairie UI |
| **React Router** | 7.x | Navigation SPA |
| **Vite** | 8.x | Build tool & dev server |
| **JavaScript (ES6+)** | - | Langage |
| **CSS3** | - | Styling |

---

## Flux d'authentification

```
1. Utilisateur remplit formulaire Register
   ↓
2. Frontend POST /api/auth/register
   ↓
3. Backend hash password avec bcrypt
   ↓
4. Insérer user en DB
   ↓
5. Frontend affiche message succès
   ↓
6. Utilisateur login avec email + password
   ↓
7. Frontend POST /api/auth/login
   ↓
8. Backend vérifie password, crée JWT
   ↓
9. Frontend stocke token en localStorage
   ↓
10. Token inclus dans header Authorization de chaque requête
```

---

## Flux d'une partie

```
1. Joueur 1 crée partie (POST /api/games)
   → Retour game_id
   
2. Joueur 2 rejoint partie (PATCH /api/games/:id/join)
   → status = 'in_progress'
   
3. GET /api/games/:id/board
   → Récupère plateau initial
   
4. Joueur 1 joue coup (POST /api/moves/:id/moves)
   → Validation, création board_state
   
5. Joueur 2 récupère board mis à jour
   → GET /api/games/:id/board
   
6. Répété jusqu'à fin partie
   
7. Partie terminée (status = 'finished', winner_id set)
```

---

## Points de vigilance - Sécurité

⚠️ **À faire avant production** :

1. **JWT Secret** : Ne JAMAIS commiter `.env` avec SECRET_KEY réelle
2. **HTTPS** : Utiliser HTTPS en production
3. **Validation** : Ajouter `express-validator` pour valider toutes les inputs
4. **Rate limiting** : Protéger contre brute-force et DDoS
5. **CORS** : Restreindre à domaine frontend uniquement
6. **Injection SQL** : Utiliser `better-sqlite3` avec paramètres liés (déjà fait)
7. **Password** : Vérifier force des passwords côté serveur

---

## Commandes usuelles

### Backend

```bash
# Démarrer serveur
npm start

# Mode développement (rechargement auto)
npx nodemon index.js

# Réinitialiser base de données
sqlite3 abalone.db < abalone.sql

# Lancer tests (si présents)
npm test
```

### Frontend

```bash
# Mode développement
npm run dev

# Build production
npm run build

# Prévisualiser build
npm run preview

# Linter
npm run lint
```

---

## Prochaines étapes

### Court terme
- [ ] Implémenter validation `express-validator` backend
- [ ] Ajouter gestion complète des mouvements en `abaloneEngine.js`
- [ ] Créer page Game Board pour afficher plateau
- [ ] Ajouter WebSocket pour jeu temps réel

### Moyen terme
- [ ] Système d'amitié (endpoints existants, UI manquante)
- [ ] Classement et statistiques de joueurs
- [ ] Historique des parties (replay)
- [ ] Notifications en temps réel

### Long terme
- [ ] Système de chat
- [ ] Achievements / Badges
- [ ] Tournois
- [ ] Mobile app (React Native)
- [ ] Déploiement cloud

---

## Support et questions

Pour toute question, consulte d'abord :
1. `API_DOCUMENTATION.md` → endpoints
2. `DATABASE_SCHEMA.md` → schéma DB
3. `Back_Rest/ARCHITECTURE.md` → architecture

---

## Licence

Projet Abalone - Tous droits réservés © 2026

---

**Dernière mise à jour** : 24 mai 2026
