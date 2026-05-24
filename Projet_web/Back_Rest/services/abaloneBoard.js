export function getInitialBoard() {
  const board = new Map();

  const R_MIN = -4;
  const R_MAX = 4;

  for (let r = R_MIN; r <= R_MAX; r++) {
    const qMin = Math.max(-4, -r - 4);
    const qMax = Math.min(4, -r + 4);

    for (let q = qMin; q <= qMax; q++) {
      let v = ".";

      // Rangées noires pleines
      if (r === -4 || r === -3) v = "B";

      // Rangée -2 : triplette noire décalée (0,1,2)
      if (r === -2 && (q === 0 || q === 1 || q === 2)) v = "B";

      // Rangée 2 : triplette blanche décalée (-2,-1,0)
      if (r === 2 && (q === -2 || q === -1 || q === 0)) v = "W";

      // Rangées blanches pleines
      if (r === 3 || r === 4) v = "W";

      board.set(`${q},${r}`, v);
    }
  }

  return board;
}
