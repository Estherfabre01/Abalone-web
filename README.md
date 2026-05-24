# Abalone-web

## Vue d'ensemble
Abalone-web est un projet personnel qui propose une application web autour du jeu d'Abalone.

Le dépôt contient deux parties principales :
- `Projet_web/Back_Rest` : API backend Node.js / Express avec gestion des utilisateurs, des parties, des mouvements et de l'authentification.
- `Projet_web/Front_React/my-app` : application frontend React moderne, connectée à l'API pour l'interface de jeu et la gestion des utilisateurs.

## Architecture générale
- Backend : Node.js, Express, MySQL / SQL (fichier `abalone.sql`), architecture MVC légère.
- Frontend : React + Vite, pages d'authentification, tableau de bord, amis et gestion de parties.

## Structure du dépôt
- `Projet_web/Back_Rest/` : code serveur, routes, contrôleurs, services, middleware.
- `Projet_web/Back_Rest/Documentation/` : documentation API, schéma de base de données, architecture.
- `Projet_web/Front_React/my-app/` : application React, composants, pages, contexte d'authentification.

## Points clés
- API REST pour la gestion des utilisateurs, des amis, des parties et des coups.
- Moteur de jeu Abalone encapsulé dans un service backend.
- Authentification et protection des routes côté backend.
- Frontend React consommant l'API pour proposer une interface utilisateur.

## Pour lancer le projet
1. Backend : `cd Projet_web/Back_Rest && npm install && node index`
2. Frontend : `cd Projet_web/Front_React/my-app && npm install && npm run dev`

> Pour plus de détails, consulter la documentation disponible dans `Projet_web/Documentation/` et les fichiers README des sous-projets.

