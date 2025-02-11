// Factory function for gameboard, initiatializes board and marks cell
function GameBoard() {
    // variables
    const size = 3;
    const board = [];

    // method to reset board
    const resetBoard = () => {
        for (let i = 0; i < size; i++) {
            board[i] = [];
            for (let j = 0; j < size; j++) {
                board[i][j] = " ";
            }
        }
    }

    // method to get board
    const getBoard = () => {
        return board;
    }

    // method to mark cell
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
    // variables
    const board = GameBoard();
    const player1 = Player(1, name1 || "Player 1", "X");
    const player2 = Player(2, name2 || "Player 2", "O");
    const turnDiv = document.querySelector(".turn");
    const player1score = document.querySelector(".player1 .score");
    const drawscore = document.querySelector(".draw .score");
    const player2score = document.querySelector(".player2 .score");

    let draw = 0;
    let startingPlayer = player1;
    let activePlayer = startingPlayer;
    let turn = 0;

    // method to reset turn on new game
    const resetTurn = () => {
        turn = 0;
        activePlayer = startingPlayer; // Reset to Player 1 as the starting player
        turnDiv.textContent = `${activePlayer.name}'s turn`; // Update UI
    };

    // method to switch active player after every turn
    const switchPlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
        turnDiv.textContent = `${activePlayer.name}'s turn`;
    }

    // Method to toggle the starting player
    const toggleStartingPlayer = () => {
        startingPlayer = (startingPlayer === player1) ? player2 : player1;
        activePlayer = startingPlayer;
    };

    // method to get active player
    const getActivePlayer = () => {
        return activePlayer;
    }

    // method to print turn
    const printTurn = () => {
        console.log(`${turn}`);
        turnDiv.textContent = `${getActivePlayer().name}'s turn`;
    }

    // method to check win
    const checkWin = (symbol) => {
        const matrix = board.getBoard();
        for (let i = 0; i < matrix.length; i++) {
            // check for rows
            if (matrix[i].every(cell => cell === symbol)) {
                return true;
            }
            // check for columns
            if (matrix.every(row => row[i] === symbol)) {
                return true;
            }
        }
        // check for diagonalss
        const diagonal1 = matrix.every((row, i) => row[i] === symbol);
        const diagonal2 = matrix.every((row, i) => row[matrix.length - i - 1] === symbol);
        return diagonal1 || diagonal2;
    }

    // method to play round
    const playRound = (row, col) => {
        // method to show game over message
        const showGameOverMessage = (result) => {
            const endScreen = document.querySelector(".end-screen");
            endScreen.showModal();
            const message = endScreen.querySelector(".message");
            if (result === "draw") {
                message.textContent = "Draw";
            } else {
                message.textContent = `${getActivePlayer().name} wins`;
            }
            const ok = endScreen.querySelector(".ok");
            ok.addEventListener("click", () => {
                endScreen.close();
            });
        }

        // Check if cell is empty
        if (board.getBoard()[row][col] !== " ") {
            console.log("illegal move");
            return;
        }

        // mark cell
        board.markCell(row, col, getActivePlayer());
        turn++;

        // check win and update score
        if (checkWin(getActivePlayer().symbol)) {
            console.log(`${getActivePlayer().name} wins!`);
            showGameOverMessage("win");
            getActivePlayer().addWin();
            getActivePlayer().id === 1 ? player1score.textContent = getActivePlayer().getWin() : player2score.textContent = getActivePlayer().getWin();
            board.resetBoard();
            resetTurn();
        }

        // check draw and update score
        if (turn == Math.pow(board.getBoard().length, 2)) {
            console.log("Draw!");
            showGameOverMessage("draw");
            draw++;
            drawscore.textContent = draw;
            board.resetBoard();
            resetTurn();
        }
        
        switchPlayer();
        printTurn();
    }

    return { playRound, getActivePlayer, getBoard: board.getBoard, resetBoard: board.resetBoard, resetTurn, toggleStartingPlayer };
}

function ScreenController() {
    // variables
    const startScreen = document.querySelector(".start-screen");
    const boardDiv = document.querySelector(".board");
    const restart = document.querySelector(".restart");
    const newGame = document.querySelector(".new-game");

    let game;

    // method to initialize game
    const initializeGame = (player1Name, player2Name) => {
        game = GameController(player1Name, player2Name);
    
        resetResult();
        updatePlayerNames(player1Name, player2Name);
        game.resetTurn();
        createBoard();
    };
    
    // events for game startup

    // method to create board on game startup
    const createBoard = () => {
        boardDiv.innerHTML = ""; // Clear previous board
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
    
    // Handles form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const player1Name = document.querySelector("#player1").value || "Player 1";
        const player2Name = document.querySelector("#player2").value || "Player 2";
        startScreen.close();
        initializeGame(player1Name, player2Name);
    };

    // Handles ESC key (dialog cancellation)
    const handleCancel = (e) => {
        e.preventDefault(); // Prevents the default ESC behavior
        startScreen.close();
        initializeGame("Player 1", "Player 2"); // Defaults if ESC is pressed
    };

    // method to start dialog
    const startDialog = () => {
        startScreen.showModal();
        const form = startScreen.querySelector("form");
    
        // Clean up old listeners to prevent duplicates
        form.removeEventListener("submit", handleSubmit);
        startScreen.removeEventListener("cancel", handleCancel);
    
        // Add fresh event listeners
        form.addEventListener("submit", handleSubmit);
        startScreen.addEventListener("cancel", handleCancel);
    };
    

    // event listener for game startup
    document.addEventListener("DOMContentLoaded", () => {
        startDialog();
    });

    // event listerner for new game
    newGame.addEventListener("click", () => {
        startDialog();
    })

    // event for info buttons

    // method to update game board
    const updateGameBoard = () => {
        const matrix = game.getBoard();
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix.length; j++) {
                const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
                cell.classList.remove("X", "O");
                if(matrix[i][j] !== " ") cell.classList.add(matrix[i][j]);
            }
        }
    }
    
    // method to reset game board
    const resetGameBoard = () => {
        game.toggleStartingPlayer();
        game.resetBoard();
        game.resetTurn();
        updateGameBoard();
    }

    // method to update player names
    const updatePlayerNames = (name1, name2) => {
        document.querySelector(".player1 .name").textContent = name1;
        document.querySelector(".player2 .name").textContent = name2;
    };
    
    // method to reset result
    const resetResult = () => {
        document.querySelector(".player1 .score").textContent = 0;
        document.querySelector(".player2 .score").textContent = 0;
        document.querySelector(".draw .score").textContent = 0;
    };
    
    

    // event listener for restart round button
    restart.addEventListener("click", () => {
        resetGameBoard();
    });
    
    // event listener for marking cells in board
    boardDiv.addEventListener("click", (e) => {
        if (e.target.classList.contains("cell")) {
            game.playRound(e.target.dataset.row, e.target.dataset.col);
            updateGameBoard();
        }
    });
}

ScreenController();