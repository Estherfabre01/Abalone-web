export default function HexCell({ x, y, value }) {
  const color = value === "B" ? "#222" : "#eee";
  const highlight = value === "B" ? "#555" : "#fff";

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* CREUX */}
      {value === "." && (
        <>
          <circle
            cx={0}
            cy={0}
            r={18}
            fill="transparent"
            stroke="#ccc"
            strokeWidth={2}
          />

          <circle
            cx={0}
            cy={2}
            r={14}
            fill="rgba(0,0,0,0.25)"
            style={{
              filter: "blur(3px)"
            }}
          />
        </>
      )}

      {/* BILLE */}
      {value !== "." && (
        <>
          <circle
            cx={0}
            cy={0}
            r={18}
            fill={color}
            stroke="#000"
            strokeWidth={1.5}
            style={{
              filter: "drop-shadow(2px 4px 4px rgba(0,0,0,0.4))"
            }}
          />
          <circle
            cx={-6}
            cy={-6}
            r={7}
            fill={highlight}
            opacity={0.4}
          />
        </>
      )}
    </g>
  );
}
