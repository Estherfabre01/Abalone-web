import "../global.css";

export default function GameHeader({
  currentPlayer,
  userId,
  playerColor,
  player1Id,
  player2Id,
  scoreP1,
  scoreP2,
  player1Name,
  player2Name
}) {
  const isYourTurn = currentPlayer === userId;

  return (
    <div className="game-header">

      {/* Gauche : statut du tour */}
      <div className="game-header-left">
        <div
          className={`turn-indicator ${isYourTurn ? "turn-green" : "turn-red"}`}
        />

        <h2 style={{ margin: 0 }}>
          {isYourTurn ? "À toi de jouer" : `Tour de ${currentPlayer}`}
        </h2>
      </div>

      {/* Droite : scores */}
      <div className="game-score-box">
        <div className="game-score-item">
          <strong>{player1Name} (Noir)</strong>
          <span>{scoreP1}</span>
        </div>

        <div className="game-score-item">
          <strong>{player2Name} (Blanc)</strong>
          <span>{scoreP2}</span>
        </div>
      </div>

    </div>
  );
}
