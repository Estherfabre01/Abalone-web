import { DIRECTIONS, add, key, parseKey } from "./hex.js";

export function applyMove(board, move) {
  const { marbles, direction } = move;
  const dir = DIRECTIONS[direction];

  const newBoard = new Map(board);

  // On déplace d'abord les billes les plus avancées
  const sorted = [...marbles].sort(([q1, r1], [q2, r2]) => {
    const [dq, dr] = dir;
    return (q2 * dq + r2 * dr) - (q1 * dq + r1 * dr);
  });

  for (const [q, r] of sorted) {
    const k = key([q, r]);
    const val = newBoard.get(k);

    const [nq, nr] = add([q, r], dir);
    const nk = key([nq, nr]);

    newBoard.set(k, ".");
    newBoard.set(nk, val);
  }

  return newBoard;
}

export function isMoveValid(board, move) {
  // Pour l'instant : toujours valide
  // On implémentera la vraie logique après
  return true;
}
