import { useGame } from './hooks/useGame';
import { GameBoard } from './components/GameBoard';
import { ScoreBoard } from './components/ScoreBoard';
import { NextTetromino } from './components/NextTetromino';
import { Controls } from './components/Controls';
import { Timer } from './components/Timer';
import { GameOver } from './components/GameOver';

const App = () => {
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
    BLOCK_SIZE,
  } = useGame();

  return (
    <div className="app">
      <h1 className="app-title">TETRIS</h1>

      <div className="main-area">
        {/* 左パネル：スコアボード */}
        <div className="left-panel">
          <ScoreBoard
            topScores={topScores}
            score={score}
            onRestart={resetGame}
          />
        </div>

        {/* 中央パネル：ゲームエリア */}
        <div className="center-panel">
          <Timer timeLeft={timeLeft} />
          <GameBoard
            field={field}
            currentTetromino={currentTetromino}
            currentPosition={currentPosition}
            blockSize={BLOCK_SIZE}
            rows={ROWS}
            cols={COLS}
          />
          {gameOver && <GameOver score={score} />}
          <p className="score-display">
            Score: <span>{score}</span>
          </p>
        </div>

        {/* 右パネル：ネクスト・操作説明 */}
        <div className="right-panel">
          <NextTetromino tetromino={nextTetromino} />
          <Controls />
        </div>
      </div>
    </div>
  );
};

export default App;