-- ============================
-- TABLE : users
-- ============================
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- TABLE : games
-- ============================
CREATE TABLE games (
    id TEXT PRIMARY KEY,
    player1_id TEXT NOT NULL,
    player2_id TEXT,
    status TEXT CHECK(status IN ('waiting', 'in_progress', 'finished')) NOT NULL DEFAULT 'waiting',
    winner_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (player1_id) REFERENCES users(id),
    FOREIGN KEY (player2_id) REFERENCES users(id),
    FOREIGN KEY (winner_id) REFERENCES users(id)
);

-- ============================
-- TABLE : board_states
-- ============================
CREATE TABLE board_states (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL,
    turn_number INTEGER NOT NULL,
    board TEXT NOT NULL, -- JSON
    current_player TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (current_player) REFERENCES users(id)
);

-- ============================
-- TABLE : moves
-- ============================
CREATE TABLE moves (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL,
    player_id TEXT NOT NULL,
    from_positions TEXT NOT NULL, -- JSON
    to_positions TEXT NOT NULL,   -- JSON
    pushed TEXT,                  -- JSON (optionnel)
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (player_id) REFERENCES users(id)
);
