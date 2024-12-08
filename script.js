const canvas = document.getElementById('tetris-canvas');
const context = canvas.getContext('2d');



const ROWS = 15; 
const COLS = 10;
const BLOCK_SIZE = 30;
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

document.addEventListener('keydown', function (event) {
    // Detect Cmd+R (Mac) or Ctrl+R (Windows/Linux)
    const isReloadShortcut = (event.key === 'r' || event.key === 'R') && (event.ctrlKey || event.metaKey);
    
    if (isReloadShortcut) {
        event.preventDefault(); // Block the default reload behavior
        alert('Reloading via shortcut is disabled.'); // Optional: notify the user
        console.log('Cmd+R or Ctrl+R was blocked.');
    }
});

let previousTetromino = null; // 直前のテトリスブロックを記録

let nextTetromino = null; //次のブロックを生成

// ゲームオーバー状態
let gameOver = false;

// スコア
let score = 0;

// トップ3のスコアを保持
let topScores = [0, 0, 0]; 

// テトリスのフィールド
let field = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// テトリスのブロックの定義と色
const TETROMINOS = [
    { shape: [[1, 1, 1, 1]], color: 'cyan' },      
    { shape: [[1, 1], [1, 1]], color: 'yellow' },  
    { shape: [[0, 1, 0], [1, 1, 1]], color: 'purple' },
    { shape: [[1, 0, 0], [1, 1, 1]], color: 'orange' },
    { shape: [[0, 0, 1], [1, 1, 1]], color: 'blue' },   
    { shape: [[1, 1, 0], [0, 1, 1]], color: 'green' },
    { shape: [[0, 1, 1], [1, 1, 0]], color: 'red' },
];

let currentTetromino;
let currentPosition;

// テトリスの描画
function draw() {
    if (gameOver) return;  // ゲームオーバー時は描画を停止

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawField();
    drawTetromino();
}

// フィールドを描画
function drawField() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (field[r][c] !== 0) {
                context.fillStyle = field[r][c];
                context.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

// テトリスのブロックを描画
function drawTetromino() {
    currentTetromino.shape.forEach((row, r) => {
        row.forEach((value, c) => {
            if (value !== 0) {
                context.fillStyle = currentTetromino.color;
                context.fillRect((currentPosition.x + c) * BLOCK_SIZE, (currentPosition.y + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeRect((currentPosition.x + c) * BLOCK_SIZE, (currentPosition.y + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

// 新しいテトリスのブロックを生成
function newTetromino() {
    if (gameOver) return;

    if (!nextTetromino) {
        const index = getRandomTetrominoIndex();
        nextTetromino = {
            shape: TETROMINOS[index].shape,
            color: TETROMINOS[index].color,
        };
    }

    currentTetromino = nextTetromino;
    nextTetromino = null;  // 次のテトリスブロックを更新するために次に生成

    // 次のテトリスブロックを生成
    const index = getRandomTetrominoIndex();
    nextTetromino = {
        shape: TETROMINOS[index].shape,
        color: TETROMINOS[index].color,
    };

    currentPosition = { x: Math.floor(COLS / 2) - Math.floor(currentTetromino.shape[0].length / 2), y: 0 };

    if (!isValidMove(0, 0, currentTetromino.shape)) {
        gameOver = true;
        showResult();
    }
}

// ランダムにテトリスブロックのインデックスを生成する関数
function getRandomTetrominoIndex() {
    let index;
    do {
        index = Math.floor(Math.random() * TETROMINOS.length);
    } while (TETROMINOS[index].color === previousTetromino?.color); // 直前のブロックと同じ色を避ける
    previousTetromino = TETROMINOS[index]; // 生成したブロックを記録
    return index;
}


function drawNextTetromino() {
    const nextTetrominoElement = document.getElementById('next-tetromino');
    nextTetrominoElement.innerHTML = ''; // 既存の内容をクリア

    const shape = nextTetromino.shape;
    const blockSize = 30; // 各ブロックのサイズ

    shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (cell !== 0) {
                const block = document.createElement('div');
                block.style.width = `${blockSize}px`;
                block.style.height = `${blockSize}px`;
                block.style.backgroundColor = nextTetromino.color;
                block.style.position = 'absolute';
                block.style.top = `${r * blockSize}px`;
                block.style.left = `${c * blockSize}px`;
                block.style.border = '1px solid #000'; // 枠線を追加
                nextTetrominoElement.appendChild(block);
            }
        });
    });
}



// 移動できるかチェック
function isValidMove(offsetX, offsetY, shape) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] !== 0) {
                const newX = currentPosition.x + c + offsetX;
                const newY = currentPosition.y + r + offsetY;

                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return false;
                }

                if (newY >= 0 && field[newY][newX] !== 0) {
                    return false;
                }
            }
        }
    }
    return true;
}

// ブロックを移動する関数
function moveTetromino(direction) {
    if (gameOver) return;  // ゲームオーバー時には移動を停止

    let offsetX = 0;
    let offsetY = 0;

    if (direction === 'left') {
        offsetX = -1;
    } else if (direction === 'right') {
        offsetX = 1;
    } else if (direction === 'down') {
        offsetY = 1;
    }

    if (isValidMove(offsetX, offsetY, currentTetromino.shape)) {
        currentPosition.x += offsetX;
        currentPosition.y += offsetY;
    } else if (direction === 'down') {
        fixTetromino(); // ブロックをフィールドに固定
        removeFullRows(); // 行を削除
        newTetromino(); // 新しいブロックを生成
    }
}

// ブロックをフィールドに固定する関数
function fixTetromino() {
    currentTetromino.shape.forEach((row, r) => {
        row.forEach((value, c) => {
            if (value !== 0) {
                const x = currentPosition.x + c;
                const y = currentPosition.y + r;
                if (y >= 0) {
                    field[y][x] = currentTetromino.color;
                }
            }
        });
    });
}

function removeFullRows() {
    let rowsToRemove = [];

    // フィールド内の全行をチェック
    for (let r = 0; r < ROWS; r++) {  // 上から順にチェック
        if (field[r].every(cell => cell !== 0)) { // 行がすべて埋まっている場合
            rowsToRemove.push(r);  // 削除する行を記録
        }
    }

    // 削除対象の行をすべて削除
    // 行を削除する際には、上から順に削除し、新しい空行を先頭に追加
    rowsToRemove.forEach(rowIndex => {
        field.splice(rowIndex, 1); // 行を削除
        field.unshift(Array(COLS).fill(0)); // 新しい空行を先頭に追加
    });

    // スコアを削除行数分だけ1増加
    score += rowsToRemove.length; // 行ごとに1ポイント加算

    // スコアを表示（もし表示が必要な場合）
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `Score: ${score}`;
    }
}





