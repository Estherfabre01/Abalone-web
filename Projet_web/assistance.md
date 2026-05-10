backend/
│
├── server.js
├── db.js
│
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── games.js
│   └── moves.js
│
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── gameController.js
│   └── moveController.js
│
├── services/
│   ├── abaloneEngine.js
│   └── gameService.js
│
└── middleware/
    └── authMiddleware.js


sqlite3 abalone.db < abalone.sql
Get-Content abalone.sql | sqlite3 abalone.db
