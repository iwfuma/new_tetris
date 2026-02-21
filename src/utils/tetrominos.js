export const TETROMINOS = [
  { shape: [[1, 1, 1, 1]], color: 'cyan' },  // 縦長
  { shape: [[1, 1], [1, 1]], color: 'yellow' },  // 正方形
  { shape: [[0, 1, 0], [1, 1, 1]], color: 'purple' },  // T字
  { shape: [[1, 0, 0], [1, 1, 1]], color: 'orange' },  // 逆L字
  { shape: [[0, 0, 1], [1, 1, 1]], color: 'blue' },   // L字
  { shape: [[1, 1, 0], [0, 1, 1]], color: 'green' },  // Z字
  { shape: [[0, 1, 1], [1, 1, 0]], color: 'red' },  // 逆Z字
];

export const getRandomTetromino = (previousColor = null) => {
  let index;
  do {
    index = Math.floor(Math.random() * TETROMINOS.length);
  } while (TETROMINOS[index].color === previousColor);
  
  return {
    ...TETROMINOS[index],
    shape: TETROMINOS[index].shape.map(row => [...row])
  };
};
