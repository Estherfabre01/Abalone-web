import { useState } from "react";
import HexCell from "./HexCell";

export default function HexBoard({ board, onSelect }) {
  const [selected, setSelected] = useState(null);

  if (!Array.isArray(board)) return null;

  const size = 28;

  const pixelCoords = board.map(([key, value]) => {
    const [q, r] = key.split(",").map(Number);

    const x = size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
    const y = size * (1.5 * r);

    return { key, value, x, y };
  });

  const minX = Math.min(...pixelCoords.map(c => c.x));
  const maxX = Math.max(...pixelCoords.map(c => c.x));
  const minY = Math.min(...pixelCoords.map(c => c.y));
  const maxY = Math.max(...pixelCoords.map(c => c.y));

  const width = 900;
  const height = 700;

  const offsetX = width / 2 - (minX + maxX) / 2;
  const offsetY = height / 2 - (minY + maxY) / 2;

  function handleClick(key, value) {
    if (value === ".") return;

    setSelected(key);
    onSelect(key);
  }

  return (
    <svg width={width} height={height} style={{ background: "#ddd" }}>
      {pixelCoords.map(({ key, value, x, y }) => (
        <HexCell
          key={key}
          x={x + offsetX}
          y={y + offsetY}
          value={value}
          onClick={() => handleClick(key, value)}
        />
      ))}

      {/* Cercle de sélection */}
      {selected && (
        <circle
          cx={
            pixelCoords.find(c => c.key === selected).x + offsetX
          }
          cy={
            pixelCoords.find(c => c.key === selected).y + offsetY
          }
          r={22}
          stroke="yellow"
          strokeWidth={3}
          fill="transparent"
        />
      )}
    </svg>
  );
}
