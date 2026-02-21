import { useEffect, useRef } from 'react';

const drawBlock = (ctx, x, y, size, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x + 1, y + 1, size - 2, size - 2);

  // ハイライト（上・左）
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(x + 1, y + 1, size - 2, 3);
  ctx.fillRect(x + 1, y + 1, 3, size - 2);

  // シャドウ（下・右）
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(x + 1, y + size - 4, size - 2, 3);
  ctx.fillRect(x + size - 4, y + 1, 3, size - 2);
};

export const GameBoard = ({
  field,
  currentTetromino,
  currentPosition,
  blockSize,
  rows,
  cols,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // グリッド線
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 0.5;
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * blockSize);
      ctx.lineTo(cols * blockSize, r * blockSize);
      ctx.stroke();
    }
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * blockSize, 0);
      ctx.lineTo(c * blockSize, rows * blockSize);
      ctx.stroke();
    }

    // フィールド
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (field[r][c] !== 0) {
          drawBlock(ctx, c * blockSize, r * blockSize, blockSize, field[r][c]);
        }
      }
    }

    // 現在のテトロミノ
    if (currentTetromino) {
      currentTetromino.shape.forEach((row, r) => {
        row.forEach((value, c) => {
          if (value !== 0) {
            drawBlock(
              ctx,
              (currentPosition.x + c) * blockSize,
              (currentPosition.y + r) * blockSize,
              blockSize,
              currentTetromino.color
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
      className="game-canvas"
    />
  );
};