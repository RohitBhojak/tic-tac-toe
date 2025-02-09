// Factory function for gameboard
function GameBoard() {
    const size = 3;
    const board = [];

    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i][j] = "";
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

function GameController(player1, player2) {
    const board = GameBoard();
    const player1 = Player(player1 || "Player 1", "X");
    const player2 = Player(player2 || "Player 2", "O");

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
        const board = board.getBoard();
        for (let i = 0; i < board.length; i++) {
            console.log(board[i].join(" | "));
        }
    }

    const checkWin = (symbol) => {
        const board = board.getBoard();
        const rows = board.every((row) => row.every((cell) => cell === symbol));
        const cols = board.every((col) => col.every((cell) => cell === symbol));
        const diagonal1 = board.every((row, i) => row[i] === symbol);
        const diagonal2 = board.every((row, i) => row[board.length - i - 1] === symbol);
        return rows || cols || diagonal1 || diagonal2;
    }

    const playRound = (row, col) => {
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