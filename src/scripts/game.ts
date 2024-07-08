import { hideScreen, loadNextScreen } from "./transition.js";
import { GameSettings } from "./gameSettings.js";
// Audio path
let swooshAudio = "./../src/sounds/swoosh.m4a";

// App Screens
let title_screen = document.getElementById("title_screen") as HTMLDivElement;
let mode_screen = document.getElementById("mode_screen") as HTMLDivElement;
let opp_screen = document.getElementById("opp_screen") as HTMLDivElement;
let single_screen = document.getElementById("single_screen") as HTMLDivElement;
let multi_screen = document.getElementById("multi_screen") as HTMLDivElement;
let game_screen = document.getElementById("game_screen") as HTMLDivElement;

// Title Screen Components
let btnPlay = document.getElementById("btnPlay") as HTMLButtonElement;
let btnExit = document.getElementById("btnExit") as HTMLButtonElement;

// Game Mode Screen Components
let btnClassic = document.getElementById("btnClassic") as HTMLButtonElement;
let btnAdvanced = document.getElementById("btnAdvanced") as HTMLButtonElement;

// Opponent Screen Components
let btnCPU = document.getElementById("btnCPU") as HTMLButtonElement;
let btn1v1 = document.getElementById("btn1v1") as HTMLButtonElement;

// Single Screen Components
let chooseX = document.getElementById("choose_X") as HTMLButtonElement;
let chooseO = document.getElementById("choose_O") as HTMLButtonElement;
let btnGlowDivs = document.getElementsByClassName("btnGlow");
let startBtn_single = single_screen.querySelector(
  ".btnStart"
) as HTMLButtonElement;

// Multi Screen Components
let startBtn_multi = multi_screen.querySelector(
  ".btnStart"
) as HTMLButtonElement;
let playerOneInput = multi_screen.querySelector(
  "input[name=player_one]"
) as HTMLInputElement;
let playerTwoInput = multi_screen.querySelector(
  "input[name=player_two]"
) as HTMLInputElement;
// Game Screen Components
let btnPause = document.getElementById("btnPause") as HTMLButtonElement;
let pauseBackdrop = document.getElementById("pauseBackdrop") as HTMLDivElement;
let btnContinue = document.getElementById("btnContinue") as HTMLButtonElement;
let btnExitGame = document.querySelector(
  "#gameOverMenu .buttons .btnExitGame"
) as HTMLButtonElement;
let gameOverBackdrop = document.getElementById(
  "gameOverBackdrop"
) as HTMLDivElement;

// Back buttons
let backBtn_mode = mode_screen.querySelector(".btnBack") as HTMLButtonElement;
let backBtn_opp = opp_screen.querySelector(".btnBack") as HTMLButtonElement;
let backBtn_single = single_screen.querySelector(
  ".btnBack"
) as HTMLButtonElement;
let backBtn_multi = multi_screen.querySelector(".btnBack") as HTMLButtonElement;

window.onload = () => {
  hideScreen(mode_screen);
  hideScreen(opp_screen);
  hideScreen(single_screen);
  hideScreen(multi_screen);
  hideScreen(game_screen);
};

let gameBoard = document.getElementById("game_board") as HTMLDivElement;
let gs = new GameSettings(gameBoard);

// Move Forwards
btnPlay.addEventListener("click", (e) => {
  loadNextScreen(title_screen, mode_screen, e, swooshAudio);
});

btnClassic.addEventListener("click", (e) => {
  loadNextScreen(mode_screen, opp_screen, e, swooshAudio);
});

btnAdvanced.addEventListener("click", (e) => {
  gs.advanced = true;
  loadNextScreen(mode_screen, opp_screen, e, swooshAudio);
});

btnCPU.addEventListener("click", (e) => {
  multi_screen.style.display = "none";
  loadNextScreen(opp_screen, single_screen, e, swooshAudio);
});

btn1v1.addEventListener("click", (e) => {
  single_screen.style.display = "none";
  loadNextScreen(opp_screen, multi_screen, e, swooshAudio);
});