// テトリスのブロックを回転する関数
function rotateTetromino() {
    if (gameOver) return;  // ゲームオーバー時に回転を停止

    const newShape = currentTetromino.shape[0].map((_, index) => currentTetromino.shape.map(row => row[index]).reverse());

    if (isValidMove(0, 0, newShape)) {
        currentTetromino.shape = newShape;
    }
}

// タイマー
let timeLeft = 100;
const timerElement = document.getElementById('timer');

// タイマーを更新する関数
function updateTimer() {
    if (gameOver) return;  // ゲームオーバー時にタイマーを停止

    if (timeLeft > 0) {
        timeLeft--;
        timerElement.textContent = `Time: ${timeLeft}`;
    } else {
        gameOver = true;  // ゲームオーバー
        showResult();  // 結果表示
    }
}


// 結果を表示する関数
function showResult() {
    const resultMessage = `Game Over! Final Score: ${score}`;
    const messageElement = document.getElementById('game-over-message');
    messageElement.textContent = resultMessage;
    messageElement.style.display = 'block';

    updateTopScores(score); // トップスコアを更新
}


function updateTopScores(newScore) {
    // 新しいスコアを追加してソート
    topScores.push(newScore);
    topScores.sort((a, b) => b - a);
    topScores = topScores.slice(0, 3); // トップ3のみを保持

    // スコアボードを更新
    const topScoresElement = document.getElementById('top-scores');
    topScoresElement.innerHTML = `
        <li>1st: ${topScores[0]}</li>
        <li>2nd: ${topScores[1]}</li>
        <li>3rd: ${topScores[2]}</li>
    `;
}



// キーボード入力を処理
document.addEventListener('keydown', (event) => {
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
            rotateTetromino();
            break;
        case ' ':
            fastDrop = true;  // スペースキーを押したとき、速く落下させる
            dropInterval = 100;  // 落下速度を速くする
            break;
    }
    draw();
});


function resetGame() {
    // フィールドをクリア
    field = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    
    // スコアをリセット
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;
    
    // ゲームオーバーフラグをリセット
    gameOver = false;
    document.getElementById('game-over-message').style.display = 'none';
    
    // タイマーをリセット
    timeLeft = 100;
    document.getElementById('timer').textContent = `Time: ${timeLeft}`;
    
    // 新しいテトリスブロックを生成して描画
    init();
}

document.getElementById('restart-button').addEventListener('click', resetGame);


// ゲームの初期化
function init() {
    score = 0;
    updateTopScores(0); // スコアボードを初期化
    newTetromino();
    draw();
}


// ゲームのループ
function gameLoop() {
    if (!gameOver) {
        moveTetromino('down');
        draw();
        drawNextTetromino(); // 次のブロックを表示
    }
}


// ゲーム開始
init();
setInterval(updateTimer, 1000);
setInterval(gameLoop, 400);//落下速度調整

