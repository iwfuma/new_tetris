const canvas = document.getElementById('tetris-canvas');
const context = canvas.getContext('2d');

//ゲーム設定
const ROWS = 15; 
const COLS = 10;
const BLOCK_SIZE = 30;
canvas.width = COLS * BLOCK_SIZE;
canvas.height = ROWS * BLOCK_SIZE;

// cmd+R,ctrl+Rを禁止する
document.addEventListener('keydown', function (event) {
    // Cmd+R (Mac) or Ctrl+R (Windows/Linux)
    const isReloadShortcut = (event.key === 'r' || event.key === 'R') && (event.ctrlKey || event.metaKey);
    
    if (isReloadShortcut) {
        event.preventDefault(); // デフォルトのリロード動作をブロック
        alert('Reloading via shortcut is disabled.'); // ユーザーへの通知
        console.log('Cmd+R or Ctrl+R was blocked.');
    }
});

// リスタートボタン
document.getElementById('restart-button').addEventListener('click', resetGame);

// ゲーム状態管理
let previousTetromino = null; // 直前のテトリスブロックを記録
let nextTetromino = null; //次のブロックを生成
let gameOver = false; // ゲームオーバー状態
let score = 0; // スコア
let topScores = [0, 0, 0]; // トップ3のスコアを保持
let field = Array.from({ length: ROWS }, () => Array(COLS).fill(0));// テトリスのフィールド

// テトリスのブロックの定義と色
const TETROMINOS = [
    { shape: [[1, 1, 1, 1]], color: 'cyan' },  //縦長    
    { shape: [[1, 1], [1, 1]], color: 'yellow' },  //正方形
    { shape: [[0, 1, 0], [1, 1, 1]], color: 'purple' },  //T字
    { shape: [[1, 0, 0], [1, 1, 1]], color: 'orange' },  //逆L字
    { shape: [[0, 0, 1], [1, 1, 1]], color: 'blue' },   //L字
    { shape: [[1, 1, 0], [0, 1, 1]], color: 'green' },  //Z字
    { shape: [[0, 1, 1], [1, 1, 0]], color: 'red' },  //逆Z字
];

let currentTetromino;
let currentPosition;
//描画関連
// テトリスの描画
function draw() {
    // ゲームオーバー時は描画を停止
    if (gameOver) return;
    // キャンバスをクリア（前のフレームの描画を消去）
    context.clearRect(0, 0, canvas.width, canvas.height);
    // フィールドを描画
    drawField();
    // 現在のテトリスブロックを描画
    drawTetromino();
}


