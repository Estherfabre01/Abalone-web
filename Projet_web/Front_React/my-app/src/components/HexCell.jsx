export default function HexCell({ x, y, value, selected, onClick }) {
  const isMarble = value !== ".";
  const color = value === "B" ? "#222" : "#eee";
  const highlight = value === "B" ? "#555" : "#fff";

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: isMarble ? "pointer" : "default" }}
    >
      {/* Trou */}
      {!isMarble && (
        <>
          <circle cx={0} cy={0} r={18} fill="transparent" stroke="#ccc" strokeWidth={2} />
          <circle cx={0} cy={2} r={14} fill="rgba(0,0,0,0.25)" />
        </>
      )}

      {/* Bille */}
      {isMarble && (
        <>
          <circle cx={0} cy={0} r={18} fill={color} stroke="#000" strokeWidth={1.5} />
          <circle cx={-6} cy={-6} r={7} fill={highlight} opacity={0.4} />
        </>
      )}

      {/* Sélection */}
      {selected && (
        <circle
          cx={0}
          cy={0}
          r={22}
          stroke="yellow"
          strokeWidth={3}
          fill="transparent"
        />
      )}
    </g>
  );
}
