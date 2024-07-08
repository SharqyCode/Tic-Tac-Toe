export class GameSettings {
  private classicMoves: number;
  private _playerScore: number;
  private _opponentScore: number;
  private _playerName: string = "You";
  private _opponentName: string = "CPU";
  private _playerStart: boolean = true;
  private _advPlayerMovesQueue: Element[] = [];
  private _advOpponentMovesQueue: Element[] = [];
  private _advanced: boolean = false;
  private _multi: boolean = false;
  private _playerSymbol: string = "";
  private _opponentSymbol?: string | undefined = "";

  constructor(private board: HTMLDivElement) {
    this.classicMoves = 0;
    this._playerScore = 0;
    this._opponentScore = 0;
  }

  public get playerStart(): boolean {
    return this._playerStart;
  }
  public set playerStart(value: boolean) {
    this._playerStart = value;
  }
  public get advOpponentMovesQueue(): Element[] {
    return this._advOpponentMovesQueue;
  }
  public set advOpponentMovesQueue(value: Element[]) {
    this._advOpponentMovesQueue = value;
  }
  public get advPlayerMovesQueue(): Element[] {
    return this._advPlayerMovesQueue;
  }
  public set advPlayerMovesQueue(value: Element[]) {
    this._advPlayerMovesQueue = value;
  }
  public get opponentName(): string {
    return this._opponentName;
  }
  public set opponentName(value: string) {
    this._opponentName = value;
  }
  public get playerName(): string {
    return this._playerName;
  }
  public set playerName(value: string) {
    this._playerName = value;
  }
  public get opponentScore(): number {
    return this._opponentScore;
  }
  public set opponentScore(value: number) {
    this._opponentScore = value;
  }
  public get playerScore(): number {
    return this._playerScore;
  }
  public set playerScore(value: number) {
    this._playerScore = value;
  }

  public get opponentSymbol(): string | undefined {
    return this._opponentSymbol;
  }
  public set opponentSymbol(value: string | undefined) {
    this._opponentSymbol = value;
  }

  public set playerSymbol(value: string) {
    this._playerSymbol = value;
    this.opponentSymbol = this.playerSymbol == "X" ? "O" : "X";
  }
  public get playerSymbol(): string {
    return this._playerSymbol;
  }
  public get multi(): boolean {
    return this._multi;
  }
  public set multi(value: boolean) {
    this._multi = value;
  }
  public get advanced(): boolean {
    return this._advanced;
  }
  public set advanced(value: boolean) {
    this._advanced = value;
  }

  private getBoardMatrix() {
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
    interface tileCoords {
      x: number;
      y: number;
      priority: number;
    }
    let emptyTiles: tileCoords[] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!tiles[i][j].textContent) {
          let emptyTile: tileCoords = { x: i, y: j, priority: 0 };
          emptyTiles.push(emptyTile);
          // Check if a CPU move on this tile will lead to its win
          tiles[i][j].textContent = cpuSymbol;
          if (this.checkWin() == cpuSymbol) {
            this.classicMoves--;
            if (cpuSymbol === "X") tiles[i][j].classList.add("text-yellow");
            else tiles[i][j].classList.add("text-red");
            this.board.style.pointerEvents = "auto";
            this.endGame();
            return;
          } else tiles[i][j].textContent = "";
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
            if (cpuSymbol === "X") tiles[i][j].classList.add("text-yellow");
            else tiles[i][j].classList.add("text-red");
            this.board.style.pointerEvents = "auto";
            // this.playerStart = true;
            return;
          } else tiles[i][j].textContent = "";
        }
      }
    }
    let finalCoords;
    // if player starts game in the middle tile, place move on corner tiles
    if (
      emptyTiles.length === 8 &&
      tiles[1][1].textContent == this.playerSymbol
    ) {
      let cornerTilesIdex = [0, 2, 5, 7];
      finalCoords = emptyTiles[cornerTilesIdex[Math.floor(Math.random() * 4)]];
    } else {
      finalCoords = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    }
    // If no tile leads to either's win, select random empty tile
    tiles[finalCoords["x"]][finalCoords["y"]].textContent = cpuSymbol;
    this.classicMoves--;
    if (cpuSymbol === "X")
      tiles[finalCoords["x"]][finalCoords["y"]].classList.add("text-yellow");
    else tiles[finalCoords["x"]][finalCoords["y"]].classList.add("text-red");
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
            else tiles[i][j].classList.add("text-red");
            this.classicMoves--;
            this.board.style.pointerEvents = "none";
            if (this.classicMoves > 0 && !this.checkWin()) {
              if (!this.multi) {
                setTimeout(() => {
                  this.classicCPUMove();
                }, 1000);
              } else {
                this.board.style.pointerEvents = "auto";
                this.playerSymbol = this.playerSymbol == "X" ? "O" : "X";
                this.classicPlayerMove();
                return;
              }
            } else {
              this.endGame();
              return;
            }
          }
        });
      }
    }
  }

  private endGame() {
    let winner = this.checkWin();
    if (this.multi) {
      this.playerSymbol = "X";
    }
    let message = "";
    if (winner == this.playerSymbol) {
      this.playerScore++;
      message = `${this.playerName} Won!`;
    } else if (winner == this.opponentSymbol) {
      this.opponentScore++;
      message = `${this.opponentName} Won!`;
    } else {
      message = "It's a Tie!";
    }

    //Set Player one score
    let playerOneScore = document.querySelector(
      "#player_one .card_score"
    ) as HTMLDivElement;
    playerOneScore.textContent = String(this.playerScore);
    // Set Player two/CPU score
    let playerTwoScore = document.querySelector(
      "#player_two .card_score"
    ) as HTMLDivElement;
    playerTwoScore.textContent = String(this.opponentScore);

    // Display game over menu
    let gameOverBackdrop = document.getElementById(
      "gameOverBackdrop"
    ) as HTMLDivElement;
    let gameOverMsg = gameOverBackdrop.querySelector(
      "#gameOverMsg"
    ) as HTMLHeadingElement;
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
      } else {
        this.classicCPUMove();
        this.classicPlayerMove();
      }
    } else {
      if (this.playerStart) {
        this.playerSymbol = "X";
      } else {
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
    if (
      this.advOpponentMovesQueue.length >= 3 &&
      this.advPlayerMovesQueue.length >= 3
    ) {
      if (this.opponentSymbol == "X") {
        poppedTile = this.advPlayerMovesQueue.shift() as HTMLDivElement;
        poppedTile.textContent = "-";
      } else {
        poppedTile = this.advOpponentMovesQueue.shift() as HTMLDivElement;
        poppedTile.textContent = "-";
      }
    }

    interface tileCoords {
      x: number;
      y: number;
      priority: number;
    }

    let emptyTiles: tileCoords[] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!tiles[i][j].textContent) {
          let emptyTile: tileCoords = { x: i, y: j, priority: 0 };
          emptyTiles.push(emptyTile);
          // Check if a CPU move on this tile will lead to its win
          tiles[i][j].textContent = cpuSymbol;
          if (this.checkWin() == cpuSymbol) {
            if (cpuSymbol === "X") tiles[i][j].classList.add("text-yellow");
            else tiles[i][j].classList.add("text-red");

            if (this.opponentSymbol === "X") {
              this.advPlayerMovesQueue.push(tiles[i][j]);
            } else {
              this.advOpponentMovesQueue.push(tiles[i][j]);
            }

            this.board.style.pointerEvents = "auto";
            if (poppedTile) {
              poppedTile.textContent = "";
            }

            this.endGame();
            return;
          } else tiles[i][j].textContent = "";
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
            if (cpuSymbol === "X") tiles[i][j].classList.add("text-yellow");
            else tiles[i][j].classList.add("text-red");
            this.board.style.pointerEvents = "auto";

            if (this.opponentSymbol === "X") {
              this.advPlayerMovesQueue.push(tiles[i][j]);
            } else {
              this.advOpponentMovesQueue.push(tiles[i][j]);
            }
            if (poppedTile) {
              poppedTile.textContent = "";
            }

            return;
          } else tiles[i][j].textContent = "";
        }
      }
    }
    let finalCoords;
    // if player starts game in the middle tile, place move on corner tiles
    if (
      emptyTiles.length === 8 &&
      tiles[1][1].textContent == this.playerSymbol
    ) {
      let cornerTilesIdex = [0, 2, 5, 7];
      finalCoords = emptyTiles[cornerTilesIdex[Math.floor(Math.random() * 4)]];
    } else {
      finalCoords = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    }
    // If no tile leads to either's win, select random empty tile
    tiles[finalCoords["x"]][finalCoords["y"]].textContent = cpuSymbol;
    if (cpuSymbol === "X")
      tiles[finalCoords["x"]][finalCoords["y"]].classList.add("text-yellow");
    else tiles[finalCoords["x"]][finalCoords["y"]].classList.add("text-red");

    if (this.opponentSymbol === "X") {
      this.advPlayerMovesQueue.push(tiles[finalCoords["x"]][finalCoords["y"]]);
    } else {
      this.advOpponentMovesQueue.push(
        tiles[finalCoords["x"]][finalCoords["y"]]
      );
    }

    this.board.style.pointerEvents = "auto";
    if (poppedTile) {
      poppedTile.textContent = "";
    }
    return;
  }

  advancedPlayerMove() {
    const tiles = this.getBoardMatrix();
    let nextTile: HTMLDivElement;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        tiles[i][j].addEventListener("click", () => {
          if (!tiles[i][j].textContent) {
            tiles[i][j].textContent = this.playerSymbol;
            if (this.playerSymbol === "X") {
              if (this.advPlayerMovesQueue.length == 3) {
                let poppedTile =
                  this.advPlayerMovesQueue.shift() as HTMLDivElement;
                poppedTile.textContent = "";
                poppedTile.classList.remove("text-red", "text-yellow");
                poppedTile.style.opacity = "1";
              }
              this.advPlayerMovesQueue.push(tiles[i][j]);
            } else {
              if (this.advOpponentMovesQueue.length == 3) {
                let poppedTile =
                  this.advOpponentMovesQueue.shift() as HTMLDivElement;
                poppedTile.textContent = "";
                poppedTile.classList.remove("text-red", "text-yellow");
                poppedTile.style.opacity = "1";
              }
              this.advOpponentMovesQueue.push(tiles[i][j]);
            }

            if (this.playerSymbol === "X") {
              tiles[i][j].classList.add("text-yellow");
            } else {
              tiles[i][j].classList.add("text-red");
            }
            this.board.style.pointerEvents = "none";
            console.log(this.checkWin());
            // Indicate next tile to be popped
            if (
              this.advOpponentMovesQueue.length >= 3 &&
              this.advPlayerMovesQueue.length >= 3
            ) {
              if (this.playerSymbol == "X") {
                nextTile = this.advPlayerMovesQueue[0] as HTMLDivElement;
                nextTile.style.opacity = "0.5";
              } else {
                nextTile = this.advOpponentMovesQueue[0] as HTMLDivElement;
                nextTile.style.opacity = "0.5";
              }
            }
            if (!this.checkWin()) {
              if (!this.multi) {
                setTimeout(() => {
                  this.advancedCPUMove();
                }, 1000);
              } else {
                this.board.style.pointerEvents = "auto";
                this.playerSymbol = this.playerSymbol == "X" ? "O" : "X";
                this.advancedPlayerMove();
              }
            } else {
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

  checkWin(): string | null {
    const tiles = this.getBoardMatrix();
    if (tiles[2][2].textContent) {
      if (
        tiles[2][2].textContent === tiles[1][2].textContent &&
        tiles[2][2].textContent === tiles[0][2].textContent
      ) {
        return tiles[2][2].textContent;
      }
    }
    for (let i = 0; i < 3; i++) {
      // Check all horizontal wins
      let j = 0;
      if (tiles[i][i].textContent) {
        if (
          tiles[i][i].textContent === tiles[i][(i + 1) % 3].textContent &&
          tiles[i][i].textContent === tiles[i][(i + 2) % 3].textContent
        )
          return tiles[i][i].textContent;
        // Check all diagonal wins
        if (
          tiles[i][i].textContent ===
            tiles[(i + 1) % 3][(i + 1) % 3].textContent &&
          tiles[i][i].textContent ===
            tiles[(i + 2) % 3][(i + 2) % 3].textContent
        )
          return tiles[i][i].textContent;
        // Check all vertical wins
        if (
          tiles[i][i].textContent === tiles[(i + 1) % 3][i].textContent &&
          tiles[i][i].textContent === tiles[(i + 2) % 3][i].textContent
        )
          return tiles[i][i].textContent;
      }
      if (
        tiles[1][1].textContent === tiles[0][2].textContent &&
        tiles[1][1].textContent === tiles[2][0].textContent
      )
        return tiles[1][1].textContent;
    }

    // No wins are found
    return null;
  }

  private getGameInfo() {
    this.board.style.pointerEvents = "auto";
    let tiles = this.getBoardMatrix();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        tiles[i][j].textContent = "";
        tiles[i][j].classList.remove("text-red", "text-yellow");
        (tiles[i][j] as HTMLDivElement).style.opacity = "1";
      }
    }
    //Set Player one score
    let playerOneScore = document.querySelector(
      "#player_one .card_score"
    ) as HTMLDivElement;
    playerOneScore.textContent = String(this.playerScore);
    // Set Player two/CPU score
    let playerTwoScore = document.querySelector(
      "#player_two .card_score"
    ) as HTMLDivElement;
    playerTwoScore.textContent = String(this.opponentScore);

    // Set score board symbols
    let playerOneSymbol = document.querySelector(
      "#player_one .card_symbol"
    ) as HTMLDivElement;
    playerOneSymbol.textContent = String(this.playerSymbol);
    if (playerOneSymbol.textContent == "X") {
      playerOneSymbol.classList.remove("text-red");
      playerOneSymbol.classList.add("text-yellow");
    } else {
      playerOneSymbol.classList.remove("text-yellow");
      playerOneSymbol.classList.add("text-red");
    }

    // Set Player two/CPU score
    let playerTwoSymbol = document.querySelector(
      "#player_two .card_symbol"
    ) as HTMLDivElement;
    playerTwoSymbol.textContent = String(this.opponentSymbol);
    if (playerTwoSymbol.textContent == "X") {
      playerTwoSymbol.classList.remove("text-red");
      playerTwoSymbol.classList.add("text-yellow");
    } else {
      playerTwoSymbol.classList.remove("text-yellow");
      playerTwoSymbol.classList.add("text-red");
    }

    //Set Player one Name
    let playerOneName = document.querySelector(
      "#player_one .card_name"
    ) as HTMLDivElement;
    playerOneName.textContent = this.playerName;
    // Set Player two/CPU Name
    let playerTwoName = document.querySelector(
      "#player_two .card_name"
    ) as HTMLDivElement;
    playerTwoName.textContent = this.opponentName;
  }
}
