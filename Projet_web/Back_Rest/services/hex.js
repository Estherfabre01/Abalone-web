export const DIRECTIONS = {
  N:  [0, -1],
  NE: [1, -1],
  SE: [1, 0],
  S:  [0, 1],
  SW: [-1, 1],
  NW: [-1, 0]
};

export function add([q, r], [dq, dr]) {
  return [q + dq, r + dr];
}

export function eq([q1, r1], [q2, r2]) {
  return q1 === q2 && r1 === r2;
}

export function key([q, r]) {
  return `${q},${r}`;
}

export function parseKey(k) {
  const [q, r] = k.split(",").map(Number);
  return [q, r];
}
