import { useState, useCallback } from 'react';
import { getRandomTetromino } from '../utils/tetrominos';

export const useTetromino = (rows, cols) => {
  const [currentTetromino, setCurrentTetromino] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [nextTetromino, setNextTetromino] = useState(null);
  const [previousColor, setPreviousColor] = useState(null);

  const generateNew = useCallback(() => {
    const newTetromino = nextTetromino || getRandomTetromino(previousColor);
    const next = getRandomTetromino(newTetromino.color);
    
    setPreviousColor(newTetromino.color);
    setCurrentTetromino(newTetromino);
    setNextTetromino(next);
    
    const initialX = Math.floor(cols / 2) - Math.floor(newTetromino.shape[0].length / 2);
    setCurrentPosition({ x: initialX, y: 0 });
    
    return { tetromino: newTetromino, position: { x: initialX, y: 0 } };
  }, [nextTetromino, previousColor, cols]);

  const move = useCallback((offsetX, offsetY) => {
    setCurrentPosition(prev => ({
      x: prev.x + offsetX,
      y: prev.y + offsetY
    }));
  }, []);

  const setPosition = useCallback((position) => {
    setCurrentPosition(position);
  }, []);

  const rotate = useCallback(() => {
    setCurrentTetromino(prev => {
      if (!prev) return prev;
      const newShape = prev.shape[0].map((_, index) =>
        prev.shape.map(row => row[index]).reverse()
      );
      return { ...prev, shape: newShape };
    });
  }, []);

  const reset = useCallback(() => {
    setCurrentTetromino(null);
    setCurrentPosition({ x: 0, y: 0 });
    setNextTetromino(null);
    setPreviousColor(null);
  }, []);

  return {
    currentTetromino,
    currentPosition,
    nextTetromino,
    generateNew,
    move,
    setPosition,
    rotate,
    reset
  };
};
