import HexCell from "./HexCell";
import "../global.css";

export default function HexBoard({ board, selectedKey, onSelect }) {
  if (!Array.isArray(board)) return null;

  const size = 28;

  const pixelCoords = board
    .map(([key, value]) => {
      if (!key.includes(",")) return null;

      const [q, r] = key.split(",").map(Number);
      if (Number.isNaN(q) || Number.isNaN(r)) return null;

      const x = size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
      const y = size * (1.5 * r);

      return { key, value, x, y };
    })
    .filter(Boolean);

  if (pixelCoords.length === 0) return null;

  const minX = Math.min(...pixelCoords.map(c => c.x));
  const maxX = Math.max(...pixelCoords.map(c => c.x));
  const minY = Math.min(...pixelCoords.map(c => c.y));
  const maxY = Math.max(...pixelCoords.map(c => c.y));

  const width = 600;
  const height = 400;

  const offsetX = width / 2 - (minX + maxX) / 2;
  const offsetY = height / 2 - (minY + maxY) / 2;

  return (
    <svg width={width} height={height} className="hex-board">
      {pixelCoords.map(({ key, value, x, y }) => (
        <HexCell
          key={key}
          x={x + offsetX}
          y={y + offsetY}
          value={value}
          selected={selectedKey?.includes(key)}
          onClick={() => onSelect(key)}
        />
      ))}
    </svg>
  );
}
