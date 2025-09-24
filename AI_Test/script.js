const boardElement = document.getElementById('board');
const currentPlayerElement = document.getElementById('current-player');
const blackScoreElement = document.getElementById('black-score');
const whiteScoreElement = document.getElementById('white-score');
const resetButton = document.getElementById('reset-button');

const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

let board = [];
let currentPlayer = BLACK;
let blackScore = 0;
let whiteScore = 0;

const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1]
];

function initializeBoard() {
    board = Array(8).fill(0).map(() => Array(8).fill(EMPTY));
    board[3][3] = WHITE;
    board[3][4] = BLACK;
    board[4][3] = BLACK;
    board[4][4] = WHITE;
    currentPlayer = BLACK;
    updateScores();
    renderBoard();
    updatePlayerDisplay();
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);

            if (board[r][c] === BLACK) {
                const piece = document.createElement('div');
                piece.classList.add('piece', 'black');
                cell.appendChild(piece);
            } else if (board[r][c] === WHITE) {
                const piece = document.createElement('div');
                piece.classList.add('piece', 'white');
                cell.appendChild(piece);
            }
            boardElement.appendChild(cell);
        }
    }
}

function updateScores() {
    blackScore = 0;
    whiteScore = 0;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === BLACK) {
                blackScore++;
            } else if (board[r][c] === WHITE) {
                whiteScore++;
            }
        }
    }
    blackScoreElement.textContent = blackScore;
    whiteScoreElement.textContent = whiteScore;
}

function updatePlayerDisplay() {
    currentPlayerElement.textContent = currentPlayer === BLACK ? '黒' : '白';
}

function isValidMove(row, col, player) {
    if (board[row][col] !== EMPTY) {
        return false;
    }

    const opponent = player === BLACK ? WHITE : BLACK;
    let canFlip = false;

    for (const [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;
        let path = [];

        while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === opponent) {
            path.push([r, c]);
            r += dr;
            c += dc;
        }

        if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === player && path.length > 0) {
            canFlip = true;
            break;
        }
    }
    return canFlip;
}

function getFlippablePieces(row, col, player) {
    const opponent = player === BLACK ? WHITE : BLACK;
    let flippable = [];

    for (const [dr, dc] of directions) {
        let r = row + dr;
        let c = col + dc;
        let path = [];

        while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === opponent) {
            path.push([r, c]);
            r += dr;
            c += dc;
        }

        if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] === player && path.length > 0) {
            flippable.push(...path);
        }
    }
    return flippable;
}

function makeMove(row, col, player) {
    const flippable = getFlippablePieces(row, col, player);
    if (flippable.length === 0) {
        return false;
    }

    board[row][col] = player;
    for (const [r, c] of flippable) {
        board[r][c] = player;
    }
    return true;
}

function switchPlayer() {
    currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
    updatePlayerDisplay();
}

function hasValidMoves(player) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (isValidMove(r, c, player)) {
                return true;
            }
        }
    }
    return false;
}

function checkGameOver() {
    if (!hasValidMoves(BLACK) && !hasValidMoves(WHITE)) {
        let winner = '';
        if (blackScore > whiteScore) {
            winner = '黒の勝ち！';
        } else if (whiteScore > blackScore) {
            winner = '白の勝ち！';
        } else {
            winner = '引き分け！';
        }
        alert('ゲーム終了！ ' + winner);
        return true;
    }
    return false;
}

function handleCellClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (isValidMove(row, col, currentPlayer)) {
        makeMove(row, col, currentPlayer);
        updateScores();
        renderBoard();

        if (checkGameOver()) {
            return;
        }

        switchPlayer();
        if (!hasValidMoves(currentPlayer)) {
            alert(currentPlayer === BLACK ? '黒はパス！' : '白はパス！');
            switchPlayer();
            if (checkGameOver()) {
                return;
            }
        }
    } else {
        alert('無効な手です。');
    }
}

resetButton.addEventListener('click', initializeBoard);

initializeBoard();