// フィールドを描画
function drawField() {
    // 行数（ROWS）をループ
    for (let r = 0; r < ROWS; r++) {
        // 列数（COLS）をループ
        for (let c = 0; c < COLS; c++) {
            // フィールドのセルにブロックが存在する場合（値が0でない）
            if (field[r][c] !== 0) {
                // セルの色を設定
                context.fillStyle = field[r][c];
                // セルを塗りつぶす
                context.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                // セルの枠線を描画
                context.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}


// テトリスのブロックを描画
function drawTetromino() {
    // 現在のテトリスブロックの形状を2D配列として繰り返し処理
    currentTetromino.shape.forEach((row, r) => {
        row.forEach((value, c) => {
            // セルの値が0でない場合、ブロックを描画
            if (value !== 0) {
                // ブロックの色を設定
                context.fillStyle = currentTetromino.color;
                // テトリスブロックを塗りつぶす
                context.fillRect((currentPosition.x + c) * BLOCK_SIZE, (currentPosition.y + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                // テトリスブロックの枠線を描画
                context.strokeRect((currentPosition.x + c) * BLOCK_SIZE, (currentPosition.y + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}


// 次のテトリスブロックの描画
function drawNextTetromino() {
    // 'next-tetromino' IDの要素を取得
    const nextTetrominoElement = document.getElementById('next-tetromino');
    nextTetrominoElement.innerHTML = ''; // 既存の内容をクリア（前回の描画を消去）

    const shape = nextTetromino.shape; // 次のテトリスブロックの形状を取得
    const blockSize = 30; // 各テトリスブロックのサイズ（ピクセル）

    // テトリスブロックの形状を2D配列として繰り返し処理
    shape.forEach((row, r) => {
        row.forEach((cell, c) => {
            // 0以外のセル（ブロックが存在する部分）に対して処理を行う
            if (cell !== 0) {
                // 新しいブロックのdiv要素を作成
                const block = document.createElement('div');
                block.style.width = `${blockSize}px`; // 幅を設定
                block.style.height = `${blockSize}px`; // 高さを設定
                block.style.backgroundColor = nextTetromino.color; // ブロックの色を設定
                block.style.position = 'absolute'; // 絶対位置で配置
                block.style.top = `${r * blockSize}px`; // 上位置を設定
                block.style.left = `${c * blockSize}px`; // 左位置を設定
                block.style.border = '1px solid #000'; // 枠線を追加（見やすくするため）
                nextTetrominoElement.appendChild(block); // 作成したブロックを親要素に追加
            }
        });
    });
}


//ロジック
// 新しいテトリスのブロックを生成
function newTetromino() {
    // ゲームオーバーの場合は何もしない
    if (gameOver) return;

    // 次のテトリスブロックがまだ設定されていない場合、新しいブロックを生成
    if (!nextTetromino) {
        const index = getRandomTetrominoIndex(); // ランダムにインデックスを取得
        nextTetromino = {
            shape: TETROMINOS[index].shape, // テトリスブロックの形を設定
            color: TETROMINOS[index].color, // テトリスブロックの色を設定
        };
    }

    // 現在のテトリスブロックに次のブロックを設定
    currentTetromino = nextTetromino;
    nextTetromino = null;  // 次のブロックを更新するためにnullに設定

    // 次のテトリスブロックをランダムに生成
    const index = getRandomTetrominoIndex(); // ランダムにインデックスを取得
    nextTetromino = {
        shape: TETROMINOS[index].shape, // 次のテトリスブロックの形を設定
        color: TETROMINOS[index].color, // 次のテトリスブロックの色を設定
    };

    // 現在のテトリスブロックの初期位置を設定
    currentPosition = { 
        x: Math.floor(COLS / 2) - Math.floor(currentTetromino.shape[0].length / 2), // 横の中心に配置
        y: 0 // 縦の最上部に配置
    };

    // 現在のテトリスブロックが最初に配置される位置で移動できるかをチェック
    if (!isValidMove(0, 0, currentTetromino.shape)) {
        // 移動できない場合はゲームオーバー
        gameOver = true;
        showResult(); // 結果を表示
    }
}


// ランダムにテトリスブロックのインデックスを生成
function getRandomTetrominoIndex() {
    let index;
    do {
        // TETROMINOS配列からランダムにインデックスを選ぶ
        index = Math.floor(Math.random() * TETROMINOS.length);
    } while (TETROMINOS[index].color === previousTetromino?.color); // 直前に生成されたブロックと同じ色を避けるため、色を比較
    // 生成したブロックをpreviousTetrominoとして記録（次回の比較に使用）
    previousTetromino = TETROMINOS[index];
    return index; // ランダムに選ばれたインデックスを返す
}


// 移動できるか確認
function isValidMove(offsetX, offsetY, shape) {
    // 現在のブロックの形状を走査
    for (let r = 0; r < shape.length; r++) { // 行を順に確認
        for (let c = 0; c < shape[r].length; c++) { // 列を順に確認
            if (shape[r][c] !== 0) { // ブロックの一部（値が0以外）である場合に判定を行う
                const newX = currentPosition.x + c + offsetX; // 移動後のX座標
                const newY = currentPosition.y + r + offsetY; // 移動後のY座標

                // フィールドの範囲外かを確認
                if (newX < 0 || newX >= COLS || newY >= ROWS) { 
                    return false; // 左端、右端、または下端を超えている場合は移動不可
                }

                // フィールド内のブロックと衝突しているかを確認
                if (newY >= 0 && field[newY][newX] !== 0) { 
                    return false; // 他のブロックに衝突する場合は移動不可
                }
            }
        }
    }
    return true; // 全ての条件を満たす場合は移動可能
}


// ブロックを移動
function moveTetromino(direction) {
    if (gameOver) return;  // ゲームオーバーの場合は処理を終了して移動を無効化

    // 移動量の初期化
    let offsetX = 0;  // 横方向の移動量
    let offsetY = 0;  // 縦方向の移動量

    // 移動方向に応じて移動量を設定
    if (direction === 'left') {
        offsetX = -1; // 左方向へ移動（X座標を-1）
    } else if (direction === 'right') {
        offsetX = 1;  // 右方向へ移動（X座標を+1）
    } else if (direction === 'down') {
        offsetY = 1;  // 下方向へ移動（Y座標を+1）
    }

    // 指定された方向への移動が有効かを確認
    if (isValidMove(offsetX, offsetY, currentTetromino.shape)) {
        // 有効な場合は現在の位置を更新
        currentPosition.x += offsetX;  // X座標を移動量分変更
        currentPosition.y += offsetY;  // Y座標を移動量分変更
    } else if (direction === 'down') {
        // 下方向の移動が無効な場合はブロックを固定する
        fixTetromino();  // 現在のブロックをフィールドに固定
        removeFullRows();  // 埋まった行を削除
        newTetromino();  // 新しいブロックを生成
    }
}


// ブロックの回転
function rotateTetromino() {
    // ゲームオーバー時に回転を停止
    if (gameOver) return;
    // 新しい回転形状を計算
    const newShape = currentTetromino.shape[0].map((_, index) => 
        currentTetromino.shape.map(row => row[index]).reverse()
    );
    // 新しい形状が有効かどうかを確認
    if (isValidMove(0, 0, newShape)) {
        // 回転が有効なら、現在のブロックの形状を更新
        currentTetromino.shape = newShape;
    }
}


// ブロックをフィールドに固定
function fixTetromino() {
    // 現在のテトリスブロックの形状をループ
    currentTetromino.shape.forEach((row, r) => {
        row.forEach((value, c) => {
            // ブロックが存在するセル（値が0でない場合）
            if (value !== 0) {
                // フィールド上のブロックの位置を計算
                const x = currentPosition.x + c;
                const y = currentPosition.y + r;
                // yが0以上の位置（画面内）であれば、フィールドにブロックを配置
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

// タイマー
let timeLeft = 100;
const timerElement = document.getElementById('timer');

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

// 結果を表示
function showResult() {
    const resultMessage = `Game Over! Final Score: ${score}`;
    const messageElement = document.getElementById('game-over-message');
    messageElement.textContent = resultMessage;
    messageElement.style.display = 'block';
    updateTopScores(score); // topスコア更新
}

//topスコアの更新
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

// キーボード入力
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
    }
    draw();
});

// ゲームリセット
function resetGame() {
    field = Array.from({ length: ROWS }, () => Array(COLS).fill(0)); // フィールドをクリア
    // スコアをリセット
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;
    // ゲームオーバーフラグをリセット
    gameOver = false;
    document.getElementById('game-over-message').style.display = 'none';
    // タイマーをリセット
    timeLeft = 100;
    document.getElementById('timer').textContent = `Time: ${timeLeft}`;
    init(); // 新しいテトリスブロックを生成して描画
}


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

