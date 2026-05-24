PRAGMA foreign_keys = OFF;

-- ============================
-- DROP TABLES (ordre important)
-- ============================
DROP TABLE IF EXISTS friend_requests;
DROP TABLE IF EXISTS friends;
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
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

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
    board TEXT NOT NULL,
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
    from_positions TEXT NOT NULL,
    to_positions TEXT NOT NULL,
    pushed TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================
-- TABLE : friends
-- ============================
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

-- ============================
-- TABLE : friend_requests
-- ============================
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
