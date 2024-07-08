export class GameSettings {
    constructor(board) {
        this.board = board;
        this._playerName = "You";
        this._opponentName = "CPU";
        this._playerStart = true;
        this._advPlayerMovesQueue = [];
        this._advOpponentMovesQueue = [];
        this._advanced = false;
        this._multi = false;
        this._playerSymbol = "";
        this._opponentSymbol = "";
        this.classicMoves = 0;
        this._playerScore = 0;
        this._opponentScore = 0;
    }
    get playerStart() {
        return this._playerStart;
    }
    set playerStart(value) {
        this._playerStart = value;
    }
    get advOpponentMovesQueue() {
        return this._advOpponentMovesQueue;
    }
    set advOpponentMovesQueue(value) {
        this._advOpponentMovesQueue = value;
    }
    get advPlayerMovesQueue() {
        return this._advPlayerMovesQueue;
    }
    set advPlayerMovesQueue(value) {
        this._advPlayerMovesQueue = value;
    }
    get opponentName() {
        return this._opponentName;
    }
    set opponentName(value) {
        this._opponentName = value;
    }
    get playerName() {
        return this._playerName;
    }
    set playerName(value) {
        this._playerName = value;
    }
    get opponentScore() {
        return this._opponentScore;
    }
    set opponentScore(value) {
        this._opponentScore = value;
    }
    get playerScore() {
        return this._playerScore;
    }
    set playerScore(value) {
        this._playerScore = value;
    }
    get opponentSymbol() {
        return this._opponentSymbol;
    }
    set opponentSymbol(value) {
        this._opponentSymbol = value;
    }
    set playerSymbol(value) {
        this._playerSymbol = value;
        this.opponentSymbol = this.playerSymbol == "X" ? "O" : "X";
    }
    get playerSymbol() {
        return this._playerSymbol;
    }
    get multi() {
        return this._multi;
    }
    set multi(value) {
        this._multi = value;
    }
    get advanced() {
        return this._advanced;
    }
    set advanced(value) {
        this._advanced = value;
    }
    getBoardMatrix() {
        const tiles = Array.from(this.board.querySelectorAll("*"));
        const tilesMatrix = [];
        for (let i = 0; i < 9; i += 3) {
            tilesMatrix.push(tiles.slice(i, i + 3));
        }
        return tilesMatrix;
    }
    classicCPUMove() {
        const cpuSymbol = this.playerSymbol == "X" ? "O" : "X";
        this.opponentSymbol = cpuSymbol;
        const tiles = this.getBoardMatrix();
        let emptyTiles = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!tiles[i][j].textContent) {
                    let emptyTile = { x: i, y: j, priority: 0 };
                    emptyTiles.push(emptyTile);
                    // Check if a CPU move on this tile will lead to its win
                    tiles[i][j].textContent = cpuSymbol;
                    if (this.checkWin() == cpuSymbol) {
                        this.classicMoves--;
                        if (cpuSymbol === "X")
                            tiles[i][j].classList.add("text-yellow");
                        else
                            tiles[i][j].classList.add("text-red");
                        this.board.style.pointerEvents = "auto";
                        this.endGame();
                        return;
                    }
                    else
                        tiles[i][j].textContent = "";
                }
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Check if a player move on this tile will lead to their win
                if (!tiles[i][j].textContent) {
                    tiles[i][j].textContent = this.playerSymbol;
                    if (this.checkWin() == this.playerSymbol) {
                        tiles[i][j].textContent = cpuSymbol;
                        this.classicMoves--;
                        if (cpuSymbol === "X")
                            tiles[i][j].classList.add("text-yellow");
                        else
                            tiles[i][j].classList.add("text-red");
                        this.board.style.pointerEvents = "auto";
                        // this.playerStart = true;
                        return;
                    }
                    else
                        tiles[i][j].textContent = "";
                }
            }
        }
        let finalCoords;
        // if player starts game in the middle tile, place move on corner tiles
        if (emptyTiles.length === 8 &&
            tiles[1][1].textContent == this.playerSymbol) {
            let cornerTilesIdex = [0, 2, 5, 7];
            finalCoords = emptyTiles[cornerTilesIdex[Math.floor(Math.random() * 4)]];
        }
        else {
            finalCoords = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        }
        // If no tile leads to either's win, select random empty tile
        tiles[finalCoords["x"]][finalCoords["y"]].textContent = cpuSymbol;
        this.classicMoves--;
        if (cpuSymbol === "X")
            tiles[finalCoords["x"]][finalCoords["y"]].classList.add("text-yellow");
        else
            tiles[finalCoords["x"]][finalCoords["y"]].classList.add("text-red");
        this.board.style.pointerEvents = "auto";
        // this.playerStart = true;
        return;
    }
    classicPlayerMove() {
        const tiles = this.getBoardMatrix();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                tiles[i][j].addEventListener("click", () => {
                    console.log(this.classicMoves);
                    if (!tiles[i][j].textContent) {
                        tiles[i][j].textContent = this.playerSymbol;
                        if (this.playerSymbol === "X")
                            tiles[i][j].classList.add("text-yellow");
                        else
                            tiles[i][j].classList.add("text-red");
                        this.classicMoves--;
                        this.board.style.pointerEvents = "none";
                        if (this.classicMoves > 0 && !this.checkWin()) {
                            if (!this.multi) {
                                setTimeout(() => {
                                    this.classicCPUMove();
                                }, 1000);
                            }
                            else {
                                this.board.style.pointerEvents = "auto";
                                this.playerSymbol = this.playerSymbol == "X" ? "O" : "X";
                                this.classicPlayerMove();
                                return;
                            }
                        }
                        else {
                            this.endGame();
                            return;
                        }
                    }
                });
            }
        }
    }
    endGame() {
        let winner = this.checkWin();
        if (this.multi) {
            this.playerSymbol = "X";
        }
        let message = "";
        if (winner == this.playerSymbol) {
            this.playerScore++;
            message = `${this.playerName} Won!`;
        }
        else if (winner == this.opponentSymbol) {
            this.opponentScore++;
            message = `${this.opponentName} Won!`;
        }
        else {
            message = "It's a Tie!";
        }
        //Set Player one score
        let playerOneScore = document.querySelector("#player_one .card_score");
        playerOneScore.textContent = String(this.playerScore);
        // Set Player two/CPU score
        let playerTwoScore = document.querySelector("#player_two .card_score");
        playerTwoScore.textContent = String(this.opponentScore);
        // Display game over menu
        let gameOverBackdrop = document.getElementById("gameOverBackdrop");
        let gameOverMsg = gameOverBackdrop.querySelector("#gameOverMsg");
        gameOverMsg.textContent = message;
        gameOverBackdrop.classList.remove("hidden");
    }
    startClassicGame() {
        console.log("new Game!");
        this.getGameInfo();
        this.classicMoves = 9;
        if (!this.multi) {
            if (this.playerStart) {
                this.classicPlayerMove();
            }
            else {
                this.classicCPUMove();
                this.classicPlayerMove();
            }
        }
        else {
            if (this.playerStart) {
                this.playerSymbol = "X";
            }
            else {
                this.playerSymbol = "O";
            }
            this.classicPlayerMove();
        }
    }
    advancedCPUMove() {
        const cpuSymbol = this.playerSymbol == "X" ? "O" : "X";
        this.opponentSymbol = cpuSymbol;
        const tiles = this.getBoardMatrix();
        // Store popped tile in a variable and put a placeholder in its textContent (to prevent re-placement)
        let poppedTile = null;
        if (this.advOpponentMovesQueue.length >= 3 &&
            this.advPlayerMovesQueue.length >= 3) {
            if (this.opponentSymbol == "X") {
                poppedTile = this.advPlayerMovesQueue.shift();
                poppedTile.textContent = "-";
            }
            else {
                poppedTile = this.advOpponentMovesQueue.shift();
                poppedTile.textContent = "-";
            }
        }
        let emptyTiles = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (!tiles[i][j].textContent) {
                    let emptyTile = { x: i, y: j, priority: 0 };
                    emptyTiles.push(emptyTile);
                    // Check if a CPU move on this tile will lead to its win
                    tiles[i][j].textContent = cpuSymbol;
                    if (this.checkWin() == cpuSymbol) {
                        if (cpuSymbol === "X")
                            tiles[i][j].classList.add("text-yellow");
                        else
                            tiles[i][j].classList.add("text-red");
                        if (this.opponentSymbol === "X") {
                            this.advPlayerMovesQueue.push(tiles[i][j]);
                        }
                        else {
                            this.advOpponentMovesQueue.push(tiles[i][j]);
                        }
                        this.board.style.pointerEvents = "auto";
                        if (poppedTile) {
                            poppedTile.textContent = "";
                        }
                        this.endGame();
                        return;
                    }
                    else
                        tiles[i][j].textContent = "";
                }
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Check if a player move on this tile will lead to their win
                if (!tiles[i][j].textContent) {
                    tiles[i][j].textContent = this.playerSymbol;
                    if (this.checkWin() == this.playerSymbol) {
                        tiles[i][j].textContent = cpuSymbol;
                        if (cpuSymbol === "X")
                            tiles[i][j].classList.add("text-yellow");
                        else
                            tiles[i][j].classList.add("text-red");
                        this.board.style.pointerEvents = "auto";
                        if (this.opponentSymbol === "X") {
                            this.advPlayerMovesQueue.push(tiles[i][j]);
                        }
                        else {
                            this.advOpponentMovesQueue.push(tiles[i][j]);
                        }
                        if (poppedTile) {
                            poppedTile.textContent = "";
                        }
                        return;
                    }
                    else
                        tiles[i][j].textContent = "";
                }
            }
        }
        let finalCoords;
        // if player starts game in the middle tile, place move on corner tiles
        if (emptyTiles.length === 8 &&
            tiles[1][1].textContent == this.playerSymbol) {
            let cornerTilesIdex = [0, 2, 5, 7];
            finalCoords = emptyTiles[cornerTilesIdex[Math.floor(Math.random() * 4)]];
        }
        else {
            finalCoords = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        }
        // If no tile leads to either's win, select random empty tile
        tiles[finalCoords["x"]][finalCoords["y"]].textContent = cpuSymbol;
        if (cpuSymbol === "X")
            tiles[finalCoords["x"]][finalCoords["y"]].classList.add("text-yellow");
        else
            tiles[finalCoords["x"]][finalCoords["y"]].classList.add("text-red");
        if (this.opponentSymbol === "X") {
            this.advPlayerMovesQueue.push(tiles[finalCoords["x"]][finalCoords["y"]]);
        }
        else {
            this.advOpponentMovesQueue.push(tiles[finalCoords["x"]][finalCoords["y"]]);
        }
        this.board.style.pointerEvents = "auto";
        if (poppedTile) {
            poppedTile.textContent = "";
        }
        return;
    }
    advancedPlayerMove() {
        const tiles = this.getBoardMatrix();
        let nextTile;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                tiles[i][j].addEventListener("click", () => {
                    if (!tiles[i][j].textContent) {
                        tiles[i][j].textContent = this.playerSymbol;
                        if (this.playerSymbol === "X") {
                            if (this.advPlayerMovesQueue.length == 3) {
                                let poppedTile = this.advPlayerMovesQueue.shift();
                                poppedTile.textContent = "";
                                poppedTile.classList.remove("text-red", "text-yellow");
                                poppedTile.style.opacity = "1";
                            }
                            this.advPlayerMovesQueue.push(tiles[i][j]);
                        }
                        else {
                            if (this.advOpponentMovesQueue.length == 3) {
                                let poppedTile = this.advOpponentMovesQueue.shift();
                                poppedTile.textContent = "";
                                poppedTile.classList.remove("text-red", "text-yellow");
                                poppedTile.style.opacity = "1";
                            }
                            this.advOpponentMovesQueue.push(tiles[i][j]);
                        }
                        if (this.playerSymbol === "X") {
                            tiles[i][j].classList.add("text-yellow");
                        }
                        else {
                            tiles[i][j].classList.add("text-red");
                        }
                        this.board.style.pointerEvents = "none";
                        console.log(this.checkWin());
                        // Indicate next tile to be popped
                        if (this.advOpponentMovesQueue.length >= 3 &&
                            this.advPlayerMovesQueue.length >= 3) {
                            if (this.playerSymbol == "X") {
                                nextTile = this.advPlayerMovesQueue[0];
                                nextTile.style.opacity = "0.5";
                            }
                            else {
                                nextTile = this.advOpponentMovesQueue[0];
                                nextTile.style.opacity = "0.5";
                            }
                        }
                        if (!this.checkWin()) {
                            if (!this.multi) {
                                setTimeout(() => {
                                    this.advancedCPUMove();
                                }, 1000);
                            }
                            else {
                                this.board.style.pointerEvents = "auto";
                                this.playerSymbol = this.playerSymbol == "X" ? "O" : "X";
                                this.advancedPlayerMove();
                            }
                        }
                        else {
                            this.endGame();
                            return;
                        }
                    }
                });
            }
        }
    }
    startAdvancedGame() {
        this.getGameInfo();
        this.advPlayerMovesQueue = [];
        this.advOpponentMovesQueue = [];
        this.advancedPlayerMove();
    }
    checkWin() {
        const tiles = this.getBoardMatrix();
        if (tiles[2][2].textContent) {
            if (tiles[2][2].textContent === tiles[1][2].textContent &&
                tiles[2][2].textContent === tiles[0][2].textContent) {
                return tiles[2][2].textContent;
            }
        }
        for (let i = 0; i < 3; i++) {
            // Check all horizontal wins
            let j = 0;
            if (tiles[i][i].textContent) {
                if (tiles[i][i].textContent === tiles[i][(i + 1) % 3].textContent &&
                    tiles[i][i].textContent === tiles[i][(i + 2) % 3].textContent)
                    return tiles[i][i].textContent;
                // Check all diagonal wins
                if (tiles[i][i].textContent ===
                    tiles[(i + 1) % 3][(i + 1) % 3].textContent &&
                    tiles[i][i].textContent ===
                        tiles[(i + 2) % 3][(i + 2) % 3].textContent)
                    return tiles[i][i].textContent;
                // Check all vertical wins
                if (tiles[i][i].textContent === tiles[(i + 1) % 3][i].textContent &&
                    tiles[i][i].textContent === tiles[(i + 2) % 3][i].textContent)
                    return tiles[i][i].textContent;
            }
            if (tiles[1][1].textContent === tiles[0][2].textContent &&
                tiles[1][1].textContent === tiles[2][0].textContent)
                return tiles[1][1].textContent;
        }
        // No wins are found
        return null;
    }
    getGameInfo() {
        this.board.style.pointerEvents = "auto";
        let tiles = this.getBoardMatrix();
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                tiles[i][j].textContent = "";
                tiles[i][j].classList.remove("text-red", "text-yellow");
                tiles[i][j].style.opacity = "1";
            }
        }
        //Set Player one score
        let playerOneScore = document.querySelector("#player_one .card_score");
        playerOneScore.textContent = String(this.playerScore);
        // Set Player two/CPU score
        let playerTwoScore = document.querySelector("#player_two .card_score");
        playerTwoScore.textContent = String(this.opponentScore);
        // Set score board symbols
        let playerOneSymbol = document.querySelector("#player_one .card_symbol");
        playerOneSymbol.textContent = String(this.playerSymbol);
        if (playerOneSymbol.textContent == "X") {
            playerOneSymbol.classList.remove("text-red");
            playerOneSymbol.classList.add("text-yellow");
        }
        else {
            playerOneSymbol.classList.remove("text-yellow");
            playerOneSymbol.classList.add("text-red");
        }
        // Set Player two/CPU score
        let playerTwoSymbol = document.querySelector("#player_two .card_symbol");
        playerTwoSymbol.textContent = String(this.opponentSymbol);
        if (playerTwoSymbol.textContent == "X") {
            playerTwoSymbol.classList.remove("text-red");
            playerTwoSymbol.classList.add("text-yellow");
        }
        else {
            playerTwoSymbol.classList.remove("text-yellow");
            playerTwoSymbol.classList.add("text-red");
        }
        //Set Player one Name
        let playerOneName = document.querySelector("#player_one .card_name");
        playerOneName.textContent = this.playerName;
        // Set Player two/CPU Name
        let playerTwoName = document.querySelector("#player_two .card_name");
        playerTwoName.textContent = this.opponentName;
    }
}
