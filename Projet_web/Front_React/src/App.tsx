import { useEffect, useState } from "react";

function App() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/board/1")
      .then(res => res.json())
      .then(data => {
        if (!data || !data.board) return;

        const parsed = JSON.parse(data.board); // <-- IMPORTANT
        setBoard(parsed);
      });
  }, []);

  return (
    <div>
      <h1>Abalone — Test Plateau</h1>

      {!board && <p>Chargement...</p>}

      {board && (
        <ul>
          {Object.entries(board).map(([pos, value]) => (
            <li key={pos}>
              <strong>{pos}</strong> : {value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
