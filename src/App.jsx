import { useGame } from './hooks/useGame';
import { GameBoard } from './components/GameBoard';
import { ScoreBoard } from './components/ScoreBoard';
import { NextTetromino } from './components/NextTetromino';
import { Controls } from './components/Controls';

function App() {
  const {
    field,
    currentTetromino,
    currentPosition,
    nextTetromino,
    score,
    topScores,
    timeLeft,
    gameOver,
    resetGame,
    ROWS,
    COLS,
    BLOCK_SIZE
  } = useGame();

  return (
    <div className="app">
      <ScoreBoard topScores={topScores} score={score} onRestart={resetGame} />
      
      <div className="game-area">
        <div id="timer">Time: {timeLeft}</div>
        <GameBoard
          field={field}
          currentTetromino={currentTetromino}
          currentPosition={currentPosition}
          blockSize={BLOCK_SIZE}
          rows={ROWS}
          cols={COLS}
        />
        {gameOver && (
          <div id="game-over-message">
            Game Over! Final Score: {score}
          </div>
        )}
        <div id="score">Score: {score}</div>
      </div>

      <NextTetromino tetromino={nextTetromino} />
      <Controls />
    </div>
  );
}

export default App;
