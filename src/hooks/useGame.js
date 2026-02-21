import { useState, useEffect, useCallback, useRef } from 'react';
import { useTetromino } from './useTetromino';
import { useTimer } from './useTimer';

export const ROWS = Number(import.meta.env.VITE_ROWS) || 15;
export const COLS = Number(import.meta.env.VITE_COLS) || 10;
export const BLOCK_SIZE = Number(import.meta.env.VITE_BLOCK_SIZE) || 30;
const FALL_INTERVAL = Number(import.meta.env.VITE_FALL_INTERVAL) || 400;
const GAME_TIME = Number(import.meta.env.VITE_GAME_TIME) || 100;

export const useGame = () => {
  const [field, setField] = useState(() =>
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const [score, setScore] = useState(0);
  const [topScores, setTopScores] = useState([0, 0, 0]);
  const [gameOver, setGameOver] = useState(false);

  const {
    currentTetromino,
    currentPosition,
    nextTetromino,
    generateNew,
    move,
    setPosition,
    rotate: rotateTetromino,
    reset: resetTetromino,
  } = useTetromino(ROWS, COLS);

  const handleTimeUp = useCallback(() => {
    setGameOver(true);
  }, []);

  const {
    timeLeft,
    reset: resetTimer,
    pause: pauseTimer,
  } = useTimer(GAME_TIME, handleTimeUp);

  const gameLoopRef = useRef(null);

  const isValidMove = useCallback(
    (offsetX, offsetY, shape, position = currentPosition) => {
      if (!shape) return false;

      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c] !== 0) {
            const newX = position.x + c + offsetX;
            const newY = position.y + r + offsetY;

            if (newX < 0 || newX >= COLS || newY >= ROWS) return false;
            if (newY >= 0 && field[newY][newX] !== 0) return false;
          }
        }
      }
      return true;
    },
    [field, currentPosition]
  );

  const fixTetromino = useCallback(() => {
    if (!currentTetromino) return;

    setField((prev) => {
      const newField = prev.map((row) => [...row]);
      currentTetromino.shape.forEach((row, r) => {
        row.forEach((value, c) => {
          if (value !== 0) {
            const x = currentPosition.x + c;
            const y = currentPosition.y + r;
            if (y >= 0) newField[y][x] = currentTetromino.color;
          }
        });
      });
      return newField;
    });
  }, [currentTetromino, currentPosition]);

  const removeFullRows = useCallback(() => {
    setField((prev) => {
      const newField = [...prev];
      const rowsToRemove = [];

      for (let r = 0; r < ROWS; r++) {
        if (newField[r].every((cell) => cell !== 0)) {
          rowsToRemove.push(r);
        }
      }

      rowsToRemove.forEach((rowIndex) => {
        newField.splice(rowIndex, 1);
        newField.unshift(Array(COLS).fill(0));
      });

      if (rowsToRemove.length > 0) {
        setScore((prev) => prev + rowsToRemove.length);
      }

      return newField;
    });
  }, []);

  const updateTopScores = useCallback((newScore) => {
    setTopScores((prev) => {
      const updated = [...prev, newScore].sort((a, b) => b - a).slice(0, 3);
      return updated;
    });
  }, []);

  useEffect(() => {
    if (gameOver) {
      updateTopScores(score);
    }
  }, [gameOver, score, updateTopScores]);

  const moveTetromino = useCallback(
    (direction) => {
      if (gameOver || !currentTetromino) return;

      const offsetX = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
      const offsetY = direction === 'down' ? 1 : 0;

      if (isValidMove(offsetX, offsetY, currentTetromino.shape)) {
        move(offsetX, offsetY);
      } else if (direction === 'down') {
        fixTetromino();
        removeFullRows();
        const newTetromino = generateNew();
        if (
          newTetromino &&
          !isValidMove(0, 0, newTetromino.tetromino.shape, newTetromino.position)
        ) {
          setGameOver(true);
          pauseTimer();
        }
      }
    },
    [
      gameOver,
      currentTetromino,
      isValidMove,
      move,
      fixTetromino,
      removeFullRows,
      generateNew,
      pauseTimer,
    ]
  );

  const rotate = useCallback(() => {
    if (gameOver || !currentTetromino) return;

    const newShape = currentTetromino.shape[0].map((_, index) =>
      currentTetromino.shape.map((row) => row[index]).reverse()
    );

    if (isValidMove(0, 0, newShape)) {
      rotateTetromino();
    }
  }, [gameOver, currentTetromino, isValidMove, rotateTetromino]);

  const resetGame = useCallback(() => {
    setField(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setScore(0);
    setGameOver(false);
    resetTimer();
    resetTetromino();
    setTimeout(() => {
      const newTetromino = generateNew();
      if (
        newTetromino &&
        !isValidMove(0, 0, newTetromino.tetromino.shape, newTetromino.position)
      ) {
        setGameOver(true);
      }
    }, 0);
  }, [resetTimer, resetTetromino, generateNew, isValidMove]);

  // ゲームループ
  useEffect(() => {
    if (!gameOver && currentTetromino) {
      gameLoopRef.current = setInterval(() => {
        moveTetromino('down');
      }, FALL_INTERVAL);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameOver, currentTetromino, moveTetromino]);

  // キーボード入力
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (event.key === 'r' || event.key === 'R') &&
        (event.ctrlKey || event.metaKey)
      ) {
        event.preventDefault();
        return;
      }
      if (gameOver) return;

      switch (event.key) {
        case 'ArrowLeft':
          moveTetromino('left');
          break;
        case 'ArrowRight':
          moveTetromino('right');
          break;
        case 'ArrowDown':
          moveTetromino('down');
          break;
        case 'ArrowUp':
          rotate();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, moveTetromino, rotate]);

  // 初期化
  useEffect(() => {
    if (!currentTetromino) {
      const newTetromino = generateNew();
      if (
        newTetromino &&
        !isValidMove(0, 0, newTetromino.tetromino.shape, newTetromino.position)
      ) {
        setGameOver(true);
      }
    }
  }, [currentTetromino, generateNew, isValidMove]);

  return {
    field,
    currentTetromino,
    currentPosition,
    nextTetromino,
    score,
    topScores,
    timeLeft,
    gameOver,
    moveTetromino,
    rotate,
    resetGame,
    ROWS,
    COLS,
    BLOCK_SIZE,
  };
};
