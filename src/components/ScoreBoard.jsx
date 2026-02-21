export const ScoreBoard = ({ topScores, score, onRestart }) => {
  return (
    <div className="score-board">
      <h2>Top Scores</h2>
      <ol>
        <li>1st: {topScores[0]}</li>
        <li>2nd: {topScores[1]}</li>
        <li>3rd: {topScores[2]}</li>
      </ol>
      <button id="restart-button" onClick={onRestart}>
        Restart Game
      </button>
    </div>
  );
};
