export const ScoreBoard = ({ topScores, score, onRestart }) => {
  const rankLabels = ['🥇 1st', '🥈 2nd', '🥉 3rd'];

  return (
    <div className="panel score-board">
      <p className="panel-title">Top Scores</p>
      <p className="score-current">{score}</p>
      <ol className="score-ranking">
        {rankLabels.map((label, i) => (
          <li key={i} className={`rank-${i + 1}`}>
            <span className="rank-label">{label}</span>
            <span className="rank-value">{topScores[i] ?? 0}</span>
          </li>
        ))}
      </ol>
      <button className="restart-button" onClick={onRestart}>
        Restart
      </button>
    </div>
  );
};