export function getInitialBoard() {
  return [
    "B","B","B","B","B",
    "B","B","B","B",
    "B","B","B",
    null,null,null,
    "W","W","W",
    "W","W","W","W",
    "W","W","W","W","W"
  ];
}

export function isMoveValid(board, from, to) {
  return true; // placeholder
}

export function applyMove(board, from, to) {
  return board; // placeholder
}
