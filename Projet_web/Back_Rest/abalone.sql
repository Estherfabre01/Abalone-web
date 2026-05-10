PRAGMA foreign_keys = OFF;

-- ============================
-- DROP TABLES (ordre important)
-- ============================
DROP TABLE IF EXISTS moves;
DROP TABLE IF EXISTS board_states;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS users;

PRAGMA foreign_keys = ON;

-- ============================
-- TABLE : users
-- ============================
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- TABLE : games
-- ============================
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

    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (current_player) REFERENCES users(id) ON DELETE CASCADE
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

    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================
-- INDEXES
-- ============================
CREATE INDEX idx_games_player1 ON games(player1_id);
CREATE INDEX idx_games_player2 ON games(player2_id);
CREATE INDEX idx_board_states_game ON board_states(game_id);
CREATE INDEX idx_moves_game ON moves(game_id);
CREATE INDEX idx_moves_player ON moves(player_id);
