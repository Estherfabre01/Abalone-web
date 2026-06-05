// services/abaloneEngine.js
import { DIRECTIONS, add, key } from "./hex.js";

/**
 * board : Map<string, "B" | "W" | ".">
 * move  : { marbles: [ [q,r], ... ], direction: "NE" | "NW" | "E" | "W" | "SE" | "SW" }
 */

export function isMoveValid(board, move) {
  const { marbles, direction } = move;
  const dir = DIRECTIONS[direction];
  const allyCount = marbles.length;

  if (!dir) {
    return { valid: false, reason: "Direction invalide" };
  }

  if (allyCount === 0) {
    return { valid: false, reason: "Aucune bille sélectionnée" };
  }

  const firstCell = board.get(key(marbles[0]));
  if (firstCell !== "B" && firstCell !== "W") {
    return { valid: false, reason: "Bille alliée introuvable" };
  }
  const allyColor = firstCell;
  const enemyColor = allyColor === "B" ? "W" : "B";

  // 1) Alignement géométrique
  if (allyCount > 1 && !areAligned(marbles)) {
    return { valid: false, reason: "Les billes ne sont pas alignées" };
  }

  const inline = isInline(marbles, dir);

  // 2) BROADSIDE (déplacement latéral)
  if (!inline) {
    for (const [q, r] of marbles) {
      const [nq, nr] = add([q, r], dir);
      const cell = board.get(key([nq, nr]));

      if (cell === undefined || cell !== ".") {
        return { valid: false, reason: "Déplacement latéral bloqué" };
      }
    }
    return { valid: true, reason: "Broadside OK" };
  }

  // 3) INLINE (poussée potentielle)
  const sorted = sortMarblesAlongDir(marbles, dir); // front en premier

  let enemyCount = 0;
  let [cq, cr] = sorted[0];

  while (true) {
    const [nq, nr] = add([cq, cr], dir);
    const cell = board.get(key([nq, nr]));

    if (cell === undefined) {
      // Sortie du plateau
      return enemyCount > 0
        ? { valid: true, reason: "Poussée hors plateau" }
        : { valid: false, reason: "Impossible de sortir une bille alliée" };
    }

    if (cell === ".") break;

    if (cell === allyColor) {
      return { valid: false, reason: "Une bille alliée bloque" };
    }

    if (cell === enemyColor) {
      enemyCount++;
      if (enemyCount > 2) {
        return { valid: false, reason: "Impossible de pousser plus de 2 ennemies" };
      }
    }

    cq = nq;
    cr = nr;
  }

  if (enemyCount >= allyCount) {
    return { valid: false, reason: "Pas assez de billes pour pousser" };
  }

  return {
    valid: true,
    reason: enemyCount > 0
      ? `Poussée possible (${enemyCount} ennemies)`
      : "Case libre"
  };
}

export function applyMove(board, move) {
  const { marbles, direction } = move;
  const dir = DIRECTIONS[direction];

  const newBoard = new Map(board);

  if (!dir || marbles.length === 0) {
    return newBoard;
  }

  const allyColor = newBoard.get(key(marbles[0]));
  const enemyColor = allyColor === "B" ? "W" : "B";

  const inline = isInline(marbles, dir);

  // BROADSIDE : simple déplacement latéral
  if (!inline) {
    for (const [q, r] of marbles) {
      const fromKey = key([q, r]);
      const [nq, nr] = add([q, r], dir);
      const toKey = key([nq, nr]);

      newBoard.set(fromKey, ".");
      newBoard.set(toKey, allyColor);
    }
    return newBoard;
  }

  // INLINE : gestion de la chaîne alliés + ennemis
  const sorted = sortMarblesAlongDir(marbles, dir); // front en premier

  // On part de la bille la plus en arrière dans le sens du mouvement
  const backMost = sorted[sorted.length - 1];
  const chain = [];
  let [cq, cr] = backMost;

  while (true) {
    const k = key([cq, cr]);
    const cell = newBoard.get(k);

    if (cell === undefined || cell === ".") break;

    chain.push([cq, cr]);

    const [nq, nr] = add([cq, cr], dir);
    cq = nq;
    cr = nr;
  }

  // Déplacement de la chaîne du bout vers l'avant
  for (let i = chain.length - 1; i >= 0; i--) {
    const [q, r] = chain[i];
    const fromKey = key([q, r]);
    const val = newBoard.get(fromKey);

    const [nq, nr] = add([q, r], dir);
    const toKey = key([nq, nr]);

    if (newBoard.has(toKey)) {
      newBoard.set(toKey, val);
    }
    // sinon : bille poussée hors plateau

    newBoard.set(fromKey, ".");
  }

  return newBoard;
}

/* ===================== Helpers ===================== */

function areAligned(marbles) {
  if (marbles.length <= 1) return true;

  const [[q0, r0], [q1, r1]] = marbles;
  const dq = q1 - q0;
  const dr = r1 - r0;

  for (let i = 2; i < marbles.length; i++) {
    const [qi, ri] = marbles[i];
    const dqi = qi - q0;
    const dri = ri - r0;

    if (dq * dri !== dr * dqi) return false;
  }

  return true;
}

function isInline(marbles, dir) {
  if (marbles.length <= 1) return true;

  const [dq, dr] = dir;
  const [[q0, r0], [q1, r1]] = marbles;
  const vq = q1 - q0;
  const vr = r1 - r0;

  return dq * vr === dr * vq;
}

function sortMarblesAlongDir(marbles, dir) {
  const [dq, dr] = dir;
  return [...marbles].sort(([q1, r1], [q2, r2]) => {
    const p1 = q1 * dq + r1 * dr;
    const p2 = q2 * dq + r2 * dr;
    return p2 - p1; // plus "en avant" d'abord
  });
}
