"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let gameBoard = document.getElementById("game_board");
function generateBoard() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let tile = document.createElement("div");
            tile.classList.add("game_board_tile", "bg-shadow", "rounded-lg", "w-[118px]", "aspect-square", "font-bold", "text-7xl", "text-center", "grid", "place-items-center");
            tile.dataset.x = `${i}`;
            tile.dataset.y = `${j}`;
            tile.style.transform = "scale(0)";
            gameBoard.appendChild(tile);
        }
    }
    return gameBoard;
}
function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
function displayBoard(tiles) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let tile of tiles) {
            tile.style.transition = "transform 0.3s";
            tile.style.transform = "scale(1)";
            yield delay(100);
        }
    });
}
// Function to create and set up the MutationObserver
function observeDisplayChange(element) {
    // Create a MutationObserver instance
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "attributes" &&
                mutation.attributeName === "style") {
                const currentTransform = element.style.transform;
                if (currentTransform === "scale(1)") {
                    displayBoard(element.children);
                }
            }
        });
    });
    // Configure the observer to watch for changes to attributes
    observer.observe(element, {
        attributes: true,
        attributeFilter: ["style"],
    });
}
// Add event listener to the button to toggle display on click
document.addEventListener("DOMContentLoaded", () => {
    let newGameBoard = generateBoard();
    observeDisplayChange(newGameBoard);
});
