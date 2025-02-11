// Factory function for gameboard, initiatializes board and marks cell
function GameBoard() {
    const size = 3;
    const board = [];

    const resetBoard = () => {
        for (let i = 0; i < size; i++) {
            board[i] = [];
            for (let j = 0; j < size; j++) {
                board[i][j] = "";
            }
        }
    }

    const getBoard = () => {
        return board;
    }

    const markCell = (row, col, player) => {
        board[row][col] = player.symbol;
    }

    resetBoard(); // To create initial board

    return { getBoard, markCell, resetBoard };
}

// Factory function for player, creates player object
function Player(id, name, symbol) {
    let win = 0;
    const addWin = () => {
        win++;
    }

    const getWin = () => {
        return win;
    }
    return { id, name, symbol, addWin, getWin };
}

// Factory function for game
function GameController(name1, name2) {
    const board = GameBoard();
    const player1 = Player(1, name1 || "Player 1", "X");
    const player2 = Player(2, name2 || "Player 2", "O");
    const turnDiv = document.querySelector(".turn");
    const player1score = document.querySelector(".player1 .score");
    const drawscore = document.querySelector(".draw .score");
    const player2score = document.querySelector(".player2 .score");

    let draw = 0;
    let activePlayer = player1.symbol == "X" ? player1 : player2;
    let turn = 1;

    const resetTurn = () => {
        turn = 1;
    }

    const switchPlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
        turnDiv.textContent = `${activePlayer.name}'s turn`;
        turn++;
    }

    const getActivePlayer = () => {
        return activePlayer;
    }

    const printTurn = () => {
        console.log(`${getActivePlayer().name}'s turn`);
        turnDiv.textContent = `${getActivePlayer().name}'s turn`;
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
        // Check if cell is empty
        if (board.getBoard()[row][col] !== "") {
            console.log("illegal move");
            return;
        }

        // mark cell
        board.markCell(row, col, getActivePlayer());
        printBoard();

        // check win and log winner
        if (checkWin(getActivePlayer().symbol)) {
            console.log(`${getActivePlayer().name} wins!`);
            getActivePlayer().addWin();
            getActivePlayer().id === 1 ? player1score.textContent = getActivePlayer().getWin() : player2score.textContent = getActivePlayer().getWin();
            board.resetBoard();
            resetTurn();
        }

        if (turn == Math.pow(board.getBoard().length, 2)) {
            console.log("Draw!");
            draw++;
            drawscore.textContent = draw;
            board.resetBoard();
            resetTurn();
        }
        
        switchPlayer();
        printTurn();
    }

    return { playRound, getActivePlayer, getBoard: board.getBoard, resetBoard: board.resetBoard };
}

function ScreenController() {
    const startScreen = document.querySelector(".start-screen");
    const boardDiv = document.querySelector(".board");
    const restart = document.querySelector(".restart");
    const newGame = document.querySelector(".new-game");

    const game = GameController();

    // events for game startup

    const createBoard = () => {
        for (let i = 0; i < game.getBoard().length; i++) {
            for (let j = 0; j < game.getBoard().length; j++) {
                cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = i;
                cell.dataset.col = j;
                boardDiv.appendChild(cell);
            }
        }
    }
    
    const startDialog = () => {
        startScreen.showModal();
        const form = startScreen.querySelector("form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const player1 = document.querySelector("#player1").value;
            const player2 = document.querySelector("#player2").value;
            startScreen.close();
            resetResult();
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        startDialog();
        createBoard();
    });

    newGame.addEventListener("click", () => {
        startDialog();
        resetGameBoard();
    })

    // event for info buttons
    const updateGameBoard = () => {
        const matrix = game.getBoard();
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix.length; j++) {
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                cell.classList.remove("X", "O");
                if(matrix[i][j]) cell.classList.add(matrix[i][j]);
            }
        }
    }
    
    const resetGameBoard = () => {
        game.resetBoard();
        updateGameBoard();
    }

    const resetResult = () => {
        const player1ResultName = document.querySelector(".player1 .name");
        const player2ResultName = document.querySelector(".player2 .name");
        player1ResultName.textContent = game.getActivePlayer().name;
        player2ResultName.textContent = game.getActivePlayer().name;
        const player1ResultScore = document.querySelector(".player1 .score");
        const player2ResultScore = document.querySelector(".player2 .score");
        player1ResultScore.textContent = 0;
        player2ResultScore.textContent = 0;
        document.querySelector(".draw .score").textContent = 0;
    }

    restart.addEventListener("click", () => {
        resetGameBoard();
    });
    
    boardDiv.addEventListener("click", (e) => {
        if (e.target.classList.contains("cell")) {
            game.playRound(e.target.dataset.row, e.target.dataset.col);
            updateGameBoard();
        }
    });
}

ScreenController();