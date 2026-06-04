export default function HexCell({ x, y, value, selected, playable, onClick }) {
  const isMarble = value !== ".";
  const isBlack = value === "B";
  const isWhite = value === "W";

  const baseColor = isBlack ? "#222" : isWhite ? "#eee" : "transparent";
  const highlightColor = isBlack ? "#555" : "#fff";

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: isMarble ? "pointer" : "default" }}
    >
      {/* --- CASE VIDE (trou) --- */}
      {!isMarble && (
        <>
          <circle
            cx={0}
            cy={0}
            r={18}
            fill="transparent"
            stroke="#bbb"
            strokeWidth={2}
          />

          <circle
            cx={0}
            cy={2}
            r={14}
            fill="rgba(0,0,0,0.25)"
            style={{ filter: "blur(3px)" }}
          />
        </>
      )}

      {/* --- BILLE --- */}
      {isMarble && (
        <>
          {/* Ombre */}
          <circle
            cx={2}
            cy={4}
            r={18}
            fill="rgba(0,0,0,0.35)"
            style={{ filter: "blur(4px)" }}
          />

          {/* Corps de la bille */}
          <circle
            cx={0}
            cy={0}
            r={18}
            fill={baseColor}
            stroke="#000"
            strokeWidth={1.5}
          />

          {/* Reflet */}
          <circle
            cx={-6}
            cy={-6}
            r={7}
            fill={highlightColor}
            opacity={0.4}
          />
        </>
      )}

      {/* --- HIGHLIGHT SI SÉLECTIONNÉE --- */}
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

      {/* --- HIGHLIGHT SI JOUABLE (ex: directions possibles) --- */}
      {playable && !selected && (
        <circle
          cx={0}
          cy={0}
          r={22}
          stroke="cyan"
          strokeWidth={2}
          fill="transparent"
          opacity={0.7}
        />
      )}
    </g>
  );
}
