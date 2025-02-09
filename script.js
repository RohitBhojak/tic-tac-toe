// Factory function for gameboard
function GameBoard() {
    const size = 3;
    const board = [];

    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i][j] = " ";
        }
    }

    const getBoard = () => {
        return board;
    }

    const markCell = (row, col, player) => {
        board[row][col] = player.symbol;
    }

    return { getBoard, markCell };
}

function Player(name, symbol) {
    return { name, symbol };
}

function GameController(name1, name2) {
    const board = GameBoard();
    const player1 = Player(name1 || "Player 1", "X");
    const player2 = Player(name2 || "Player 2", "O");

    let activePlayer = player1;

    const switchPlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    }

    const getActivePlayer = () => {
        return activePlayer;
    }

    const printTurn = () => {
        console.log(`${getActivePlayer().name}'s turn`);
    }

    const printBoard = () => {
        const matrix = board.getBoard();
        for (let i = 0; i < matrix.length; i++) {
            console.log(matrix[i].join(" | "));
        }
    }

    const checkWin = (symbol) => {
        const matrix = board.getBoard();
        for (let i = 0; i < matrix.length; i++) {
            if (matrix[i].every(cell => cell === symbol)) {
                return true;
            }
            if (matrix.every(row => row[i] === symbol)) {
                return true;
            }
        }
        const diagonal1 = matrix.every((row, i) => row[i] === symbol);
        const diagonal2 = matrix.every((row, i) => row[matrix.length - i - 1] === symbol);
        return diagonal1 || diagonal2;
    }

    const playRound = (row, col) => {
        if (board.getBoard()[row][col] !== " ") {
            console.log("illegal move");
            return;
        }
        board.markCell(row, col, getActivePlayer());
        printBoard();
        if (checkWin(getActivePlayer().symbol)) {
            console.log(`${getActivePlayer().name} wins!`);
            return;
        }
        switchPlayer();
        printTurn();
    }

    return { playRound };
}

const game = GameController("Player 1", "Player 2");
game.playRound(0, 2);
game.playRound(1, 1);
game.playRound(0, 1);
game.playRound(1, 0);
game.playRound(0, 0);