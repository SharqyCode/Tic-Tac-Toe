import { hideScreen, loadNextScreen } from "./transition.js";
import { GameSettings } from "./gameSettings.js";
// Audio path
let swooshAudio = "./../src/sounds/swoosh.m4a";
// App Screens
let title_screen = document.getElementById("title_screen");
let mode_screen = document.getElementById("mode_screen");
let opp_screen = document.getElementById("opp_screen");
let single_screen = document.getElementById("single_screen");
let multi_screen = document.getElementById("multi_screen");
let game_screen = document.getElementById("game_screen");
// Title Screen Components
let btnPlay = document.getElementById("btnPlay");
let btnExit = document.getElementById("btnExit");
// Game Mode Screen Components
let btnClassic = document.getElementById("btnClassic");
let btnAdvanced = document.getElementById("btnAdvanced");
// Opponent Screen Components
let btnCPU = document.getElementById("btnCPU");
let btn1v1 = document.getElementById("btn1v1");
// Single Screen Components
let chooseX = document.getElementById("choose_X");
let chooseO = document.getElementById("choose_O");
let btnGlowDivs = document.getElementsByClassName("btnGlow");
let startBtn_single = single_screen.querySelector(".btnStart");
// Multi Screen Components
let startBtn_multi = multi_screen.querySelector(".btnStart");
let playerOneInput = multi_screen.querySelector("input[name=player_one]");
let playerTwoInput = multi_screen.querySelector("input[name=player_two]");
// Game Screen Components
let btnPause = document.getElementById("btnPause");
let pauseBackdrop = document.getElementById("pauseBackdrop");
let btnContinue = document.getElementById("btnContinue");
let btnExitGame = document.querySelector("#gameOverMenu .buttons .btnExitGame");
let gameOverBackdrop = document.getElementById("gameOverBackdrop");
// Back buttons
let backBtn_mode = mode_screen.querySelector(".btnBack");
let backBtn_opp = opp_screen.querySelector(".btnBack");
let backBtn_single = single_screen.querySelector(".btnBack");
let backBtn_multi = multi_screen.querySelector(".btnBack");
window.onload = () => {
    hideScreen(mode_screen);
    hideScreen(opp_screen);
    hideScreen(single_screen);
    hideScreen(multi_screen);
    hideScreen(game_screen);
};
let gameBoard = document.getElementById("game_board");
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
        glow.style.display = "none";
    });
    let btnGlow = chooseX.querySelector(".btnGlow");
    btnGlow.style.display = "block";
});
chooseO.addEventListener("click", () => {
    gs.playerSymbol = chooseO.value;
    Array.from(btnGlowDivs).forEach((glow) => {
        glow.style.display = "none";
    });
    let btnGlow = chooseO.querySelector(".btnGlow");
    btnGlow.style.display = "block";
});
startBtn_single.addEventListener("click", (e) => {
    if (gs.playerSymbol) {
        gs.playerScore = 0;
        gs.opponentScore = 0;
        if (!gs.advanced)
            gs.startClassicGame();
        else
            gs.startAdvancedGame();
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
        if (!gs.advanced)
            gs.startClassicGame();
        else
            gs.startAdvancedGame();
        loadNextScreen(multi_screen, game_screen, e, swooshAudio);
    }
});
btnPause.addEventListener("click", () => {
    let pauseBackdrop = document.getElementById("pauseBackdrop");
    pauseBackdrop.classList.remove("hidden");
    pauseBackdrop.addEventListener("click", (e) => {
        if (e.target.id == "pauseBackdrop")
            pauseBackdrop.classList.add("hidden");
    });
    let btnResume = document.getElementById("btnResume");
    let btnExit = document.querySelector("#pauseMenu .buttons .btnExitGame");
    btnResume.addEventListener("click", (e) => {
        pauseBackdrop.classList.add("hidden");
    });
    btnExit.addEventListener("click", (e) => {
        pauseBackdrop.classList.add("hidden");
        Array.from(btnGlowDivs).forEach((glow) => {
            glow.style.display = "none";
        });
        loadNextScreen(game_screen, title_screen, e, swooshAudio);
    });
});
btnContinue.addEventListener("click", () => {
    gameOverBackdrop.classList.add("hidden");
    gs.playerStart = !gs.playerStart;
    if (!gs.advanced) {
        gs.startClassicGame();
    }
    else {
        gs.startAdvancedGame();
    }
});
btnExitGame.addEventListener("click", (e) => {
    gameOverBackdrop.classList.add("hidden");
    Array.from(btnGlowDivs).forEach((glow) => {
        glow.style.display = "none";
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
        glow.style.display = "none";
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