chooseX.addEventListener("click", () => {
  gs.playerSymbol = chooseX.value;
  Array.from(btnGlowDivs).forEach((glow) => {
    (glow as HTMLDivElement).style.display = "none";
  });
  let btnGlow = chooseX.querySelector(".btnGlow") as HTMLDivElement;
  btnGlow.style.display = "block";
});

chooseO.addEventListener("click", () => {
  gs.playerSymbol = chooseO.value;
  Array.from(btnGlowDivs).forEach((glow) => {
    (glow as HTMLDivElement).style.display = "none";
  });
  let btnGlow = chooseO.querySelector(".btnGlow") as HTMLDivElement;
  btnGlow.style.display = "block";
});

startBtn_single.addEventListener("click", (e) => {
  if (gs.playerSymbol) {
    gs.playerScore = 0;
    gs.opponentScore = 0;
    if (!gs.advanced) gs.startClassicGame();
    else gs.startAdvancedGame();
    loadNextScreen(single_screen, game_screen, e, swooshAudio);
  }
});

startBtn_multi.addEventListener("click", (e) => {
  if (playerOneInput.value && playerTwoInput.value) {
    gs.playerName = playerOneInput.value;
    gs.opponentName = playerTwoInput.value;
    gs.playerSymbol = "X";
    gs.opponentSymbol = "O";
    gs.multi = true;
    gs.playerScore = 0;
    gs.opponentScore = 0;
    if (!gs.advanced) gs.startClassicGame();
    else gs.startAdvancedGame();
    loadNextScreen(multi_screen, game_screen, e, swooshAudio);
  }
});

btnPause.addEventListener("click", () => {
  let pauseBackdrop = document.getElementById(
    "pauseBackdrop"
  ) as HTMLDivElement;
  pauseBackdrop.classList.remove("hidden");

  pauseBackdrop.addEventListener("click", (e) => {
    if ((e.target as HTMLDivElement).id == "pauseBackdrop")
      pauseBackdrop.classList.add("hidden");
  });

  let btnResume = document.getElementById("btnResume") as HTMLButtonElement;
  let btnExit = document.querySelector(
    "#pauseMenu .buttons .btnExitGame"
  ) as HTMLButtonElement;

  btnResume.addEventListener("click", (e) => {
    pauseBackdrop.classList.add("hidden");
  });

  btnExit.addEventListener("click", (e) => {
    pauseBackdrop.classList.add("hidden");
    Array.from(btnGlowDivs).forEach((glow) => {
      (glow as HTMLDivElement).style.display = "none";
    });
    loadNextScreen(game_screen, title_screen, e, swooshAudio);
  });
});

btnContinue.addEventListener("click", () => {
  gameOverBackdrop.classList.add("hidden");
  gs.playerStart = !gs.playerStart;
  if (!gs.advanced) {
    gs.startClassicGame();
  } else {
    gs.startAdvancedGame();
  }
});

btnExitGame.addEventListener("click", (e) => {
  gameOverBackdrop.classList.add("hidden");
  Array.from(btnGlowDivs).forEach((glow) => {
    (glow as HTMLDivElement).style.display = "none";
  });

  loadNextScreen(game_screen, title_screen, e, swooshAudio);
});
// Move Backwards
backBtn_mode.addEventListener("click", (e) => {
  loadNextScreen(mode_screen, title_screen, e, swooshAudio);
});

backBtn_opp.addEventListener("click", (e) => {
  loadNextScreen(opp_screen, mode_screen, e, swooshAudio);
});

backBtn_single.addEventListener("click", (e) => {
  Array.from(btnGlowDivs).forEach((glow) => {
    (glow as HTMLDivElement).style.display = "none";
  });
  loadNextScreen(single_screen, opp_screen, e, swooshAudio);
});

backBtn_multi.addEventListener("click", (e) => {
  loadNextScreen(multi_screen, opp_screen, e, swooshAudio);
});

// Exit Game
btnExit.addEventListener("click", () => {
  window.close();
});
