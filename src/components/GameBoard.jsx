import { useEffect, useRef } from 'react';

export const GameBoard = ({ field, currentTetromino, currentPosition, blockSize, rows, cols }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // フィールドを描画
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (field[r][c] !== 0) {
          context.fillStyle = field[r][c];
          context.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);
          context.strokeRect(c * blockSize, r * blockSize, blockSize, blockSize);
        }
      }
    }

    // 現在のテトロミノを描画
    if (currentTetromino) {
      currentTetromino.shape.forEach((row, r) => {
        row.forEach((value, c) => {
          if (value !== 0) {
            context.fillStyle = currentTetromino.color;
            context.fillRect(
              (currentPosition.x + c) * blockSize,
              (currentPosition.y + r) * blockSize,
              blockSize,
              blockSize
            );
            context.strokeRect(
              (currentPosition.x + c) * blockSize,
              (currentPosition.y + r) * blockSize,
              blockSize,
              blockSize
            );
          }
        });
      });
    }
  }, [field, currentTetromino, currentPosition, blockSize, rows, cols]);

  return (
    <canvas
      ref={canvasRef}
      width={cols * blockSize}
      height={rows * blockSize}
      style={{
        border: '3px solid #555',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
      }}
    />
  );
};
