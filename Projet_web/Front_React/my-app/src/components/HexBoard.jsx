import HexCell from "./HexCell";

export default function HexBoard({ board }) {
  if (!Array.isArray(board)) return null;

  const size = 28;

  // Convertir toutes les coordonnées en pixels
  const pixelCoords = board.map(([key, value]) => {
    const [q, r] = key.split(",").map(Number);

    const x = size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
    const y = size * (1.5 * r);

    return { key, value, x, y };
  });

  // Trouver les bornes
  const minX = Math.min(...pixelCoords.map(c => c.x));
  const maxX = Math.max(...pixelCoords.map(c => c.x));
  const minY = Math.min(...pixelCoords.map(c => c.y));
  const maxY = Math.max(...pixelCoords.map(c => c.y));

  const width = 900;
  const height = 700;

  const offsetX = width / 2 - (minX + maxX) / 2;
  const offsetY = height / 2 - (minY + maxY) / 2;

  return (
    <svg width={width} height={height} style={{ background: "#ddd" }}>
      {pixelCoords.map(({ key, value, x, y }) => (
        <HexCell
          key={key}
          x={x + offsetX}
          y={y + offsetY}
          value={value}
        />
      ))}
    </svg>
  );
}
